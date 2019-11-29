const puppeteer = require('puppeteer');

const express = require('express');
const app = express();
const port = 8080;
let puppeteerBrowser;
let puppeteerPage;

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
  if(!puppeteerBrowser) {
    puppeteerBrowser = await puppeteer.launch();

    if(!puppeteerPage) {
      puppeteerPage = await puppeteerBrowser.newPage();
    }
  }

  await puppeteerPage.setViewport({ width, height });
  await puppeteerPage.goto(site_name);

  let shotResult = await puppeteerPage.screenshot({
    fullPage: true
  }).then((result) => {
    return result;
  }).catch(e => {
    return "Error";
  });

  return shotResult;
}
