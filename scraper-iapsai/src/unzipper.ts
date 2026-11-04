import { DOWNLOAD_DIR } from "./config";
import * as fs from "fs/promises";
import * as path from "path";
import AdmZip from "adm-zip";
import { readdir } from "fs";

async function main(){

    const files = await fs.readdir(DOWNLOAD_DIR, {recursive: true});            //"dolj/archive.zip"  - numele sunt relative la folderul dat ("archive");
    const zips = files.filter(file => file.toLowerCase().endsWith(".zip"));     //returneaza string cu fiecare path

    if(zips.length === 0){
        console.log("Nu a fost gasit niciun fisier zip. Ai rulat scriptul de download?");
        return;
    }

    for(const relativeZipPath of zips){
        const zipPath = path.join(DOWNLOAD_DIR, relativeZipPath);       //"archive/Dolj/archive.zip"
        const destDir = path.join(path.dirname(zipPath), "extras");     //"archive/Dolj" + "/extras"

        const zip = new AdmZip(zipPath);
        zip.getEntries()
        .filter(e=> !e.isDirectory && e.name.toLowerCase().endsWith(".pdf"))
        .forEach(e => zip.extractEntryTo(e, destDir, false, true));

        console.log(`Extras  ${zipPath} -> ${destDir}`);        
        //Fiecare PDF ajunge într-un folder extras/ lângă zip-ul lui; e.g. archive/dolj/extras/.
    }
}

main();