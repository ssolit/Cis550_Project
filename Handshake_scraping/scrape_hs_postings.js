const fs = require('fs');
const { exit } = require('process');

(async function() {
    const dataFileName = "HS_postings.json"; // change file path here.

    let postings = fs.readFileSync(dataFileName, 'utf-8');
    let dataRes = JSON.parse(postings);


    //  filter results by "postings?" in chrome to find correct xhr
    async function getPageResults(page, perPage, emType, onSite, jobType) {
        const res = await fetch(`https://upenn.joinhandshake.com/stu/postings?category=Posting&ajax=true&including_all_facets_in_searches=true&page=${page}&per_page=${perPage}&sort_direction=desc&sort_column=default&employment_type_names%5B%5D=${emType}&job.on_site=${onSite}&job.job_types%5B%5D=${jobType}`, {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9",
              "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-csrf-token": "bKIze862rGUYnd8AayuGjFoACTnGDOTaHyVizceWVrAxVBSRIQhqOdypqxT4E3GWSKiUedrSl9lus10suyJhqw==",
              "x-requested-with": "XMLHttpRequest",
              "cookie": "_biz_sid=1da6a0; ajs_anonymous_id=%22255f89af-c42d-483c-8ee5-dbb4ef37cdd5%22; _mkto_trk=id:390-ZTF-353&token:_mch-joinhandshake.com-1668363617231-85318; _biz_uid=d1550221138d4214ee7bb31c994d5d9e; _biz_nA=2; _biz_flagsA=%7B%22Version%22%3A1%2C%22ViewThrough%22%3A%221%22%2C%22XDomain%22%3A%221%22%7D; _biz_pendingA=%5B%5D; _hjSessionUser_1832914=eyJpZCI6ImM2NGZiYmI2LWQyNjYtNTRmNy1iMTQwLWRlNmVmMTQ3ZGM3NSIsImNyZWF0ZWQiOjE2NjgzNjM2MTczMDYsImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjSession_1832914=eyJpZCI6IjkyODUyNWMwLTY4ZGYtNDRmYy1hMmM2LTAzNTYzN2I5MjFhMSIsImNyZWF0ZWQiOjE2NjgzNjM2MTczNzQsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _gcl_au=1.1.2130634243.1668363617; _gid=GA1.2.1570052886.1668363618; _uetsid=d376cc60637f11ed84d77be9a7c881ae; _uetvid=d376d7b0637f11ed95c4ab02ad9c06c4; ln_or=d; _fbp=fb.1.1668363618260.445294737; _tt_enable_cookie=1; _ttp=e2d591f6-eea3-451b-ba6a-5ce3ff4db38a; __pdst=3cc30b3166b54326b5455ea3fbb57c18; hss-global=eyJhbGciOiJkaXIiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIn0..u0S1ddDoqejaP5obGCY2LA.uuZ_sM8jL2FUVE4xPztruNjlJgSePEEx3hOAA3r7H6_XV_PFEDkze40jstQ_4zv8o62PZytWjID6Jc8IJQ0bkf6OqsmUE4VLq5wK_qQ7cXH1DCrXcKSbzXapdrx0utsopTgJODRYUBM-m168OARNSvrW87WW40-zpCs3FCMFkj3uPOgRnQxhZ7zcl_Fje7D-BvMQr4DQQHvITMOHWhYJeVaBQObw5j0oNrcG_iJq7NBBAtqhYD-4ccHBZltnjy9yNjTeMclgfGApY4U_sBJmy2DDomme75zx_uFILqJmGrgSicPf_Srs1UxhHoMAQiMD3Idz1BXGDDhWHmd4PvE-GRpw9p_tXNrdGGCgd9wvftJ-HlTzEZx7xFtDD8RYtT8s.7y0kocdFfDCj4BW-wltLjGQckpwhjliPU6GbLFPAZsg; production_js_on=true; ajs_user_id=20115531; production_20115531_incident-warning-banner-show=%5B%5D; outbrain_cid_fetch=true; _gat=1; _gat_UA-58165706-1=1; _ga_4M16ZMP2G5=GS1.1.1668363617.1.1.1668364961.0.0.0; _ga=GA1.2.2006880053.1668363618; request_method=POST; _trajectory_session=T2ZFSitvbnVROUZDck1TSTNmditOLzRyclROSjBBMGNxOHpWRW9qcDcydjl6NzBiWVp5SGdRTnJFNXZpNHJIYTM5KzZEWEZ0WnRqeDhuM3FLS1JzM2R5Rld0S1g4aFFLNUhBSzBzVGNtbmpoR2lUeDRKSSt6alBNQkpkVHc1NUFWU2RsSnRUbERjSjVKdXpualp1TlFycnBxUkhnUDBZTkNSZ2JIdUZYQ1V6bUc3akRoSWZGNUY1QThJbUdXY3M3NW51NXEwaXJBQkgzNTJ1VDkxa05HTE9pRlVocUJUcG54OUlZOHdkNFJlQ05Sc0FBSXVBK1ZQT1lUMVVGWGxWazI0N242WTI2Z1pTeGFBbTY2ZEp6K3RhdHpJRHcva0J3TkZRMVpWcWZBREE9LS0xVDB2NEJEMDVCSDR3SEFuTDhYMDF3PT0%3D--580174282917f4a53e6cb6535caea3ed95e795e6",
              "Referer": "https://upenn.joinhandshake.com/stu/postings?page=1&per_page=25&sort_direction=desc&sort_column=default&employment_type_names%5B%5D=Full-Time&job.on_site=true&job.job_types%5B%5D=3",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });


        const json = await res.json();

        // console.log(json)
        return json["results"];
    }

    

    let employmentTypeList = ["Full-Time", "Part-Time"];
    let onSiteList = ["true", "false"];
    let jobTypeList = ["3", "9"]; // 3 is internship, 9 is job

    var startPage = 1; 
    const stopPage = 100;
    const perPage = 100;

    // checkpointing
    init_i = 0;
    init_j = 1;
    init_k = 1; 

    console.log("starting loop");
    for (let i = init_i; i < 2; i++){
        for (let j=init_j; j < 2; j++) {
            for (let k = init_k; k < 2; k++) {
                for (let page = startPage; page < stopPage; page++) {
                    console.log("starting fetch");
                    const pageResults = await getPageResults(page, perPage, employmentTypeList[i], onSiteList[j], jobTypeList[k]);
                    if (pageResults.length > 0) {
                        dataRes.postings.push(...pageResults);
                        await fs.writeFileSync(dataFileName, JSON.stringify(dataRes), 'utf-8');
                        console.log('Successfully scraped page %d, %d, %d, %d', i, j, k, page);
                    } else {
                        break; // no more entires, skip to next section
                    }
                }
            }
        }
    }
    console.log('Exited!')

})();







