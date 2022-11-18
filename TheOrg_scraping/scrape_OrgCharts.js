const fs = require('fs');

(async function() {
    const save_path = "orgCharts_US_10-500e.json"; // change file path here. Remember to put {"orgCharts":[]} in it if needed
    const previews_path = "TO_company_previews_2.json"

    let previews = JSON.parse(fs.readFileSync(previews_path, 'utf-8'));
    let orgChartsObj = JSON.parse(fs.readFileSync(save_path, 'utf-8'));

    async function fetchCompInfo(comp_name) {
      // note: these fetch calls go stale. The _next/data/ part of the url, newrelic, and cookie all change
      // To replace it:
        // 1) copy a fresh Node.js fetch. It should be from a page like https://theorg.com/org/flat-mx/org-chart, copy the the org-chart.json fetch
        // 2) delete the "if-none-match" header if its there
        // 3} replace the place where a company name appears (twice in url, once in referer) with ${comp_name} and "" with ``
        const res = await fetch(`https://theorg.com/_next/data/cTVimb0McZ0qVcefpLODn/org/${comp_name}/org-chart.json?companySlug=${comp_name}`, {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "if-none-match": "W/\"3gzihf610v83oy\"",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjMwOWY4Yjk0MGUyNDhmM2EiLCJ0ciI6IjE1NjFhYjA5MDRlYTE4NzQ4MThmZDhhMDJmMGNiZWYxIiwidGkiOjE2Njg3MzcyMDkzMjZ9fQ==",
            "purpose": "prefetch",
            "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-1561ab0904ea1874818fd8a02f0cbef1-309f8b940e248f3a-01",
            "tracestate": "2591176@nr=0-1-2591176-1134211314-309f8b940e248f3a----1668737209326",
            "x-nextjs-data": "1",
            "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1668735867279%2Cregion:%27US%27}; _gcl_au=1.1.13360875.1668735867; _gid=GA1.2.1126915202.1668735868; ln_or=d; _fbp=fb.1.1668735867647.498650928; __hstc=3035439.8ba94a8b874a164241a16a8014ea050a.1668735867760.1668735867760.1668735867760.1; hubspotutk=8ba94a8b874a164241a16a8014ea050a; __hssrc=1; _hjFirstSeen=1; _hjSession_1219630=eyJpZCI6IjcyNTlhMDk2LWRlODctNGI3Mi04ZWQ2LWVlNDYyMzE5NjMyMSIsImNyZWF0ZWQiOjE2Njg3MzU4Njc3ODQsImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=0; AMP_MKTG_261f38a0f0=JTdCJTdE; _hjSessionUser_1219630=eyJpZCI6ImU5OTBmNWU3LTgzYzgtNTlmMy05MTQ5LWQwZGEyODRlZGE4MyIsImNyZWF0ZWQiOjE2Njg3MzU4Njc3MzYsImV4aXN0aW5nIjp0cnVlfQ==; _ga_5NXQ655FGP=GS1.1.1668735867.1.1.1668737207.0.0.0; _ga=GA1.2.1309533542.1668735867; _gat=1; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMjRiYmQyZjA1LTFkNzItNDc0YS1hMDcwLWExMWVlMjRhODlkNyUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY4NzM3MjA3OTY5JTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2ODczNTg2NzU4OSU3RA==; _hjIncludedInPageviewSample=1; _hjIncludedInSessionSample=0; __hssc=3035439.3.1668735867760",
            "Referer": `https://theorg.com/org/${comp_name}/org-chart`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": null,
          "method": "GET"
        });
          // console.log("finishing fetch\n")

          const json = await res.json();
          return json;
    }

    async function scrape_one_chart(c_name) {
        const result = await fetchCompInfo(c_name);
        if (result == undefined || result["pageProps"] == undefined) {
          console.log(`scrape failed: undefined. failure point: ${c_name}`)
          console.log()
          return
        }

        // let chart = {"initialCompany":result["pageProps"]["initialCompany"]} // Has all info, but a lot not relevant. Also hard to read
        let clean_chart = {"CompanyName":result["pageProps"]["initialCompany"]["name"],
                              "stats": {
                                "social": result["pageProps"]["initialCompany"]["social"],
                                "location": result["pageProps"]["initialCompany"]["location"],
                                "description": result["pageProps"]["initialCompany"]["description"],
                                "employeeRange": result["pageProps"]["initialCompany"]["stats"]["employeeRange"],
                                "stage":result["pageProps"]["initialCompany"]["stats"]["stage"],
                                "industries": result["pageProps"]["initialCompany"]["stats"]["industries"],
                                "lastUpdate": result["pageProps"]["initialCompany"]["stats"]["lastUpdate"],
                                },
                                "employeeNodes": result["pageProps"]["initialCompany"]["nodes"],
                            }
        orgChartsObj.orgCharts.push(clean_chart)
        await fs.writeFileSync(save_path, JSON.stringify(orgChartsObj), 'utf-8');
    }

    console.log("starting scrapes")
    let init_i = 13400;
    let print_counter = init_i;
    for (let i = init_i; i < previews["companies"].length; i++) {
      let c_name = previews["companies"][i]["preview"]["slug"]
      await scrape_one_chart(c_name)
      print_counter++;
      if (print_counter%100 == 0) {
        console.log(`${print_counter}/${previews["companies"].length}`);
      }
    }
    console.log("Successful Exit!")

})();
