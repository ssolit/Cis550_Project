const fs = require('fs');

(async function() {
    const save_path = "TO_orgCharts.json"; // change file path here.
    const previews_path = "TO_company_previews.json"

    let previews = JSON.parse(fs.readFileSync(previews_path, 'utf-8'));
    let orgChartsObj = JSON.parse(fs.readFileSync(save_path, 'utf-8'));
    // console.log(previews["companies"][0]["preview"]["name"])
    // console.log(orgCharts[0])

    async function fetchCompInfo(comp_name) {
        const res = await fetch("https://theorg.com/_next/data/e3lK1efN8oCDpTg4F5G-y/org/mod-tech-labs/org-chart.json?companySlug=mod-tech-labs", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9",
              "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjViMGE2OTM5ZDUwYTUwNzUiLCJ0ciI6IjE5MzMxNWNlZDkyNjU4ODcwZTNlNDM2MDQ2OGNhYjdhIiwidGkiOjE2NjU3NjI0ODM0MzR9fQ==",
              "purpose": "prefetch",
              "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "traceparent": "00-193315ced92658870e3e4360468cab7a-5b0a6939d50a5075-01",
              "tracestate": "2591176@nr=0-1-2591176-1134211314-5b0a6939d50a5075----1665762483434",
              "x-nextjs-data": "1",
              "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665502250426%2Cregion:%27US%27}; _gcl_au=1.1.574958985.1665502250; _gid=GA1.2.1194260843.1665502251; _fbp=fb.1.1665502250694.1986845046; hubspotutk=10470e516c35d44977dc45593c00528c; _hjSessionUser_1219630=eyJpZCI6IjMwMTg5MjIyLTk0YTYtNTljOC1hNTE2LWQzYTQxY2RjZjVkOSIsImNyZWF0ZWQiOjE2NjU1MDIyNTA3MzYsImV4aXN0aW5nIjp0cnVlfQ==; __hssrc=1; AMP_MKTG_261f38a0f0=JTdCJTdE; _gat=1; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmRhNDQyYTQ2LWYyYjYtNDMxMS05NDBkLTAyOTZmNzU0NWM0OCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1NzYyNDQ5NzMwJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTc2MjQ0OTcyOSU3RA==; _hjIncludedInSessionSample=0; _hjSession_1219630=eyJpZCI6ImZhMDBjZmNiLWJmZWEtNDAxMC05NjBhLWI5OTgzMjI4ZmM2YyIsImNyZWF0ZWQiOjE2NjU3NjI0NDk3ODEsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=0; __hstc=3035439.10470e516c35d44977dc45593c00528c.1665502250765.1665721187960.1665762449829.15; __hssc=3035439.1.1665762449829; _ga_5NXQ655FGP=GS1.1.1665762448.15.1.1665762483.0.0.0; _ga=GA1.1.114902465.1665502250",
              "Referer": "https://theorg.com/org/mod-tech-labs/org-chart",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });
          console.log("finishing fetch")
        //   console.log(res)
        //   console.log(await res.json())
          const json = await res.json();
          return json;
    }

    async function scrape_one_chart(c_name) {
        console.log("entered scrape_one" + "\n\n")
        const result = await fetchCompInfo(c_name);
        console.log("finished fetch\n")


        let chart = {"initialCompany":result["pageProps"]["initialCompany"],
                  "__APOLLO_STATE__":result["pageProps"]["__APOLLO_STATE__"]  }
        

        const chart_keys = Object.keys(chart["__APOLLO_STATE__"])
        let people_keys = []
        let people_objects  = []
        var re = new RegExp("^FlatPosition:");
        for (let i = 0; i < chart_keys.length; i++) {
            if (re.test(chart_keys[i])) {
                people_keys.push(chart_keys[i])
                people_objects.push(chart["__APOLLO_STATE__"][chart_keys[i]])
            }
        }
        console.log(people_keys)
        console.log(chart["__APOLLO_STATE__"][people_keys[0]])

        let clean_chart = {"CompanyInfo":result["pageProps"]["initialCompany"],
                            "employees":people_objects}
        orgChartsObj.orgCharts.push(clean_chart)

        await fs.writeFileSync(save_path, JSON.stringify(orgChartsObj), 'utf-8');

        
    }
    function clean_name(c_name) {
        return c_name.replaceAll(" ", "-")
    }

    
    let c_name = clean_name(previews["companies"][0]["preview"]["name"]);
    console.log(c_name)
    // scrape_one_chart(c_name)
    scrape_one_chart("amazon")

})();







// amazon fetch 
// fetch("https://theorg.com/_next/data/1jLk7x0pxwHYH6sI5YJAe/org/amazon/org-chart.json?companySlug=amazon", {
//             "headers": {
//               "accept": "*/*",
//               "accept-language": "en-US,en;q=0.9",
//               "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjBiYzA3ZDFlODZmMzFmNTAiLCJ0ciI6ImJmNWU3NWVjYzgxNGZjN2UyN2NkNTg5NTFiYjA4MGYwIiwidGkiOjE2NjU3MjI2MDc4MDd9fQ==",
//               "purpose": "prefetch",
//               "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
//               "sec-ch-ua-mobile": "?0",
//               "sec-ch-ua-platform": "\"macOS\"",
//               "sec-fetch-dest": "empty",
//               "sec-fetch-mode": "cors",
//               "sec-fetch-site": "same-origin",
//               "traceparent": "00-bf5e75ecc814fc7e27cd58951bb080f0-0bc07d1e86f31f50-01",
//               "tracestate": "2591176@nr=0-1-2591176-1134211314-0bc07d1e86f31f50----1665722607807",
//               "x-nextjs-data": "1",
//               "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665502250426%2Cregion:%27US%27}; _gcl_au=1.1.574958985.1665502250; _gid=GA1.2.1194260843.1665502251; _fbp=fb.1.1665502250694.1986845046; hubspotutk=10470e516c35d44977dc45593c00528c; _hjSessionUser_1219630=eyJpZCI6IjMwMTg5MjIyLTk0YTYtNTljOC1hNTE2LWQzYTQxY2RjZjVkOSIsImNyZWF0ZWQiOjE2NjU1MDIyNTA3MzYsImV4aXN0aW5nIjp0cnVlfQ==; __hssrc=1; AMP_MKTG_261f38a0f0=JTdCJTdE; _hjAbsoluteSessionInProgress=1; _hjIncludedInSessionSample=0; _hjSession_1219630=eyJpZCI6ImExODIyZTAzLWQxNTEtNGY3Mi05ODVjLTU0YzMzMGMzODU4OSIsImNyZWF0ZWQiOjE2NjU3MjExODczNDgsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; __hstc=3035439.10470e516c35d44977dc45593c00528c.1665502250765.1665706423983.1665721187960.14; _ga=GA1.1.114902465.1665502250; __hssc=3035439.4.1665721187960; _gat=1; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmRhNDQyYTQ2LWYyYjYtNDMxMS05NDBkLTAyOTZmNzU0NWM0OCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1NzIyNjAyMzYxJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTcyMjYwMDg4OCU3RA==; _ga_5NXQ655FGP=GS1.1.1665721086.14.1.1665722607.0.0.0",
//               "Referer": "https://theorg.com/org/amazon/org-chart",
//               "Referrer-Policy": "strict-origin-when-cross-origin"
//             },
//             "body": null,
//             "method": "GET"
//           });


// mod-tech-labs fetch
// fetch("https://theorg.com/_next/data/1jLk7x0pxwHYH6sI5YJAe/org/mod-tech-labs/org-chart.json?companySlug=mod-tech-labs", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "if-none-match": "W/\"rdmv2jm2oxf47\"",
//     "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjNkNDhlZWY1MmU1ZGJmNTYiLCJ0ciI6IjAyNDliYTlkYmYxNTI4MjFkYzg2NzBiZGFhZTQ2NjJiIiwidGkiOjE2NjU3MjIxNzg5Mjd9fQ==",
//     "purpose": "prefetch",
//     "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "traceparent": "00-0249ba9dbf152821dc8670bdaae4662b-3d48eef52e5dbf56-01",
//     "tracestate": "2591176@nr=0-1-2591176-1134211314-3d48eef52e5dbf56----1665722178927",
//     "x-nextjs-data": "1",
//     "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665502250426%2Cregion:%27US%27}; _gcl_au=1.1.574958985.1665502250; _gid=GA1.2.1194260843.1665502251; _fbp=fb.1.1665502250694.1986845046; hubspotutk=10470e516c35d44977dc45593c00528c; _hjSessionUser_1219630=eyJpZCI6IjMwMTg5MjIyLTk0YTYtNTljOC1hNTE2LWQzYTQxY2RjZjVkOSIsImNyZWF0ZWQiOjE2NjU1MDIyNTA3MzYsImV4aXN0aW5nIjp0cnVlfQ==; __hssrc=1; AMP_MKTG_261f38a0f0=JTdCJTdE; _hjAbsoluteSessionInProgress=1; _hjIncludedInSessionSample=0; _hjSession_1219630=eyJpZCI6ImExODIyZTAzLWQxNTEtNGY3Mi05ODVjLTU0YzMzMGMzODU4OSIsImNyZWF0ZWQiOjE2NjU3MjExODczNDgsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; __hstc=3035439.10470e516c35d44977dc45593c00528c.1665502250765.1665706423983.1665721187960.14; _ga=GA1.2.114902465.1665502250; __hssc=3035439.3.1665721187960; _gat=1; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmRhNDQyYTQ2LWYyYjYtNDMxMS05NDBkLTAyOTZmNzU0NWM0OCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1NzIyMTc1OTUwJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTcyMTA4NDI0NCU3RA==; _ga_5NXQ655FGP=GS1.1.1665721086.14.1.1665722178.0.0.0",
//     "Referer": "https://theorg.com/org/mod-tech-labs/org-chart",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });