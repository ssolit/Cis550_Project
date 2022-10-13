const fs = require('fs');
const puppeteer = require('puppeteer');


function getURLs() {
    const base_url = "https://theorg.com/organizations?countries=united-states";
    const sizes = ['200-500', '50-200', '10-50']
    let industries = fs.readFileSync("industries.json", 'utf-8');
    let industry_list= JSON.parse(industries)["data"]["companyIndustries"];
    let urls = [];

    for (const s_index in sizes) {
        for (const i_index in industry_list) {
            urls.push(base_url + "&employeeRanges=" + sizes[s_index] + "&industries=" + industry_list[i_index]["title"].replaceAll(" ", "-"));
        }
    }
    return urls;
}


// extract company names from urls 
async function extractItems() {
    // set selector to JS path of relevent elements - I.E. links to company pages
    let selector = '#__next > div.Layout_layoutWrapper__FFUAO > div > div > div > div.FilterResults_root__6CKVx > div > div > div > ul > li > div > div.ExploreCompanyRow_content___UlQH > ul > li.ExploreCompanyRow_seeMore__Onttj > a'
    const extractedElements = document.querySelectorAll(selector);
    const items = [];
    for (let element of extractedElements) {
        let c_name = element.getAttribute('href').split("/")[2]; // get name from url
        items.push(c_name);
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
            console.log("in scrapeItems. items.length = " + items.length);
        }
    } catch(e) { }
    return items;
    }

(async () => {
    // Set up Chromium browser and page.
    const scroll_url = getURLs()[0];
    const search = scroll_url.split("/")[3];
    const save_path = "company_names/" + search;
    



    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });
    
    // Navigate to the example page.
    await page.goto(scroll_url);

    page.evaluate(getDesiredLength)
           
    
   
    
    
    // // Auto-scroll and extract desired items from the page. Currently set to extract ten items.
    // const items = await scrapeItems(page, extractItems, desired_length);
    
    // // Save extracted items to a new file.
    // fs.writeFileSync(save_path, items.join('\n') + '\n');
    
    // Close the browser.
    await browser.close();
    })();




    function getDesiredLength(page) {
        console.log(scroll_url)
        const desired_length = document.querySelector("#__next > div.Layout_layoutWrapper__FFUAO > div > div > div > div.FilterResults_root__6CKVx > div > p > strong")
        console.log(desired_length); 
    }





    fetch("https://prod-graphql-api.theorg.com/graphql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjliZGUwMjVlM2FmYjRhZmEiLCJ0ciI6IjkyZDM5MjM0ZGVkZDE0ZWRkMjNkYWZmNTA0OGZlZThkIiwidGkiOjE2NjU2MzU4NzQwOTV9fQ==",
          "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "traceparent": "00-92d39234dedd14edd23daff5048fee8d-9bde025e3afb4afa-01",
          "tracestate": "2591176@nr=0-1-2591176-1134211314-9bde025e3afb4afa----1665635874095",
          "Referer": "https://theorg.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"operationName\":\"exploreCompanies\",\"variables\":{\"countries\":[\"US\"],\"categories\":[],\"employeeRanges\":[\"200-500\"],\"offset\":0,\"limit\":30},\"query\":\"query exploreCompanies($countries: [String!], $categories: [String!], $employeeRanges: [String!], $limit: Int!, $offset: Int!) {\\n  exploreCompanies(\\n    countries: $countries\\n    categories: $categories\\n    employeeRanges: $employeeRanges\\n    limit: $limit\\n    offset: $offset\\n  ) {\\n    paging {\\n      total\\n      pages\\n      current\\n      __typename\\n    }\\n    results {\\n      company {\\n        id\\n        slug\\n        name\\n        logoImage {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        description\\n        positionCount\\n        verification {\\n          verificationType\\n          __typename\\n        }\\n        adminLocked\\n        __typename\\n      }\\n      following\\n      id\\n      positionExamples {\\n        slug\\n        image {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
        "method": "POST"
      });