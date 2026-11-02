import * as cheerio from "cheerio";
import * as json2csv from "json2csv";
import * as fs from "fs";

let URL: string = "https://www.imdb.com/title/tt0988824/";

/// method with no name
(async () => {})();

interface ImdbData {
  title: string;
  rating: string;
}

export async function getData(): Promise<ImdbData[]> {
  let imdbData: ImdbData[] = [];
  const response: Response = await fetch(URL, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-encoding": "gzip, deflate, br, zstd",
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0",
    },
  });

  const html: string = await response.text();

  const $ = cheerio.load(html); //loads the document in the Memory

  const title: string = $("span.hero__primary-text").text(); //finds the element, .text() retrieves the value
  const rating: string = $('div[class="sc-a30a09c4-2 bRKtAc"] > span').text();

  //     console.log("Status:", response.status);
  // console.log("HTML length:", html.length);
  // console.log("Title:", title);
  // console.log("Rating:", rating);

   

  //   console.log("Selector matches:", $("span.hero__primary-text").length);

  //   console.log(
  //     "Class exists in fetched HTML:",
  //     html.includes("hero__primary-text"),
  //   );

  console.log("Status:", response.status);
  console.log("URL:", response.url);
   console.log("HTML length:", html.length);
  console.log("Content-Type:", response.headers.get("content-type"));
  console.log(html);

  console.log(title + " " + rating);

  imdbData.push({
    title,
    rating,
  });

  return imdbData;
}

let response = await getData();
// let html:string= await response.text();     //without await - Promise<string>

let imdbArr: ImdbData[] = response;

console.log(imdbArr[0].title);
console.log("TEST");
