import fs from "fs";
import https from "https";

const menuData = fs.readFileSync("src/lib/data/menu.ts", "utf8");
const ambienceData = fs.readFileSync("src/components/landing/ambience-section.tsx", "utf8");

const urlRegex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?q=\d+&w=\d+&auto=format&fit=crop/g;
const allUrls = [...menuData.matchAll(urlRegex), ...ambienceData.matchAll(urlRegex)].map(m => m[0]);
const uniqueUrls = [...new Set(allUrls)];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         if (res.headers.location.includes("source-404")) {
           resolve({ url, status: "Redirects to 404" });
         } else {
           resolve({ url, status: "OK - Redirects: " + res.headers.location.substring(0, 30) + "..." });
         }
      } else if (res.statusCode >= 400) {
        resolve({ url, status: "Error: " + res.statusCode });
      } else {
        resolve({ url, status: "OK " + res.statusCode });
      }
    }).on("error", (e) => resolve({ url, status: "Request Error: " + e.message }));
  });
}

async function run() {
  const results = [];
  for (const url of uniqueUrls) {
    const status = await checkUrl(url);
    if (!status.status.startsWith("OK")) {
      results.push(status);
    }
  }
  fs.writeFileSync("broken_urls.json", JSON.stringify(results, null, 2));
  console.log("Done checking " + uniqueUrls.length + " URLs. Found " + results.length + " broken.");
}
run();
