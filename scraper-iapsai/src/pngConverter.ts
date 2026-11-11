import { execFile } from "child_process";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PNG_DIR, MARKDOWN_DIR } from "./config";
import fs from "fs/promises";
import {mkdir, writeFile } from "fs/promises";



const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const projectRoot = path.resolve(dirname, "..");


//run indra locally from pythonRuntime via execFile()
// convert one page at a time
function pngToMarkdown(pngPath: string): Promise<string> {
  return new Promise((resolve, reject) => {

    //PowerShell: indra-ocr ".\png\iasi\10_H1_subiect\page-1.png" --math

    execFile("indra-ocr", [pngPath, "--math"], {
                encoding: "utf8",
                env: {
                    ...process.env,
                    PYTHONIOENCODING: "utf-8"
                }
            }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        console.error(stderr);
      }

      resolve(stdout);  //indra's output
    });
  });

  
}

//run through entire folder and execute pngToMarkdown() on each .png file
//packs markdown files together, returns whole .MD file with all pages
async function pngFolderToMarkdown(
  judet: string,
  folder: string,
): Promise<string> {
  // 1. Construim calea către folderul cu PNG-uri
  const folderPath = path.join(PNG_DIR, judet, folder);

  // 2. Citim toate fișierele din folder
  const files = await readdir(folderPath);

  const pngFiles = files
    .filter((file) => file.endsWith(".png"))
    .sort((a, b) => {
      const pageA = Number(a.match(/page-(\d+)/)?.[1]);
      const pageB = Number(b.match(/page-(\d+)/)?.[1]);

      return pageA - pageB;
    });

  let markdown = "";

  //Procesam fiecare PNG cu Indra
  for (const file of pngFiles) {
    const pngPath = path.join(PNG_DIR, judet, folder, file);

    const pageMarkdown = await pngToMarkdown(pngPath);

    markdown += pageMarkdown + "\n\n";
  }

  //Salvam Markdown-ul intr-un fisier .md
  const markdownPath = await saveMarkdown(markdown, judet, folder);
  // return markdown;


  // Returnam path-ul fisierului creat --> trimitem mai departe către parseMarkdown()
  return markdownPath;
}


async function saveMarkdown(markdown: string, judet: string, folder: string): Promise<string> {

  const outputDir = path.join(MARKDOWN_DIR, judet);

  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(
    outputDir,
    `${folder}.md`
  );

  await writeFile(outputPath, markdown, "utf8");

  return outputPath;
}




// const markdown = await pngToMarkdown(
//     projectRoot
// );

//nume Judet + nume .png
const markdown = await pngFolderToMarkdown("iasi", "10_H1_subiect");



console.log(markdown);