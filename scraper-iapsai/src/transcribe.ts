import fs from "fs/promises";
import path from "path";
import { MARKDOWN_DIR, DATASET_DIR } from "./config";

interface Problema {
  numar: number;
  enunt: string;
  subpuncte: string[];
}

async function parseMarkdown(
  judet: string,
  fileName: string
): Promise<Problema[]> {


  // Construim pathul
const filePath = path.join(
    MARKDOWN_DIR,
    judet,
    fileName
  );

  
  // 1. Citim fisierul Markdown
  const markdown = await fs.readFile(filePath, "utf8");

  // 2. Facem split la document pe baza "## Problema x" sau "## Subiectul x"
  const sections = markdown.split(/#{2,3}\s+(?:Problema|Subiectul)\s+\d+/gi);
  

  // Gasim separat numerele problemelor     -- returns an array of matches
  const matches = [
    ...markdown.matchAll(/#{2,3}\s+(?:Problema|Subiectul)\s+(\d+)/gi)
  ];    //we use spread operator to consume the iterator's values
  // e.g. markdown[0][0] = "Problema 1" -- [0] is the group, second [0] is entire text from group [0]

  const probleme: Problema[] = [];

  // 3. Procesam fiecare problema
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].split(/###\s+Timp de lucru/i)[0].trim();
    const numar = Number(matches[i - 1][1]);

    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const subpuncte: string[] = [];
    const enuntLines: string[] = [];

    for (const line of lines) {
      // identifica 1. 2. 3. etc.
      const match = line.match(/^(?:\d+\.\s+|-\s+)(.*)$/);

      if (match) {
        subpuncte.push(match[1]);
      } else {
        enuntLines.push(line);
      }
    }

    probleme.push({
      numar,
      enunt: enuntLines.join("\n"),
      subpuncte,
    });
  }

  return probleme;
}



async function saveToJsonl(probleme: Problema[], fileName: string): Promise<void> {

  const jsonl = probleme.map((problema) => JSON.stringify(problema)).join("\n");

  await fs.mkdir(DATASET_DIR, {
    recursive: true,
  });

  const outputPath = path.join(DATASET_DIR, fileName.replace(".md", ".jsonl"));

  await fs.writeFile(outputPath, jsonl, "utf8");
}


async function markdownToJsonl(
  judet: string,
  fileName: string
): Promise<void> {

  const probleme = await parseMarkdown(
    judet,
    fileName
  );

  await saveToJsonl(
    probleme,
    fileName
  );
}


// const probleme = await parseMarkdown(markdownPath);

// await saveToJsonl(
//   probleme,
//   jsonlPath

await markdownToJsonl("iasi", "10_H1_subiect.md");