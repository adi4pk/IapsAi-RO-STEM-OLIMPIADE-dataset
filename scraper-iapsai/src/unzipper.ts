import { ARCHIVE_DIR, DOWNLOAD_DIR, EXTRACT_DIR } from "./config";
import * as fs from "fs/promises";
import * as path from "path";
import AdmZip from "adm-zip";
import { mkdir, readdir } from "fs";

async function main(){

    const files = await fs.readdir(ARCHIVE_DIR, {recursive: true});            //"archive"  - numele sunt relative la folderul dat ("archive");
    const zips = files.filter(file => file.toLowerCase().endsWith(".zip"));     //returneaza string cu fiecare path

    if(zips.length === 0){
        console.log("Nu a fost gasit niciun fisier zip. Ai rulat scriptul de download?");
        return;
    }

    for(const relativeZipPath of zips){
        const zipPath = path.join(ARCHIVE_DIR, relativeZipPath);       // C:\...\archive\dolj\archive.zip
        const judet = path.dirname(relativeZipPath);        // numele judetului - dolj
        const destDir = path.join(EXTRACT_DIR, judet);     //extras/Dolj

        await fs.mkdir(destDir, {recursive:true});

        const zip = new AdmZip(zipPath);
        zip.getEntries()
        .filter(e=> !e.isDirectory && e.name.toLowerCase().endsWith(".pdf"))
        .forEach(e => zip.extractEntryTo(e, destDir, false, true));

        console.log(files);
        console.log(`Extras  ${zipPath} -> ${destDir}`);        
        //Fiecare PDF ajunge într-un folder extras/ lângă zip-ul lui; e.g. archive/dolj/extras/.
    }
}

main();