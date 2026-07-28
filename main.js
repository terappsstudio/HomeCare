// ===============================
// HomeCare Main
// ===============================

const items =
JSON.parse(localStorage.getItem("homecareItems")) || [];

window.onload = function(){

    updateSummary();

    renderRecent();

};


// ===============================
// 오늘 / 이번주 교체
// ===============================

function updateSummary(){

    let todayCount = 0;
    let weekCount = 0;

    const today = new Date();

    today.setHours(0,0,0,0);

    items.forEach(function(item){

        let replace = new Date(item.install);

        replace.setDate(
            replace.getDate() + item.cycle
        );

        replace.setHours(0,0,0,0);

        let diff = Math.floor(
            (replace - today) /
            (1000*60*60*24)
        );

        if(diff === 0){

            todayCount++;

        }

        if(diff >= 0 && diff <= 7){

            weekCount++;

        }

    });

    document.getElementById("todayCount")
    .innerHTML = todayCount + "개";

    document.getElementById("weekCount")
    .innerHTML = weekCount + "개";

}


// ===============================
// 최근 등록
// ===============================

function renderRecent(){

    const recent =
    document.getElementById("recentList");

    recent.innerHTML = "";

    if(items.length === 0){

        recent.innerHTML =
        "아직 등록된 제품이 없습니다.";

        return;

    }

    let lastItems =
    [...items].reverse().slice(0,5);

    lastItems.forEach(function(item){

        let div =
        document.createElement("div");

        div.className = "recentCard";

        div.innerHTML =

        `
        <strong>${item.location}</strong><br>
        설치일 : ${item.install}
        `;

        recent.appendChild(div);

    });

}

// ===============================
// 버튼
// ===============================

document.getElementById("recordBtn").onclick=function(){

    location.href="record.html";

};

document.getElementById("statsBtn").onclick=function(){

    location.href="statistics.html";

};

document.getElementById("settingBtn").onclick=function(){

    alert("설정은 준비중입니다.");

};