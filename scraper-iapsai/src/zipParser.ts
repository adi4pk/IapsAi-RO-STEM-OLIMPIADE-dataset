import * as cheerio from "cheerio";
import * as json2csv from "json2csv";
import * as fs from "fs/promises";


let url:string = "https://ssmr.ro/onm2024";

export async function getData() {
  const headers: HeadersInit = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0",
  };

  //1. FETCH Main page
  const response = await fetch(url, { headers });
  const html: string = await response.text();
  const $ = cheerio.load(html);

  //2. FIND iframe element
  const iframePath = $("iframe").attr("src");
  if (!iframePath) {
    throw new Error("iframePath not found");
  }

  const iframeUrl = new URL(iframePath, url).href;
  console.log("iframe URL: ", iframeUrl);

  //3. Fetch iframe page
  const iframeResponse = await fetch(iframeUrl, { headers });
  const iframeHtml = await iframeResponse.text();
  const $iframe = cheerio.load(iframeHtml);

  // 4. Find ZIP path INSIDE iframe

  const zipPath = $iframe("a.satuMare").attr("href"); //

  console.log("Contains satuMare:", iframeHtml.includes("satuMare"));
  console.log("Contains Satu_Mare.zip:", iframeHtml.includes("Satu_Mare.zip"));
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
  console.log("satuMare matches:", $("a.satuMare").length);

  //6. Download the .zip file
  const zipResponse = await fetch(zipUrl);
  if (!zipResponse.ok) {
    throw new Error(`Download failed: ${zipResponse.status}`);
  }

  const buffer = Buffer.from(       //returns an Array<Buffer>   //read zip as Binary
    await zipResponse.arrayBuffer()
); 

  await fs.writeFile("archive.zip", buffer);
}

let response = await getData();