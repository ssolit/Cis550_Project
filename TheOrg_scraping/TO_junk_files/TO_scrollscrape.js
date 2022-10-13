const fs = require('fs');
const puppeteer = require('puppeteer');

const save_path = "./TO_comp_list_2.txt"

// extract company names from urls 
function extractItems() {
    // set selector to JS path of relevent elements
    let selector = '#__next > div.Layout_layoutWrapper__FFUAO > div > div > div > div.FilterResults_root__6CKVx > div > div > div > ul > li > div > div.ExploreCompanyRow_content___UlQH > ul > li.ExploreCompanyRow_seeMore__Onttj > a'
                //    "#__next > div.Layout_layoutWrapper__FFUAO > div > div > div > div.FilterResults_root__6CKVx > div > div > div > ul > li > div > div.ExploreCompanyRow_content___UlQH > ul > li.ExploreCompanyRow_seeMore__Onttj > a"
    const extractedElements = document.querySelectorAll(selector);
      const names = [];
      for (let element of extractedElements) {
        let c_name = element.getAttribute('href').split("/")[2] // get name from url
        names.push(c_name);
      }
      return names;
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
            console.log("in scrapeItems. items.length = " + items.length);
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
    await page.goto('https://theorg.com/organizations?countries=united-states');
    
    // Auto-scroll and extract desired items from the page. Currently set to extract ten items.
    const items = await scrapeItems(page, extractItems, 10);
    
    // Save extracted items to a new file.
    fs.writeFileSync(save_path, items.join('\n') + '\n');
    
    // Close the browser.
    await browser.close();
    })();