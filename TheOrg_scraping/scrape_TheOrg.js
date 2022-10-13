const fs = require('fs');

(async function() {
    const dataFileName = "TO_companies.json"; // change file path here.

    let companies = fs.readFileSync(dataFileName, 'utf-8');
    let dataRes = JSON.parse(companies);

    // configure search bounds. 
    // Note handshake won't let you search beyond 10k entries. good params are 1, 10, 1000
    var page = 1; // start page
    const stopPage = 10;
    const perPage = 1000;

    // `https://app.joinhandshake.com/stu/employers?page=${page}&per_page=${perPage}&sort_direction=desc&sort_column=default&institution_sizes%5B%5D=4&_=${Date.now()}`

    async function getPageResults(page) {
        const res = await fetch("https://prod-graphql-api.theorg.com/graphql", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6ImNmOWI1NzRjODJkYmNjNDciLCJ0ciI6IjNlYjc3YjRhZGI1ZjNmODQyNmQ4ZjBiZGM1NTY0OTlhIiwidGkiOjE2NjU0OTgyNzQ2MzZ9fQ==",
              "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "traceparent": "00-3eb77b4adb5f3f8426d8f0bdc556499a-cf9b574c82dbcc47-01",
              "tracestate": "2591176@nr=0-1-2591176-1134211314-cf9b574c82dbcc47----1665498274636",
              "Referer": "https://theorg.com/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"operationName\":\"exploreCompanies\",\"variables\":{\"countries\":[\"US\"],\"categories\":[],\"employeeRanges\":[\"200-500\"],\"offset\":${(page - 1) * perPage},\"limit\":${perPage}},\"query\":\"query exploreCompanies($countries: [String!], $categories: [String!], $employeeRanges: [String!], $limit: Int!, $offset: Int!) {\\n  exploreCompanies(\\n    countries: $countries\\n    categories: $categories\\n    employeeRanges: $employeeRanges\\n    limit: $limit\\n    offset: $offset\\n  ) {\\n    paging {\\n      total\\n      pages\\n      current\\n      __typename\\n    }\\n    results {\\n      company {\\n        id\\n        slug\\n        name\\n        logoImage {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        description\\n        positionCount\\n        verification {\\n          verificationType\\n          __typename\\n        }\\n        adminLocked\\n        __typename\\n      }\\n      following\\n      id\\n      positionExamples {\\n        slug\\n        image {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
            "method": "POST"
          });


        const json = await res.json();

        // console.log("logging json");
        // console.log(json);
        const spec_data = json["data"]["exploreCompanies"]["results"];
        // console.log(spec_data)
        return spec_data;
    }

    async function scrape_one_url(url) {
        while (page <= stopPage) {
            const pageResults = await getPageResults(page);
            // console.log(pageResults)
            // console.log(pageResults[0]["company"]["name"])
    
            if (pageResults == undefined) {
                console.log("failed: pageResults == undefined");
                exit(1);
            } else if (pageResults.length > 0) {
                console.log("pageResults.length = " + pageResults.length + "\n");
                // dataRes.companies.push(...pageResults);
                for (let i=0; i < pageResults.length; i++) {
                    dataRes.companies.push(pageResults[i]["company"]["name"]);
                }
                await fs.writeFileSync(dataFileName, JSON.stringify(dataRes), 'utf-8');
                console.log('Successfully scraped page ' + page)
                page += 1;
            } else {
                console.log("Breaking: pageResults.length = " + pageResults.length + "\n");
                break; // in case you hit the end of the results early
            }
    
            console.log(`page: ${page}, stopPage: ${stopPage}, pageResults.length: ${pageResults.length}`)
        }
    
        console.log('Exited!')
    }

    scrape_one_url();

   

})();









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