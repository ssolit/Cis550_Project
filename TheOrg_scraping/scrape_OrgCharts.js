const fs = require('fs');
const { exit } = require('process');

(async function() {
    const save_path = "orgCharts_US_10-500e.json"; // change file path here. Remember to put {"orgCharts":[]} in it if needed
    const previews_path = "TO_company_previews_2.json"

    let previews = JSON.parse(fs.readFileSync(previews_path, 'utf-8'));
    let orgChartsObj = JSON.parse(fs.readFileSync(save_path, 'utf-8'));

    async function fetchCompInfo(comp_name) {
      // note: these fetch calls go stale. The _next/data/ part of the url, newrelic, and cookie all change
      // To replace it:
        // 0) make sure the save_file is set up right (see line 4)
        // 1) copy the graphql Node.js fetch. It should be from a page like https://theorg.com/org/flat-mx/org-chart/full-screen and its preview should start with data{data{company{...}}}
        // 2) delete the "if-none-match" header if its there
        // 3) edit the "body" - change "" to `` and subsitute the compnay slug (ex flat-mx) with ${comp_name}
      const res = await fetch("https://prod-graphql-api.theorg.com/graphql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjI1OTExNzYiLCJhcCI6IjExMzQyMTEzMTQiLCJpZCI6Ijg3MDE3YmNlMDI0ZjQxYWIiLCJ0ciI6IjYzODE3YmU2NzEzYzFhNDE5OWRjMDlmMGMyZDk1YWIwIiwidGkiOjE2Njg3OTIzMzU0Mzl9fQ==",
          "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "traceparent": "00-63817be6713c1a4199dc09f0c2d95ab0-87017bce024f41ab-01",
          "tracestate": "2591176@nr=0-1-2591176-1134211314-87017bce024f41ab----1668792335439",
          "Referer": "https://theorg.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"operationName\":\"Company\",\"variables\":{\"slug\":\"${comp_name}\"},\"query\":\"query Company($slug: String!) {\\n  company(slug: $slug) {\\n    ...FullCompany\\n    __typename\\n  }\\n}\\n\\nfragment FullCompany on Company {\\n  id\\n  name\\n  slug\\n  extensions\\n  logoImage {\\n    ...ImageFragment\\n    __typename\\n  }\\n  social {\\n    ...CompanySocialFragment\\n    __typename\\n  }\\n  location {\\n    ...CompanyLocation\\n    __typename\\n  }\\n  description\\n  type\\n  industry\\n  status\\n  private\\n  teams {\\n    id\\n    __typename\\n  }\\n  meta {\\n    ...MetaFragment\\n    __typename\\n  }\\n  nodes {\\n    ...PositionNode\\n    __typename\\n  }\\n  stats {\\n    ...CompanyStats\\n    __typename\\n  }\\n  verification {\\n    verificationType\\n    __typename\\n  }\\n  adminLocked\\n  stage\\n  companyValues {\\n    ...CompanyValue\\n    __typename\\n  }\\n  imageGallery {\\n    ...ImageFragment\\n    __typename\\n  }\\n  testimonials {\\n    ...CompanyTestimonialConnection\\n    __typename\\n  }\\n  industries {\\n    ...CompanyIndustryFragment\\n    __typename\\n  }\\n  lastUpdate\\n  permissionSettings {\\n    companyId\\n    restrictMembersFromEditing\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ImageFragment on Image {\\n  endpoint\\n  ext\\n  placeholderDataUrl\\n  prevailingColor\\n  uri\\n  versions\\n  __typename\\n}\\n\\nfragment CompanySocialFragment on CompanySocial {\\n  twitterUrl\\n  linkedInUrl\\n  facebookUrl\\n  websiteUrl\\n  __typename\\n}\\n\\nfragment CompanyLocation on CompanyLocation {\\n  id\\n  street\\n  postalCode\\n  city\\n  subLocality\\n  country\\n  countryIso\\n  state\\n  locationString\\n  isPrimary\\n  __typename\\n}\\n\\nfragment MetaFragment on CompanyMeta {\\n  noIndex\\n  importanceScore\\n  tags\\n  __typename\\n}\\n\\nfragment PositionNode on OrgChartStructureNode {\\n  id\\n  title\\n  leafMember {\\n    ...FlatPositionFragment\\n    __typename\\n  }\\n  containingNodeId\\n  node {\\n    ... on Vacant {\\n      job {\\n        id\\n        slug\\n        title\\n        location {\\n          city\\n          state\\n          country\\n          __typename\\n        }\\n        atsProvider {\\n          provider\\n          __typename\\n        }\\n        createdOn\\n        jobFunction\\n        remote\\n        manager {\\n          ... on ChartNodeGroup {\\n            positions {\\n              ... on PositionOrgChartPosition {\\n                positionId\\n                fullName\\n                profileImage {\\n                  ...ImageFragment\\n                  __typename\\n                }\\n                __typename\\n              }\\n              __typename\\n            }\\n            __typename\\n          }\\n          ... on ChartNodeSingular {\\n            positionId\\n            position {\\n              ... on PositionOrgChartPosition {\\n                profileImage {\\n                  ...ImageFragment\\n                  __typename\\n                }\\n                fullName\\n                __typename\\n              }\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  order\\n  parentId\\n  section\\n  type\\n  __typename\\n}\\n\\nfragment FlatPositionFragment on FlatPosition {\\n  id\\n  slug\\n  fullName\\n  role\\n  roleFunction\\n  roleAutoFunction\\n  description\\n  parentPositionId\\n  profileImage {\\n    ...ImageFragment\\n    __typename\\n  }\\n  social {\\n    ...UserSocialFragment\\n    __typename\\n  }\\n  isAdviser\\n  group {\\n    ...PositionGroupFragment\\n    __typename\\n  }\\n  companyStartDate {\\n    day\\n    month\\n    year\\n    __typename\\n  }\\n  roleStartDate {\\n    day\\n    month\\n    year\\n    __typename\\n  }\\n  location {\\n    ...CompanyLocation\\n    __typename\\n  }\\n  invitedAt\\n  remote\\n  lastUpdate\\n  pronoun\\n  invitedAt\\n  claimedBy\\n  __typename\\n}\\n\\nfragment UserSocialFragment on UserSocial {\\n  twitterUrl\\n  linkedInUrl\\n  facebookUrl\\n  websiteUrl\\n  __typename\\n}\\n\\nfragment PositionGroupFragment on PositionGroup {\\n  id\\n  name\\n  __typename\\n}\\n\\nfragment CompanyStats on CompanyStats {\\n  tags\\n  employeeRange\\n  followerCount\\n  positionCount\\n  jobsCount\\n  teamsCount\\n  announcementsCount\\n  following\\n  promptDismissals\\n  latestFundingRound {\\n    id\\n    fundingType\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CompanyValue on CompanyValue {\\n  id\\n  value\\n  description\\n  __typename\\n}\\n\\nfragment CompanyTestimonialConnection on CompanyTestimonialConnection {\\n  testimonial {\\n    id\\n    question\\n    answer\\n    __typename\\n  }\\n  position {\\n    id\\n    slug\\n    fullName\\n    profileImage {\\n      ...ImageFragment\\n      __typename\\n    }\\n    role\\n    parentPositionId\\n    isAdviser\\n    lastUpdate\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CompanyIndustryFragment on CompanyTag {\\n  id\\n  title\\n  __typename\\n}\\n\"}`,
        "method": "POST"
      });
      // console.log("finishing fetch\n")

      const json = await res.json();
      return json;
    }

    async function scrape_one_chart(c_name) {
        const result = await fetchCompInfo(c_name);
        if (result == undefined || result["data"] == undefined) {
          console.log(`scrape failed: undefined. failure point: ${c_name}`)
          console.log()
          return
        }

        let clean_chart = {"CompanyName":result["data"]["company"]["name"],
                              "stats": {
                                "social": result["data"]["company"]["social"],
                                "location": result["data"]["company"]["location"],
                                "description": result["data"]["company"]["description"],
                                "employeeRange": result["data"]["company"]["stats"]["employeeRange"],
                                "stage":result["data"]["company"]["stats"]["stage"],
                                "industries": result["data"]["company"]["stats"]["industries"],
                                "lastUpdate": result["data"]["company"]["stats"]["lastUpdate"],
                                },
                                "employeeNodes": result["data"]["company"]["nodes"],
                            }
        orgChartsObj.orgCharts.push(clean_chart)
        await fs.writeFileSync(save_path, JSON.stringify(orgChartsObj), 'utf-8');
    }

    console.log("starting scrapes")
    let init_i = 13400;
    let print_counter = init_i;
    for (let i = init_i; i < previews["companies"].length; i++) {
      console.log("here!!!\n");
      let c_name = previews["companies"][i]["preview"]["slug"]
      // console.log(c_name + " " + i + "\n");
      await scrape_one_chart(c_name)
      print_counter++;
      if (print_counter%100 == 0) {
        console.log(`${print_counter}/${previews["companies"].length}`);
      }
    }
    console.log("Successful Exit!")

})();
