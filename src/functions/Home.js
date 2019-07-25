import Vue, {
  //  nextTick
} from 'vue'

import {
  plugin,
  value
} from 'vue-function-api'
import axios from "axios";
import __DDM from "../assets/default";
import __DPM from "../assets/defaultParams";
import lunr from "lunr";


Vue.use(plugin)


export const errorMessage = value("");
export const proxyServer = value(false);
export const perPage = value(30);
export const currentPage = value(1);
export const rowsCount = value(1);
export const csv = value("");
export const jdata = value("");
export const fetchResponse = value("");
export const __EVENTVALIDATION = value("");
export const __LASTFOCUS = value("");
export const __EVENTTARGET = value("");
export const __EVENTARGUMENT = value("");
export const __VSTATE = value("");
export const __VIEWSTATE = value("");
export const domain = value("");
export const url = value(
  "https://www.mathxl.com/info/mmlib.aspx?bookcode=ca_hacv111ce"
);
export const csvjson = value([]);
export const table = value([{
  linkNumber: "",
  url: "",
  status: "",
  statusText: "",
  contentMatchOn: "",
  scoreMatch: ""
}]);
export const hreflinks = value([]);



export const checkProxyServer = () => {


  axios
    .get("http://localhost:18765")
    .then(res => {

      res.status == 200 ?
        (proxyServer.value = true) :
        (proxyServer.value = false);


      let resArr = res.data.split(' ').filter(i => i.length != 0)
      if (resArr[0] == "This" && resArr[1] == "API" && resArr[2] == 'enables') {
        proxyServer.value = true

        //will require explicit import {nextTick} from 'vue'
        Vue.nextTick(() => {
          console.log('nextTick Example', document.querySelector('#cd-ta'))
        })

      } else {
        proxyServer.value = false

      }

      if (proxyServer.value) {
        csv.value = __DDM;
      }
    })
    .catch(e => {
      errorMessage.value = e;
    });
};
export const assignParsedJSON = () => {
  try {
    csvjson.value = JSON.parse(document.querySelector("#jd-ta").value);
    // csvjson.value = JSON.parse("asdfasdfds");
    alert(`Parameters are set`);
  } catch (e) {
    alert(`Invalid data: ${e}, there is something wrong with the CSV data`);
  }
};
export const convertCJ = () => {
  csv.value = document.querySelector("#cd-ta").value;
  jdata.value = document.querySelector("#jd-ta").value;
  let aa = csv.value.split("\n").map(i => i.split("\t"));
  let parsedJSON = [];
  aa.forEach(item => {
    if (item.length == 2) parsedJSON.push({
      url: item[0],
      title: item[1]
    });
  });
  jdata.value = JSON.stringify(parsedJSON);
  document.querySelector("#jd-ta").value = jdata.value;
};
export const fetchContent = () => {
  //setting defaults
  document.querySelector("#fetch-button").setAttribute("disabled", true);
  document.querySelector("#furl").setAttribute("disabled", true);
  fetchResponse.value = "";
  table.value = [{
    linkNumber: "",
    url: "",
    status: "",
    statusText: "",
    contentMatchOn: "",
    scoreMatch: ""
  }];
  domain.value = url.value.match(/.+\.(com|ca)\/?/g);
  //getting form
  axios
    .get(`http://localhost:18765/${url.value}`)
    .then(res => {
      var temp = "";
      let domparser = new DOMParser();

      var doc = domparser.parseFromString(res.data, "text/html");
      let escvstate = encodeURIComponent(
        doc.querySelector("#__VSTATE").value
      );
      let escev = encodeURIComponent(
        doc.querySelector("#__EVENTVALIDATION").value
      );
      __LASTFOCUS.value = `${
        doc.querySelector("#__LASTFOCUS").id
      }=${encodeURIComponent(doc.querySelector("#__LASTFOCUS").value)}&`;
      __EVENTTARGET.value = `${
        doc.querySelector("#__EVENTTARGET").id
      }=${"ctl00%24ctl00%24InsideForm%24MasterContent%24ButtonSearch"}&`;
      __EVENTARGUMENT.value = `${
        doc.querySelector("#__EVENTARGUMENT").id
      }=${encodeURIComponent(
        doc.querySelector("#__EVENTARGUMENT").value
      )}&`;
      __VSTATE.value = `${doc.querySelector("#__VSTATE").id}=${escvstate}&`;
      __VIEWSTATE.value = `${
        doc.querySelector("#__VIEWSTATE").id
      }=${encodeURIComponent(doc.querySelector("#__VIEWSTATE").value)}&`;
      __EVENTVALIDATION.value = `${
        doc.querySelector("#__EVENTVALIDATION").id
      }=${escev}&`;

      temp = `${__LASTFOCUS.value}${__EVENTTARGET.value}${
        __EVENTARGUMENT.value
      }${__VSTATE.value}${__VIEWSTATE.value}${
        __EVENTVALIDATION.value
      }${__DPM}`;
      return temp;
    })
    .catch(e => console.log(e))
    .then(temp => {
      //post the form
      let domparser = new DOMParser();
      axios
        .post(`http://localhost:18765/${url.value}`, temp, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
          }
        })
        .then(res => {
          let responseDoc = domparser.parseFromString(
            res.data,
            "text/html"
          );
          // console.log(responseDoc, typeof responseDoc);
          // console.log(res.data);
          fetchResponse.value = res.data;
          hreflinks.value = responseDoc.querySelectorAll("a.lightLink");
        })
        .then(() => {
          //render the page so we can grab links in addition to add comparing dom to excel
          let pgr = document.querySelector("#pageRendered");
          let constructedString = "";
          hreflinks.value.forEach(i => {
            constructedString += i.href + "\n";
          });
          let regexFull = /(https:\/\/mediaplayer.pearsoncmg\.com\/assets\/|\/\/media\.pearsoncmg\.com\/|info\/ebook|PartnerGradedMedia.aspx)[A-Za-z_\d\/\.?=&]*/g;
          let fullList = constructedString.match(regexFull);

          let finalList = fullList
            .map(i => (i.match(/^\/\/\w+/g) ? (i = `https:${i}`) : i))
            .map(i =>
              !i.match(/^https/g) || !i.match(/^http/g) ?
              (i = `https://www.mathxl.com/${i}`) :
              i
            );
          let uniqueList = finalList;
          rowsCount.value = uniqueList.length;
          return uniqueList;
        })
        .catch(e => console.log("rendering post broke " + e))
        .then(uniqueList => {
          let pgr = document.querySelector("#pageRendered");
          let index = 0;
          let dataStructure = []
          for (
            let i = 0, p = Promise.resolve(); i < uniqueList.length; i++
          ) {
            p = p.then(
              () =>
              new Promise(resolve => {
                //check the links
                axios
                  .get(`http://localhost:18765/${uniqueList[i]}`)
                  .catch(e => {
                    table.value.push({
                      linkNumber: index + 1,

                      url: uniqueList[i],
                      status: "404",
                      statusText: "not found"
                    });
                  })
                  .then(res => {
                    // console.log(uniqueList);
                    //remove cors
                    // console.log(res);
                    let urlTrunc = res.config.url.split(
                      "http://localhost:18765/"
                    )[1];

                    let results = csvjson.value.filter(i =>
                      urlTrunc.match(i.url)
                    );

                    let setPct = "";
                    let searchValue = "";
                    let fetchedContent = "";
                    let parsedText = ""
                    // console.log(results);
                    if (results.length > 0) {
                      // console.log(results[0].score);
                      fetchedContent = domparser.parseFromString(
                        res.data,
                        "text/html"
                      );

                      let conStr = ""
                      try {
                        conStr = `${fetchedContent.querySelector('title').innerText} `
                        fetchedContent.querySelectorAll('div').forEach(i => {
                          conStr += `${i.innerText} `
                        })
                        fetchedContent.querySelectorAll('p').forEach(i => {
                          conStr += `${i.innerText} `
                        })
                        fetchedContent.querySelectorAll('label').forEach(i => {
                          conStr += `${i.innerText} `
                        })
                        fetchedContent.querySelectorAll('li').forEach(i => {
                          conStr += `${i.innerText} `
                        })
                        fetchedContent.querySelectorAll('button').forEach(i => {
                          conStr += `${i.innerText} `
                        })
                        conStr += fetchedContent.querySelector('body').innerText
                      } catch (e) {
                        console.log(e)
                      }


                      parsedText = conStr
                      //   `${fetchedContent.querySelector("title").innerText} 
                      // `;
                      console.log(parsedText)
                      var idx = lunr(function () {
                        this.field("title");
                        this.add({
                          title: parsedText
                        });
                      });
                      let needle = results[0].title.replace(":", "");
                      searchValue = needle;
                      let arrayResult = idx.search(needle);
                      console.log(arrayResult);
                      if (arrayResult.length > 0) {
                        setPct = arrayResult[0].score.toFixed(2);
                      }
                    }

                    if (res != undefined) {
                      let rvariant =
                        setPct > 0.75 ? "success" : "warning";
                      rvariant = setPct < 0.5 ? "danger" : rvariant;
                      rvariant = setPct == 0 ? "" : rvariant;
                      let scoreMatchMsg =
                        setPct > 0.75 ?
                        setPct + " high" :
                        setPct + " medium";

                      scoreMatchMsg =
                        setPct < 0.5 ? setPct + " low" : scoreMatchMsg;

                      scoreMatchMsg =
                        setPct == undefined || setPct == 0 ?
                        "0 n/a" :
                        scoreMatchMsg;

                      table.value.push({
                        linkNumber: index + 1,
                        url: `<a href="${
                            uniqueList[i]
                          }"  target="_blank">${uniqueList[i]}</a>`,
                        status: res.status,
                        statusText: res.statusText,
                        contentMatchOn: searchValue,
                        scoreMatch: scoreMatchMsg,
                        _rowVariant: rvariant
                      });

                      dataStructure.push({
                        input: {
                          searchValue: searchValue,
                          parsedText: parsedText

                        },
                        output: {
                          setPct: setPct > 0.75 ? 1 : 0
                        }
                      })


                      // console.log(hreflinks[index]);

                      pgr.querySelectorAll("a.lightLink")[
                          index
                        ].innerHTML =
                        pgr.querySelectorAll("a.lightLink")[index]
                        .innerHTML +
                        " <span class='ml-2 badge badge-success'>checked</span>";
                      setTimeout(() => {
                        pgr
                          .querySelectorAll("a.lightLink")[index].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "nearest"
                          });
                      }, 100);
                    } else {
                      pgr.querySelectorAll("a.lightLink")[
                          index
                        ].innerHTML =
                        pgr.querySelectorAll("a.lightLink")[index]
                        .innerHTML +
                        " <span class='ml-2 badge badge-danger'>checked failed</span>";

                      setTimeout(() => {
                        pgr
                          .querySelectorAll("a.lightLink")[index - 1].scrollIntoView({
                            // behavior: "smooth",
                            block: "end",
                            inline: "nearest"
                          });
                      }, 300);
                    }
                    if (index == uniqueList.length - 1) {
                      table.value.push({
                        linkNumber: "done",
                        url: "done",
                        status: "done",
                        statusText: "done"
                      });

                      // let dsJson = []

                      // for (let i = 0; i < dataStructure.length; i += 3) {
                      //   dsJson.push({
                      //     input: {
                      //       sv: dataStructure[i],
                      //       pt: dataStructure[i + 1],
                      //       sm: dataStructure[i + 2]
                      //     },
                      //     output: {
                      //       ot: dataStructure[i + 2] != "0 n/a" ? 'n/a' : dataStructure[i + 2]
                      //     }
                      //   })
                      // }

                      console.log(JSON.stringify(dataStructure))


                      document
                        .querySelector("#fetch-button")
                        .removeAttribute("disabled");
                      document
                        .querySelector("#furl")
                        .removeAttribute("disabled");
                    }
                    // console.log(index);
                    index++;
                    resolve();
                  })
                  .catch(e => {
                    console.log(e);
                  })
              })
            );
          }
        }).then(() => {
          let images = document
            .querySelector("#Results")
            .querySelectorAll("img");
          // console.log(images);
          images.forEach(i => {
            i.setAttribute(
              "src",
              `${domain.value}${i.getAttribute("src").split("../")[1]}`
            );
          });
        })
    })
    .catch(e => console.log("posting broke: " + e));
};