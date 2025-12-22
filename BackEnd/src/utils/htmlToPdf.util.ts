import puppeteer from "puppeteer";

export async function htmlToPdf(
  html: string,
  outputPath: string,
  previewPath: string,
) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.setViewport({ width: 1600, height: 800 });

  await page.pdf({
    path: outputPath,
    width: "1123px",
    height: " 800px",
    printBackground: true,
  });

  await page.screenshot({
    path: previewPath,
    clip: {
      x: 0,
      y: 0,
      width: 1123,
      height: 450,
    },
  });

  await browser.close();
}
