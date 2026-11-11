import * as cheerio from "cheerio";
import * as json2csv from "json2csv";
import * as fs from "fs/promises";
import * as path from "path";


import { DOWNLOAD_DIR, ARCHIVE_DIR, MIN_YEAR } from "./config";


const url:string = "https://ssmr.ro/onm";

export async function getData(numeJudet: string, an:number) {
  const headers: HeadersInit = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0",
  };

  let urlWithYear:string = `${url}${an}`;


  //0. VALIDATE year
  const currentYear = new Date().getFullYear();
  if(!an || an < MIN_YEAR || an > currentYear){
    throw new RangeError(
      `An invalid: ${an}. Datele exista doar intre anii ${MIN_YEAR} si ${currentYear}.`
    );
  }

  //1. FETCH Main page
  const response = await fetch(urlWithYear, { headers });
  const html: string = await response.text();
  const $ = cheerio.load(html);

  //2. FIND iframe element
  const iframeSrc = $("iframe").attr("src");       //src --> zipPath https://ssmr.ro/files/onm2024/faza_locala/index.html
  if (!iframeSrc) {
    throw new Error("iframeSrc not found");
  }
  console.log("TEST :::" + iframeSrc);

  const iframeUrl = new URL(iframeSrc, urlWithYear).href;
  console.log("iframe URL: ", iframeUrl);

  //3. Fetch iframe page
  const iframeResponse = await fetch(iframeUrl, { headers });
  const iframeHtml = await iframeResponse.text();
  const $iframe = cheerio.load(iframeHtml);

  // 4. Find ZIP path INSIDE iframe

  const zipPath = $iframe(`a.${numeJudet.trim().toLowerCase()}`).attr("href"); //href = "./subiecte/Satu_Mare.zip"  //toLowerCase?

  const $harta = $iframe('ul[class="mapRomania"]');
  const judete = $iframe("ul.mapRomania > li")      // or $harta.children

      let found:boolean = false;

  for(let i=0; i<judete.length; i++){
    if(numeJudet.trim().toLowerCase() === $iframe(judete[i]).find("a").attr("class")?.toLowerCase()){
        found = true;
        break;
    }
  }

  if (!found){
        console.log("Judetul nu a fost gasit.");
        return;
    }

  console.log(`Contains ${numeJudet}:`, iframeHtml.includes(numeJudet));
  console.log(`Contains ${numeJudet}.zip: `, iframeHtml.includes(`${numeJudet}.zip`));
  console.log("Contains map_block:", iframeHtml.includes("map_block"));
  //   console.log(html);
  // const zipPath = $('a[href*="Satu_Mare.zip"]').attr("href");

  //5. Get full path to ZIP file
  if (!zipPath) {
    throw new Error("ZIP Path not found");
  }
  const zipUrl = new URL(zipPath, iframeUrl).href;

  console.log("ZIP path:", zipPath);
  console.log("full path: " + zipUrl);

  console.log("Status:", response.status);
  console.log("URL:", response.url);
  console.log("HTML length:", html.length);
  console.log(`${numeJudet.trim()} matches:`, $iframe(`a.${numeJudet.trim().toLowerCase()}`).length);

  //6. Download the .zip file
  const zipResponse = await fetch(zipUrl);
  if (!zipResponse.ok) {
    throw new Error(`Download failed: ${zipResponse.status}`);
  }

  const buffer = Buffer.from(       //Array<Buffer> - datele brute   //read zip as Binary -- //Buffer packs up the data from ArrayBuffer for the fs
    await zipResponse.arrayBuffer()
); 

  const folderName = numeJudet.trim().toLowerCase();
  const judetDir = path.join(ARCHIVE_DIR, folderName); // ...\scraper-iapsai\archive\Alba
  
  await fs.mkdir(judetDir, {recursive: true});
  await fs.writeFile(`${judetDir}/archive.zip`, buffer);  // ...\scraper-iapsai\archive\Alba\archive.zip
  

  
}

getData("Olt", 1999);