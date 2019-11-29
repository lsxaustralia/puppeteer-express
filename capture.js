const puppeteer = require('puppeteer');

const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  const url = req.param("url");
  const pageWidth = req.param("width") ? req.param("width") : 1920;
  const pageHeight = req.param("height") ? req.param("height") : 1080;

  getPage(url, pageWidth, pageHeight)
    .then((data) => {
      res.end(data);
    })
    .catch((e) => {
      res.status(500, {
        error: e
      });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const getPage = async (site_name, width, height) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(site_name);

  let shotResult = await page.screenshot({
    fullPage: true
  }).then((result) => {
    return result;
  }).catch(e => {
    return "Error";
  });

  await browser.close();

  return shotResult;
}
