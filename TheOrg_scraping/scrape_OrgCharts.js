const fs = require('fs');

(async function() {
    const save_path = "TO_orgCharts.json"; // change file path here. Remember to put {"orgCharts":[]} in it if needed
    const previews_path = "TO_company_previews.json"

    let previews = JSON.parse(fs.readFileSync(previews_path, 'utf-8'));
    let orgChartsObj = JSON.parse(fs.readFileSync(save_path, 'utf-8'));

    async function fetchCompInfo(comp_name) {
      // note: these fetch calls go stale. The _next/data/ part of the url, newrelic, and cookie all change
      // To replace it:
        // 1) copy a fresh Node.js fetch. It should be from a page like https://theorg.com/org/flat-mx/org-chart
        // 2) delete the "if-none-match" header if its there
        // 3} replace the place where a company name appears (twice in url, once in referer) with ${comp_name} and "" with ``
        const res = await fetch(`https://theorg.com/_next/data/e3lK1efN8oCDpTg4F5G-y/org/${comp_name}/org-chart.json?companySlug=${comp_name}`, {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6ImMzZDNiNWM2MzMwMWQ3MGIiLCJ0ciI6ImY4YTBiM2U5ZTM1NDAyMmY3OGUxMTc3OTA4Y2QxYzBiIiwidGkiOjE2NjU4NjE5NDg1NjB9fQ==",
            "purpose": "prefetch",
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-f8a0b3e9e354022f78e1177908cd1c0b-c3d3b5c63301d70b-01",
            "tracestate": "2591176@nr=0-1-2591176-1134211314-c3d3b5c63301d70b----1665861948560",
            "x-nextjs-data": "1",
            "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665502250426%2Cregion:%27US%27}; _gcl_au=1.1.574958985.1665502250; _gid=GA1.2.1194260843.1665502251; _fbp=fb.1.1665502250694.1986845046; hubspotutk=10470e516c35d44977dc45593c00528c; _hjSessionUser_1219630=eyJpZCI6IjMwMTg5MjIyLTk0YTYtNTljOC1hNTE2LWQzYTQxY2RjZjVkOSIsImNyZWF0ZWQiOjE2NjU1MDIyNTA3MzYsImV4aXN0aW5nIjp0cnVlfQ==; __hssrc=1; AMP_MKTG_261f38a0f0=JTdCJTdE; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample=1; _hjSession_1219630=eyJpZCI6IjFiNmQ1Yzk1LTg2NTQtNGIwZi1hYzFkLWVkOTQ5NGJiZmU5YiIsImNyZWF0ZWQiOjE2NjU4NjE3MTQ5MTIsImluU2FtcGxlIjp0cnVlfQ==; _hjIncludedInPageviewSample=1; __hstc=3035439.10470e516c35d44977dc45593c00528c.1665502250765.1665787677142.1665861715092.19; _gat=1; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmRhNDQyYTQ2LWYyYjYtNDMxMS05NDBkLTAyOTZmNzU0NWM0OCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1ODYxOTExOTU2JTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTg2MTI3NzkzNCUyQyUyMnVzZXJJZCUyMiUzQSUyMjA0YjVjZDZjLTVhMzktNDM5Yy1iZDQ4LThmN2M4NDlkMmQyNSUyMiU3RA==; _ga=GA1.2.114902465.1665502250; __hssc=3035439.2.1665861715092; _ga_5NXQ655FGP=GS1.1.1665861278.19.1.1665861948.0.0.0",
            "Referer": `https://theorg.com/org/${comp_name}org-chart`,
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
    let print_counter = 0;
    for (let i = 0; i < previews["companies"].length; i++) {
      let c_name = previews["companies"][i]["preview"]["slug"]
      await scrape_one_chart(c_name)
      print_counter++;
      if (print_counter%100 == 0) {
        console.log(`${print_counter}/${previews["companies"].length}`);
      }
    }
    console.log("Successful Exit!")

})();
