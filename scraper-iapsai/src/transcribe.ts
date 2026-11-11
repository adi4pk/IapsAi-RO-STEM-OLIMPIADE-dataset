import fs from "fs/promises";
import path from "path";
import { MARKDOWN_DIR, DATASET_DIR } from "./config";
import type { ProblemMetadata } from "./models/ProblemMetaData";
import type { ParsedProblem } from "./models/ParsedProblem";
import { buildDatasetRecord } from "./datasetBuilder";

interface Problema {
  numar: number;
  enunt: string;
  subpuncte: string[];
}

function parseMarkdown(markdown: string): ParsedProblem[] {

  const problems: ParsedProblem[] = [];

  // extragem anul documentului
  const anMatch = markdown.match(/\b(20\d{2})\b/);
  const an = anMatch ? Number(anMatch[1]) : 0;

  // extragem JUDETUL
  // const judetMatch = markdown.match(/Județ(?:ul)?[:\s]+([^\n]+)/i);
  const judetMatch = markdown.match(/Etapa\s+(?:locală|locala|județeană|judeteana|națională|nationala)\s*,\s*([^\n]+)/i);
  const judet = judetMatch ? judetMatch[1].trim() : undefined;
  


  //extragem ETAPA
  const etapaJudetMatch = markdown.match(/Etapa\s+(locală|locala|județeană|judeteana|națională|nationala)\s*,\s*([^\n]+)/i);
  // const etapa = etapaJudetMatch ? etapaJudetMatch[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""): "";

  const etapaRaw = etapaJudetMatch
    ? etapaJudetMatch[1]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";

  if (
    etapaRaw !== "locala" &&
    etapaRaw !== "judeteana" &&
    etapaRaw !== "nationala"
  ) {
    throw new Error("Etapa nu a putut fi identificata.");
  }

const etapa: ParsedProblem["etapa"] = etapaRaw;


// extragem CLASA
  const clasaMatch = markdown.match(/Clasa\s+a\s+(IX|X|XI|XII)-a/i);

  const romanToNumber: Record<string, number> = {IX: 9, X: 10, XI: 11, XII: 12};

  const clasa = clasaMatch ? romanToNumber[clasaMatch[1].toUpperCase()]: 0;

  // separam problemele
  const sections = markdown.split(
    /#{2,3}\s+(?:Problema|Subiectul)\s+\d+/gi
  );

  // extragem numerele problemelor
  const matches = [
    ...markdown.matchAll(
      /#{2,3}\s+(?:Problema|Subiectul)\s+(\d+)/gi
    )
  ];

  for (let i = 1; i < sections.length; i++) {

    const section = sections[i]
      .split(/###\s+Timp de lucru/i)[0]
      .trim();

    const nrProblema = Number(matches[i - 1][1]);

    const problem: ParsedProblem = {
      an,
      judet,
      etapa,
      clasa,
      nr_problema: nrProblema,
      enunt: section
    };

    problems.push(problem);
  }

  return problems;
}



async function saveToJson(records: ReturnType<typeof buildDatasetRecord>[], fileName: string): Promise<void> {
  
  
  const outputPath = path.join(
    DATASET_DIR,
    fileName.replace(".md", ".jsonl")
  );

  const jsonl = records
    .map(record => JSON.stringify(record))
    .join("\n");

    
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, jsonl + "\n", "utf-8");;
}


async function markdownToJsonl(
  fileName: string
): Promise<void> {

  const markdownPath = path.join(MARKDOWN_DIR, fileName);
  const markdown = await fs.readFile(markdownPath, "utf-8");

  const probleme = parseMarkdown(markdown);

  if (probleme.length === 0) {
    throw new Error("Nu au fost gasite probleme in Markdown.");
  }

  const metadata: ProblemMetadata = {
    materie: "matematica",
    sursa_url: `https://ssmr.ro/onm${probleme[0].an}`,
    fisier_sursa: "",
    licenta: "© SSMR. Utilizare comercială doar cu acordul scris al SSMR."
  };

  const records = probleme.map(problem =>
    buildDatasetRecord(problem, metadata)
  );

  await saveToJson(records, fileName);
}



// const probleme = await parseMarkdown(markdownPath);

// await saveToJsonl(
//   probleme,
//   jsonlPath

await markdownToJsonl("iasi/10_H1_subiect.md");