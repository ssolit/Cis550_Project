// starter code found here: https://www.scrapingbee.com/blog/infinite-scroll-puppeteer/


// Puppeteer will not run without these lines
const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {
/*  For extractedElements, you are selecting the tag and class,
    that holds your desired information,
    then choosing the desired child element you would like to scrape from.
    in this case, you are selecting the
    "<div class=blog-post />" from "<div class=container />" See below: */
  const extractedElements = document.querySelectorAll('#container > div.blog-post');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeItems(
  page,
  extractItems,
  itemCount,
  scrollDelay = 800,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitForTimeout(scrollDelay);
    }
  } catch(e) { }
  return items;
}

(async () => {
  // Set up Chromium browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the example page.
  await page.goto('https://mmeurer00.github.io/infinite-scroll-example/');

  // Auto-scroll and extract desired items from the page. Currently set to extract ten items.
  const items = await scrapeItems(page, extractItems, 10);

  // Save extracted items to a new file.
  fs.writeFileSync('./items.txt', items.join('\n') + '\n');

  // Close the browser.
  await browser.close();
})();
