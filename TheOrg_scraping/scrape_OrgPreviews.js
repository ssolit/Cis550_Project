const fs = require('fs');

(async function() {
    // The program starts by loading in a file called dataFileName. You will have to create a json file with this name and paste " {"companies":[]} " in it for it to load in without errors
    const dataFileName = "TO_previews_ALL.json"; // change file path here.
    let companies = fs.readFileSync(dataFileName, 'utf-8');
    let dataRes = JSON.parse(companies);


    // iterate over these lists to scrape things in chunks
    // const comp_sizes = ['\"200-500\"', '\"50-200\"', '\"10-50\"'];
    const comp_sizes = ["\"1-10\"","\"10-50\"","\"50-200\"","\"200-500\"","\"500-1000\"","\"1000-5000\"","\"5000-10000\"","\">10000\""];
    const countries = ["US", "GB", "IN", "CA", "CN", "FR", "DE", "AU", "JP", "BR"]
    const industries = JSON.parse(fs.readFileSync("industries.json", 'utf-8'))["data"]["companyIndustries"];



    async function getPageResults(country, comp_size, industry_id, page, perPage) {
        // remember to follow set up on line 4 - paste {"companies":[]}
        // these fetches com from a page like https://theorg.com/organizations?countries=united-states&employeeRanges=200-500
        // you can find it by doing inspect, going to the network tab, finding the graphql call whose results starts with "{"data":{"exploreCompanies":", right clicking, and then copying as a Node.js fetch
        // remember to replace the part of the call body with code that substitues in variables: \"variables\":{\"countries\":[\"US\"],\"categories\":[\"${industry_id}\"\],\"employeeRanges\":[${comp_size}],\"offset\":${(page - 1) * perPage},\"limit\":${perPage}}
        const res = await fetch("https://prod-graphql-api.theorg.com/graphql", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjY5NTE4ZWJjMmY3ZWFkNTgiLCJ0ciI6IjI0MDQ1YjYzYWI1NjE5YjM2MmRjMTk5MTNkOThmMzcyIiwidGkiOjE2NjkwNjEyNzgyODh9fQ==",
              "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "traceparent": "00-24045b63ab5619b362dc19913d98f372-69518ebc2f7ead58-01",
              "tracestate": "2591176@nr=0-1-2591176-1134211314-69518ebc2f7ead58----1669061278288",
              "Referer": "https://theorg.com/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"operationName\":\"exploreCompanies\",\"variables\":{\"countries\":[\"${country}\"],\"categories\":[\"${industry_id}\"\],\"employeeRanges\":[${comp_size}],\"offset\":${(page - 1) * perPage},\"limit\":${perPage}},\"query\":\"query exploreCompanies($countries: [String!], $categories: [String!], $employeeRanges: [String!], $limit: Int!, $offset: Int!) {\\n  exploreCompanies(\\n    countries: $countries\\n    categories: $categories\\n    employeeRanges: $employeeRanges\\n    limit: $limit\\n    offset: $offset\\n  ) {\\n    paging {\\n      total\\n      pages\\n      current\\n      __typename\\n    }\\n    results {\\n      company {\\n        id\\n        slug\\n        name\\n        logoImage {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        description\\n        positionCount\\n        verification {\\n          verificationType\\n          __typename\\n        }\\n        adminLocked\\n        __typename\\n      }\\n      following\\n      id\\n      positionExamples {\\n        slug\\n        image {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
            "method": "POST"
          });
        //  "body": `{\"operationName\":\"exploreCompanies\",\"variables\":{\"countries\":[\"${country}\"],\"categories\":[\"${industry_id}\"\],\"employeeRanges\":[${comp_size}],\"offset\":${(page - 1) * perPage},\"limit\":${perPage}},\"query\":\"query exploreCompanies($countries: [String!], $categories: [String!], $employeeRanges: [String!], $limit: Int!, $offset: Int!) {\\n  exploreCompanies(\\n    countries: $countries\\n    categories: $categories\\n    employeeRanges: $employeeRanges\\n    limit: $limit\\n    offset: $offset\\n  ) {\\n    paging {\\n      total\\n      pages\\n      current\\n      __typename\\n    }\\n    results {\\n      company {\\n        id\\n        slug\\n        name\\n        logoImage {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        description\\n        positionCount\\n        verification {\\n          verificationType\\n          __typename\\n        }\\n        adminLocked\\n        __typename\\n      }\\n      following\\n      id\\n      positionExamples {\\n        slug\\n        image {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
        const json = await res.json();
        return json["data"]["exploreCompanies"]["results"];
    }

    async function scrape_one_url(country, comp_size, industry) {
        var page = 1; 
        const stopPage = 10;
        const perPage = 1000;

        let count = 0; // count how many elements you get

        while (page <= stopPage) {
            const pageResults = await getPageResults(country, comp_size, industry, page, perPage);
            // console.log(pageResults)
            if (pageResults == undefined) {
                console.log("failed: pageResults == undefined");
                exit(1);
            } else if (pageResults.length > 0) {
                for (let i=0; i < pageResults.length; i++) {
                    if (pageResults[i]["positionExamples"].length > 0) { // only record companies with an employee since thats more useful for us
                        dataRes.companies.push({"preview": {"TO_id":pageResults[i]["id"],
                                                        "name":pageResults[i]["company"]["name"],
                                                        "slug":pageResults[i]["company"]["slug"], // name formated for fetch requests
                                                        "description":pageResults[i]["company"]["description"],
                                                        "positionExamples":pageResults[i]["positionExamples"] // previews only give 3 examples instead of the whole chart
                                                        }});
                        // dataRes.companies.push({"preview": {"name":pageResults[i]["company"]["name"]}});

                        count++;
                    }
                }
                await fs.writeFileSync(dataFileName, JSON.stringify(dataRes), 'utf-8');
                page += 1;
                // count+= pageResults.length
            } else {
                // console.log("Breaking: pageResults.length = " + pageResults.length + "\n");
                break; // in case you hit the end of the results early
            }
        }
        return count;

    }

    

    let total_count = 0;
    const desired_entries = 1000000;
    for (let i = 0; countries.length; i++) {
        for (let j = 0; j < i < comp_sizes.length; j++) {
            for (let k = 0; k < industries.length; k++) {
                total_count += await scrape_one_url(countries[i], comp_sizes[j], industries[k]["id"]);
                console.log(`i = ${i}, j=${j}, k=${k}, total_count = ${total_count}`)
                if (total_count > desired_entries) {
                    break;
                }
            }
        }
        if (total_count > desired_entries) {
            break;
        }
    }

})();