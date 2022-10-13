const fs = require('fs');
const { exit } = require('process');

(async function() {
    const dataFileName = "HS_companies.json"; // change file path here.

    let companies = fs.readFileSync(dataFileName, 'utf-8');
    let dataRes = JSON.parse(companies);

    // configure search bounds. 
    // Note handshake won't let you search beyond 10k entries. good params are 1, 10, 1000
    var page = 1; // start page
    const stopPage = 10;
    const perPage = 1000;

    // `https://app.joinhandshake.com/stu/employers?page=${page}&per_page=${perPage}&sort_direction=desc&sort_column=default&institution_sizes%5B%5D=4&_=${Date.now()}`

    async function getPageResults(page) {
        const res = await fetch(`https://app.joinhandshake.com/stu/employers?page=${page}&per_page=${perPage}&sort_direction=desc&sort_column=default&institution_sizes%5B%5D=4&_=${Date.now()}`, {
            "headers": {
              "accept": "application/json",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "max-age=0",
              "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "same-origin",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              "cookie": "_biz_uid=faff21b217914b1edb222cac80811358; ajs_anonymous_id=%2293c187ba-2520-4c3e-8a9c-303a1ec223c2%22; _mkto_trk=id:390-ZTF-353&token:_mch-joinhandshake.com-1665188777583-88345; _gcl_au=1.1.2109423817.1665188778; _tt_enable_cookie=1; _ttp=340ee74c-7259-4da2-961d-1c161b595b51; _fbp=fb.1.1665188778389.273074494; __pdst=ea1a0c675bc04026813c05b605618e7b; hss-global=eyJhbGciOiJkaXIiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIn0..Kwsv1lZUvhTgLA0xBmTukQ.7MPvacIQtbT4JLluYXYuBhSFWlP43SfE8KiwedZmdBxwpwiV4r7mOb04pm7pasLREU2EcGS2LitnT7lVsZzw38lIcwBObDHkv7m4kB8hCLeJ6yUbY1s-AUA04x81qAhg3461d-O4YFI-L4fhIfdjIqx6cI3jdt45xcAbFHyW4UIXxt7I5NHeNgfMRzIH5RloVHCwzyDBuYMBJxUjC_OEBk5vCqaSm2bnT0S8k5Qyz9r9w6h7TgPVdgWs3TllGk6GwDDMZbgZkm-nd1NMHl1TrXZ5RzuHx4Rtf3962N4zgDlEaU7TaX6l8hjxhN5KwUGQ6fz6SEG4HxYS2FROXbyxNIcab6SHw35E7AQmqFoch7z43QeyUGau2nja6jrms60c.vbqyeiCE2rL_DqOAQtwhde1UVLoCy60FP62ouy-l5XM; ajs_user_id=20115531; _hjSessionUser_1832914=eyJpZCI6IjdhYTczMTY4LTNkN2YtNWVlMS1iZjFlLTIxM2U1ZmVjZWE3MCIsImNyZWF0ZWQiOjE2NjUxODg3Nzc2MjUsImV4aXN0aW5nIjp0cnVlfQ==; _biz_flagsA=%7B%22Version%22%3A1%2C%22ViewThrough%22%3A%221%22%2C%22XDomain%22%3A%221%22%2C%22Mkto%22%3A%221%22%7D; _uetsid=cc97799048f111edac00f93fc43ea135; _uetvid=d3ab2870469f11eda72f0f083d8148b7; _gid=GA1.2.14029900.1665443888; _clck=1vay68c|1|f5l|0; production_js_on=true; production_20115531_incident-warning-banner-show=%5B%5D; _clsk=1kbpseh|1665446246241|1|1|j.clarity.ms/collect; _biz_nA=6; _ga=GA1.1.1131082094.1665188778; _biz_pendingA=%5B%5D; _ga_4M16ZMP2G5=GS1.1.1665446247.7.1.1665446848.0.0.0; _trajectory_session=ck1IbUt0eXZTVjNFT1o1cDcyWE5xYk9QMTl2UkxpSnkrL2orQkpYazZsa0lxZmdNK1dCUE1xdzdLeFh1ckdCVVFCSXlZcXg2dkpLbGt5M0VZSTRPK3J4dERwSm9VUjdjZGlLeitmaGQ4QkhQYVZxczY5ZG1ZMlpxdVBvaWpGQVdlNXZqOW0rYXBmYU5JbUNHMHJRMldTZ0YyOEdiemY4RHdNRmRWaGdJY2xhalBzL2xMa0tFQU9IL00yYXBCOGc2UldnbG5ld2VEUGdENjBNMEZ4dmE1UT09LS1JZ3M3M2V3TlgwaHhkemlSRS9EZmN3PT0%3D--f5a6d24728829e84351342e743979b3b1e19ba73",
              "Referer": "https://joinhandshake.com/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });


        const json = await res.json();

        console.log(json)
        return json["results"];
    }

    
    while (page <= stopPage) {
        const pageResults = await getPageResults(page);
        if (pageResults.length > 0) {
            dataRes.companies.push(...pageResults);
            page += 1;

            await fs.writeFileSync(dataFileName, JSON.stringify(dataRes), 'utf-8');

            console.log('Successfully scraped page ' + page)
        } else {
            break; // in case you hit the end of the results early
        }
    }

    console.log('Exited!')

})();





