import puppeteer from "puppeteer";


export async function htmlToPdf(html: string, outputPath: string) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.setViewport({ width: 1600, height: 900 });

  await page.pdf({
    path: outputPath,
   width: "1123px",
height:" 800px",
    printBackground: true,
  });

  await browser.close();
}
