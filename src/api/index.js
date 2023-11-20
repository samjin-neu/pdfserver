const fs = require('fs');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const puppeteer = require('puppeteer');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/hello', async (req, res) => {
  const ret = {
    message: 'Hello World!'
  };
  res.json(ret);
});

app.get('/hello/:name', async (req, res) => {
  const ret = {
    message: `Hello ${req.params.name}!`
  };
  res.json(ret);
});

const fetchImage = async (src) => {
  const response = await fetch(src);
  return Buffer.from(await response.arrayBuffer());
};

const calcCenteredImageX = (imageWidth, pageWidth, pageLeftMargin, pageRightMargin) => {
  return (pageWidth - pageLeftMargin - pageRightMargin - imageWidth) / 2 + pageLeftMargin;
};

const getColor = (index) => {
  if (index % 3 === 0) {
    return 'red';
  }
  else if (index % 3 === 1) {
    return 'green';
  }
  else {
    return 'blue';
  }
};

app.get('/pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const html = fs.readFileSync('test.html', 'utf8');
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'letter' });
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }

});

app.listen(3001, () => {
  console.log('Listening on port 3001');
});