import fs from "fs/promises";

interface Problema {
  numar: number;
  enunt: string;
  subpuncte: string[];
}

async function parseMarkdown(filePath: string): Promise<Problema[]> {

  // 1. Citim fisierul Markdown
  const markdown = await fs.readFile(filePath, "utf8");

  // 2. Facem split la document pe baza "## Problema X"
  const sections = markdown.split(/##\s+Problema\s+\d+/i);

  // Gasim separat numerele problemelor     -- returns an array of matches
  const matches = [
    ...markdown.matchAll(/##\s+Problema\s+(\d+)/gi)
  ];    //we use spread operator to consume the iterator's values
  // e.g. markdown[0][0] = "Problema 1" -- [0] is the group, second [0] is entire text from group [0]

  const probleme: Problema[] = [];

  // 3. Procesam fiecare problema
  for (let i = 1; i < sections.length; i++) {

    const section = sections[i].trim();

    const numar = Number(matches[i - 1][1]);

    const lines = section
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const subpuncte: string[] = [];
    const enuntLines: string[] = [];

    for (const line of lines) {

      // identifica 1. 2. 3. etc.
      const match = line.match(/^\d+\.\s+(.*)$/);

      if (match) {
        subpuncte.push(match[1]);
      } else {
        enuntLines.push(line);
      }
    }

    probleme.push({
      numar,
      enunt: enuntLines.join("\n"),
      subpuncte
    });
  }

  return probleme;
}