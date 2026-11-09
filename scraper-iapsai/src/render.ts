import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

import { EXTRACT_DIR, ROOT_DIR, PNG_DIR } from "./config";



const execFileAsync = promisify(execFile);

async function pdfToPng(numeJudet: string) {
    // 1. Citeste recursiv folderul extras/       -- returns a string[] -- relative path to EXTRACT_DIR
    const files = await fs.readdir(EXTRACT_DIR, {
        recursive: true
    });

    console.log("EXTRACT_DIR:", EXTRACT_DIR);
        console.log("FILES:", files);

    // 2. Pastram doar PDF-urile        //e.g. "Dolj/2024/subiect.pdf", "Dolj/2024/barem.pdf"  
    const pdfs = files.filter(file =>{
      const folderName = path.dirname(file);

      return (
        file.toLowerCase().endsWith(".pdf") &&
        folderName.toLowerCase().includes(numeJudet.toLowerCase())
      );
    }
    );


            console.log("PDFS gasite:", pdfs);



    // 3. Proceseaza fiecare PDF
    for (const relativePdfPath of pdfs) {

        const pdfPath = path.join(
            EXTRACT_DIR,
            relativePdfPath
        );

        // ex:
        // relativePdfPath = "Dolj/subiect.pdf"

        const parsed = path.parse(relativePdfPath);

        // parsed.dir  = "Dolj"
        // parsed.name = "subiect"

        const outputDir = path.join(
            PNG_DIR,
            parsed.dir,
            parsed.name
        );

        await fs.mkdir(outputDir, {
            recursive: true
        });

        const outputPrefix = path.join(
            outputDir,
            "page"
        );

        await execFileAsync("pdftoppm", [
            "-png",
            "-r",
            "300",
            pdfPath,
            outputPrefix
        ]);
    }
}

await pdfToPng("dolj");