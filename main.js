window.addEventListener("load", () => {
  const mainContnet = document.querySelector("#main-content");
  const loadingScreen = document.querySelector("#loading-screen");
  const curtains = document.querySelectorAll(".curtain");
  const spiner = document.querySelector("#spinner");

  setTimeout(() => {
    mainContnet.style.opacity = "1";
    mainContnet.style.visibility = "visible";

    for (let curtain of curtains) {
      curtain.classList.add("open");
    }
    spiner.classList.add("open");
    setTimeout(() => {
      loadingScreen.style.display = "none";
      const aboutTag = document.querySelector(".about_tag");
      aboutTag.classList.add("open");
      fetchData("./data/about.json", fetchAbout);
      setIsotope();
    }, 1000);
  }, 1000);
});

const navs = document.querySelectorAll("header li");
const swiper = new Swiper(".swiper", {
  simulateTouch: false,
  direction: "horizontal",
  pagination: {},
  on: {
    slideChange: function () {
      // 현재 슬라이드 인덱스 가져오기
      const currentIndex = this.activeIndex;
      navs.forEach((nav, idx) => {
        nav.querySelector("a").classList.remove("active");
      });
      navs[currentIndex].querySelector("a").classList.add("active");
    },
  },
});

navs.forEach((nav, idx) => {
  nav.addEventListener("click", (e) => {
    swiper.slideTo(idx);
  });
});

fetchData("./data/skillList.json", fetchSkill);
fetchData("./data/portfolio.json", fetchPortfolio);

function fetchData(path, callback, ...extra) {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        callback(datas, ...extra);
        resolve(); // 작업 완료 시 resolve 호출
      })
      .catch((error) => {
        console.error("Error fetching the portfolio:", error);
        reject(error);
      });
  });
}

// about
function fetchAbout(datas) {
  am4core.useTheme(am4themes_animated);
  var chart = am4core.create("word_cloud", am4plugins_wordCloud.WordCloud);
  var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

  series.accuracy = 4;
  series.randomness = 0;
  series.step = 15;
  series.rotationThreshold = 0;
  series.maxCount = 200;
  series.minWordLength = 2;
  series.labels.template.tooltipText = "{word}";
  series.fontFamily = "Courier New";
  series.maxFontSize = am4core.percent(30);
  series.colors = new am4core.ColorSet();
  series.events.on("arrangestarted", function (ev) {});
  series.data = datas;

  series.dataFields.word = "tag";
  series.dataFields.value = "weight";

  const g = document.querySelectorAll("g");

  for (let s of g) {
    if (s.getAttribute("aria-labelledby") === "id-50-title")
      s.style.display = "none";
  }
}
// ---about

// skill

function fetchSkill(datas) {
  const skill_container = document.querySelector("#skill .skill_container");

  for (let data of datas) {
    skill_container.innerHTML += `
    <li id="skill_box_${data.category}" class="skill_box">
      <ul>
      </ul>
    </li>
    `;

    const skill_box = skill_container.querySelector(
      `#skill_box_${data.category} ul`
    );

    for (let skill of data.skills) {
      skill_box.innerHTML += `<li class="df">
            <div class="skill_category">
              <img src="${skill.img}" alt="${skill.name}" />
            </div>
            <div class="skill_descript">
              <h4 class="skill_name">${skill.name}</h4>
              <div class="progress_bg">
                <div class="progress_bar" data-progress="${skill.achivement}">0%</div>
              </div>
              <p class="skill_comment">${skill.comment}</p>
            </div>
          </li>`;
    }
  }
  const skillBtns = document.querySelectorAll("#skill .list_nav button");
  const skillLists = document.querySelectorAll(".selected_skill > li h3");
  const skillTitle = document.querySelector(".selected_skill h3");
  const skillboxs = document.querySelectorAll(".skill_container .skill_box");

  function setProgressBar(bars) {
    const progressBars = bars.querySelectorAll("li .progress_bar");
    progressBars.forEach((bar) => {
      const barWidth = bar.dataset.progress;
      bar.style.width = barWidth + "%";
    });
  }

  function setSkill(btn, btnIdx) {
    skillTitle.innerText = btn.innerText;
    if (!skillBtns[btnIdx].classList.contains("show")) {
      skillboxs.forEach((list, skillIdx) => {
        skillBtns[skillIdx].classList.remove("show");
        skillboxs[skillIdx].classList.remove("show");
      });
      skillBtns[btnIdx].classList.add("show");
      skillboxs[btnIdx].classList.add("show");

      setProgressBar(skillboxs[btnIdx]);
    }
  }
  skillBtns.forEach((btn, btnIdx) => {
    btn.addEventListener("click", () => {
      setSkill(btn, btnIdx);
    });
  });
  navs[1].addEventListener("click", () => {
    setSkill(skillBtns[0], 0);
  });
}
// --skill

// portfolio

function setIsotope() {
  var filters = {};

  var grid = document.querySelector(".grid");
  var iso = new Isotope(grid, {
    // percentPosition: true,
    itemSelector: ".grid-item",
    layoutMode: "masonry", // layoutMode를 packery로 변경
    masonry: {
      gutter: 5, // 아이템 간격
      // columnWidth: 120,
      // horizontalOrder: true,
      fitWidth: true,
    },
    // originLeft: false,
  });
  iso.arrange({ filter: "*" });
  document
    .querySelectorAll("#portfolio .button-group")
    .forEach(function (buttonGroup) {
      buttonGroup.addEventListener("click", function (event) {
        if (event.target.matches("button")) {
          var button = event.target;
          var filterGroup =
            button.parentElement.getAttribute("data-filter-group");
          var filterValue = button.getAttribute("data-filter").toLowerCase();
          // Update filter for the group
          filters[filterGroup] = filterValue;
          // Combine filters

          buttonGroup.querySelectorAll("button").forEach((btn) => {
            btn.classList.remove("show");
          });
          button.classList.add("show");

          var combinedFilter = concatValues(filters);
          iso.arrange({ filter: combinedFilter });
        }
      });
    });
  // Flatten object by concatenating values
  function concatValues(obj) {
    var value = "";
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        value += obj[prop];
      }
    }
    return value || "*";
  }
}
function fetchPortfolio(data) {
  for (let gridItem of data) {
    const grid = document.querySelector(".grid");
    const filter = gridItem.filter.join(" ").toLowerCase();
    grid.innerHTML += `<figure
      class="grid-item ${filter}"
    >
      <img src="${gridItem.thumb}" alt="${gridItem.title}" />
      <figcaption id="${gridItem.id}">${gridItem.title}</figcaption>
    </figure>`;
  }
  requestAnimationFrame(() => {
    setIsotope();
    // setDialog();
    const thumbs = document.querySelectorAll("#portfolio figcaption");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () =>
        fetchData("./data/portfolio.json", setDialog, thumb)
      );
    });
  });
}

function setDialog(datas, thumb) {
  const id = thumb.getAttribute("id");
  const dialog = document.getElementById("dialog-content");
  const dialogImg = dialog.querySelector(".portfolio_dialog_bg img");
  const dialogTitle = dialog.querySelector(".portfolio_dialog_textBox h3");
  const dialogCategory = dialog.querySelector(
    ".portfolio_dialog_textBox .category"
  );
  const dialogPeriod = dialog.querySelector(
    ".portfolio_dialog_textBox .period"
  );
  const dialogTools = dialog.querySelector(".portfolio_dialog_textBox .tools");
  const dialogRole = dialog.querySelector(".portfolio_dialog_textBox .role");
  const dialogMembers = dialog.querySelector(
    ".portfolio_dialog_textBox .members"
  );

  const dialogDirect = dialog.querySelector(
    ".portfolio_dialog_textBox .portfolio_direct"
  );
  const dialogGit = dialog.querySelector(
    ".portfolio_dialog_textBox .portfolio_git"
  );
  const dialogSkills = dialog.querySelector(
    ".portfolio_dialog_textBox .skill_list"
  );
  const dialogDesc = dialog.querySelector(
    ".portfolio_dialog_textBox .dialog_desc"
  );
  const dialogFeauture = dialog.querySelector(
    ".portfolio_dialog_textBox .feature "
  );
  // const dialogFeauture = dialog.querySelector(
  //   ".portfolio_dialog_textBox .feature "
  // );

  for (let data of datas) {
    if (data.id === id) {
      dialogImg.setAttribute("src", data.bg);
      dialogImg.setAttribute("alt", data.title);
      dialogTitle.innerText = data.title;
      dialogDirect.setAttribute("href", data.path);
      dialogCategory.innerHTML = data.category;
      dialogPeriod.innerHTML = data.period;
      setTags(dialogTools, data.tools);
      setTags(dialogRole, data.role);
      setTags(dialogSkills, data.skills);

      dialogMembers.innerHTML = data.members;
      if (data.github === "null") {
        dialogGit.classList.add("null");
      } else {
        dialogGit.classList.remove("null");
        dialogGit.setAttribute("href", data.github);
      }
      setTags(dialogTools, data.tools);

      let descList = "";
      data.desc.forEach((desc) => {
        descList += `<p>${desc}</p>`;
      });
      dialogDesc.innerHTML = descList;
      dialogFeauture.innerHTML = writeFeatures(data.feature);

      let featureImgs = document.querySelectorAll(".feature_container img");
      if (featureImgs.length > 0) {
        for (let img of featureImgs) {
          img.style.width = img.dataset.width;
          img.style.height = img.dataset.height;
        }
      }
    }
  }
  function setTags(target, datas) {
    let bg = {
      html: "#ec3434",
      css: "orange",
      javascript: "yellow",
      react: "green",
      php: "skyblue",
      bootstrap: "#9be79b",
      "visual studio code": "#ed70ca",
      jquery: "white",
      mysql: "pink",
      xampp: "beige",
      react: "#8842f0",
    };
    let tagList = "";
    for (let tagName of datas) {
      tagList += `<li class="tag">${tagName}</li>`;
    }
    target.innerHTML = tagList;
    const tags = document.querySelectorAll(".tag");
    for (let tag of tags) {
      const name = tag.innerText.toLowerCase();
      tag.style.background = bg[name];
    }
  }
  function writeFeatures(features) {
    let result = "<h4>- 주요 기능 -</h4>";
    for (let feature of features) {
      switch (feature.type) {
        case "gallery":
          result +=
            '<div class="feature_container" style="display: grid; grid-template-columns: repeat(2, auto); gap: 1em;">';

          for (let item of feature.list) {
            result += `<img src="${item}"> `;
          }
          result += "</div>";
          break;
        case "line":
          if (feature.shape)
            result += `<div class="feature_container"><hr style="${feature.shape}"></div>`;
          else result += `<div class="feature_container"><hr></div>`;
          break;
        case "img":
          result += `<div class="feature_container"><img src='${feature.imgPath}' data-width=${feature.width} data-height="${feature.height}"></div>`;
          break;
        case "descript":
          result += `<div class="feature_container"><p>${feature.textContext}</p></div>`;
          break;
        case "featureName":
          result += `<div class="feature_container"><h3>${feature.title}</h3></div>`;
          break;
        case "list":
          result += '<ul class="feature_container">';

          for (let item of feature.items) {
            result += `<li>${item} </li>`;
          }
          result += "</ul>";
          break;
        default:
          console.log("type을 확인해주세요");
          break;
      }
    }
    return result;
  }

  Fancybox.show([{ src: "#dialog-content", type: "inline" }]);
}

let dialogDirect = document.querySelector(".portfolio_direct");
dialogDirect.addEventListener("click", (e) => {
  if (e.target.getAttribute("href") === "null") {
    e.preventDefault();
    alert("아직 준비중입니다.");
  }
});
// --portfolio
