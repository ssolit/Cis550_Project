const fs = require('fs');
const puppeteer = require('puppeteer');

const save_path = "./TO_jsons"

async function fetchCompInfo(comp_name) {
    const res = await fetch(`https://theorg.com/_next/data/1jLk7x0pxwHYH6sI5YJAe/org/${comp_name}.json?companySlug=${comp_name}`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjJjNTBkYTRjNzE0OTdlMGIiLCJ0ciI6IjIyMDU2OTE2MmM1NzVhYmMzNDFjMzY2YzEwYTUyOTk3IiwidGkiOjE2NjU2MjIwNTE1NDd9fQ==",
          "purpose": "prefetch",
          "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "traceparent": "00-220569162c575abc341c366c10a52997-2c50da4c71497e0b-01",
          "tracestate": "2591176@nr=0-1-2591176-1134211314-2c50da4c71497e0b----1665622051547",
          "x-nextjs-data": "1",
          "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665502250426%2Cregion:%27US%27}; _gcl_au=1.1.574958985.1665502250; _gid=GA1.2.1194260843.1665502251; _fbp=fb.1.1665502250694.1986845046; hubspotutk=10470e516c35d44977dc45593c00528c; AMP_MKTG_261f38a0f0=JTdCJTdE; _hjSessionUser_1219630=eyJpZCI6IjMwMTg5MjIyLTk0YTYtNTljOC1hNTE2LWQzYTQxY2RjZjVkOSIsImNyZWF0ZWQiOjE2NjU1MDIyNTA3MzYsImV4aXN0aW5nIjp0cnVlfQ==; __hssrc=1; __hstc=3035439.10470e516c35d44977dc45593c00528c.1665502250765.1665593617046.1665598265475.6; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmRhNDQyYTQ2LWYyYjYtNDMxMS05NDBkLTAyOTZmNzU0NWM0OCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1NjAyMTY3ODYxJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTU5ODI2MDI4MyU3RA==; _ga=GA1.2.114902465.1665502250; _hjAbsoluteSessionInProgress=1; _ga_5NXQ655FGP=GS1.1.1665622050.7.0.1665622050.0.0.0",
          "Referer": "https://theorg.com/org/google/org-chart",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });


    const json = await res.json();
    return json;
}


// extract company urls 
function extractItems() {
  // set selector to JS path of relevent elements
  let selector = '#__next > div.Layout_layoutWrapper__FFUAO > div > div > div > div.FilterResults_root__6CKVx > div > div > div > ul > li > div > div.ExploreCompanyRow_content___UlQH > ul > li.ExploreCompanyRow_seeMore__Onttj > a'
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
    let c_names = ['google', 'amazon'];
    jsons = []
    for (let n of c_names) {
        try {
            const json = await fetchCompInfo(n);
            console.log(json);
            jsons.push(json);
        } catch(e) { }

    }
        return jsons;
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