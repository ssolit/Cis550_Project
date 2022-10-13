
// company scroll page with filters {\"countries\":[\"US\"],\"categories\":[],\"employeeRanges\":[\"200-500\"]
fetch("https://prod-graphql-api.theorg.com/graphql", {
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
            "body": "{\"operationName\":\"exploreCompanies\",\"variables\":{\"countries\":[\"US\"],\"categories\":[],\"employeeRanges\":[\"200-500\"],\"offset\":0,\"limit\":30},\"query\":\"query exploreCompanies($countries: [String!], $categories: [String!], $employeeRanges: [String!], $limit: Int!, $offset: Int!) {\\n  exploreCompanies(\\n    countries: $countries\\n    categories: $categories\\n    employeeRanges: $employeeRanges\\n    limit: $limit\\n    offset: $offset\\n  ) {\\n    paging {\\n      total\\n      pages\\n      current\\n      __typename\\n    }\\n    results {\\n      company {\\n        id\\n        slug\\n        name\\n        logoImage {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        description\\n        positionCount\\n        verification {\\n          verificationType\\n          __typename\\n        }\\n        adminLocked\\n        __typename\\n      }\\n      following\\n      id\\n      positionExamples {\\n        slug\\n        image {\\n          uri\\n          ext\\n          versions\\n          endpoint\\n          prevailingColor\\n          placeholderDataUrl\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}",
            "method": "POST"
          });

// Airtables entire org chart (all employees, not just 3 teasers)
fetch("https://theorg.com/_next/data/bdMETSHjDjUWxbdCER_0A/org/airtable.json?companySlug=airtable", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "if-none-match": "W/\"p2n5eepjeq7qp1\"",
    "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6IjNkMjA4MGVkYzQ0OTAyMzkiLCJ0ciI6IjRmMDAxMmE4ZTUzMDhiMzE4ZjQ0OGIyYjgyM2E0ZWMxIiwidGkiOjE2NjU1MDA5MTg1MTd9fQ==",
    "purpose": "prefetch",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-4f0012a8e5308b318f448b2b823a4ec1-3d2080edc4490239-01",
    "tracestate": "2591176@nr=0-1-2591176-1134211314-3d2080edc4490239----1665500918517",
    "x-nextjs-data": "1",
    "cookie": "CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1665445563310%2Cregion:%27US%27}; _gcl_au=1.1.2082461946.1665445564; _gid=GA1.2.912534791.1665445564; _fbp=fb.1.1665445563910.1309830388; hubspotutk=38f65c00ad80ccb62157a21ce633abc8; __hssrc=1; AMP_MKTG_261f38a0f0=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; _hjSessionUser_1219630=eyJpZCI6IjZiZjI4YTc3LTg2MjgtNWY4OS04Mjc4LTk5ZjRlNjkzNmU3YyIsImNyZWF0ZWQiOjE2NjU0NDU1NjQ0NjEsImV4aXN0aW5nIjp0cnVlfQ==; _hjIncludedInSessionSample=0; _hjSession_1219630=eyJpZCI6IjU1YTRiNDU3LWI3MmItNGNjNy1hZmMyLTk3YzQ3MDg1ZTQ5MyIsImNyZWF0ZWQiOjE2NjU0OTc5NTcwMzUsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=0; _ga_5NXQ655FGP=GS1.1.1665500917.5.1.1665500918.0.0.0; AMP_261f38a0f0=JTdCJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJkZXZpY2VJZCUyMiUzQSUyMmFmZDljNGRhLWFlNTMtNGQ5OS1hNTRhLThiOWFmZDRjNWRlNCUyMiUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNjY1NTAwOTE4MjY5JTJDJTIyc2Vzc2lvbklkJTIyJTNBMTY2NTUwMDkxODI2OCU3RA==; _ga=GA1.2.99072429.1665445563; _gat=1; __hstc=3035439.38f65c00ad80ccb62157a21ce633abc8.1665445564275.1665497957310.1665500918406.6; __hssc=3035439.1.1665500918406",
    "Referer": "https://theorg.com/organizations?countries=united-states&employeeRanges=200-500",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});







       