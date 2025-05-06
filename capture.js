const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 8080;

let puppeteerBrowser;
let puppeteerPage;

app.get('/', async (req, res) => {
  const url = req.query.url;
  const pageWidth = parseInt(req.query.width) || 1920;
  const pageHeight = parseInt(req.query.height) || 1080;

  if (!url) {
    return res.status(400).send('Missing ?url param');
  }

  try {
    const data = await getPage(url, pageWidth, pageHeight);
    res.set('Content-Type', 'image/png');
    res.send(data);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

const getPage = async (siteUrl, width, height) => {
  if (!puppeteerBrowser) {
    puppeteerBrowser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  const page = await puppeteerBrowser.newPage();
  await page.setViewport({ width, height });
  await page.goto(siteUrl, { waitUntil: 'networkidle2' });

  const screenshot = await page.screenshot({ fullPage: true });
  await page.close();
  return screenshot;
};

app.listen(port, () => console.log(`Screenshot service running on port ${port}`));
