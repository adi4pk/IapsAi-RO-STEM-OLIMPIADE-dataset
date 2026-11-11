import { execFile } from "child_process";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

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
async function pngFolderToMarkdown(judet: string, folder: string): Promise<string> {
  

    const folderPath = path.join(
        projectRoot,
        "png",
        judet,
        folder
    );

 const files = await readdir(folderPath);

  const pngFiles = files
    .filter((file) => file.endsWith(".png"))
    .sort((a, b) => {
      const pageA = Number(a.match(/page-(\d+)/)?.[1]);
      const pageB = Number(b.match(/page-(\d+)/)?.[1]);

      return pageA - pageB;
    });

  let markdown = "";

  for (const file of pngFiles) {
    const pngPath = path.join(folderPath, file);

    const pageMarkdown = await pngToMarkdown(pngPath);

    markdown += pageMarkdown + "\n\n";
  }

  return markdown;
}




// const markdown = await pngToMarkdown(
//     projectRoot
// );

//nume Judet + nume .png
const markdown = await pngFolderToMarkdown("iasi", "10_H1_subiect");

console.log(markdown);