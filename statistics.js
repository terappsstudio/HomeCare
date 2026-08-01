console.log("HomeCare 통계 시작");

// ===============================
// 공간 데이터
// ===============================

const spaces = JSON.parse(
    localStorage.getItem("homecareSpaces")
) || [];


let selectedStatisticsSpace = "전체";



// ===============================
// 통계 대상 데이터 가져오기
// ===============================

function getStatisticsItems(){

    let allItems = [];


    spaces.forEach(function(space){

        console.log(
            "공간 확인:",
            space.name,
            space.markers.length
        );


        space.markers.forEach(function(marker){

            allItems.push({

                ...marker,

                space: space.name

            });

        });

    });



    console.log(
        "전체 통계 데이터:",
        allItems
    );



    // 전체 선택

    if(selectedStatisticsSpace === "전체"){

        return allItems;

    }



    // 선택 공간 필터

    return allItems.filter(function(item){

        return item.space === selectedStatisticsSpace;

    });

}

// ===============================
// 저장된 설치 데이터 가져오기
// ===============================

const items = JSON.parse(
    localStorage.getItem("homecareItems")
) || [];

// ===============================
// 설치내역 가져오기 (영구 기록)
// ===============================

const installationHistory = JSON.parse(
    localStorage.getItem("installationHistory")
) || [];

// ===============================
// 통계 화면 갱신
// ===============================

function updateStatistics(){


    const statisticsItems = getStatisticsItems();



    // ===============================
    // 전체 설치 개수
    // ===============================

    const totalCount = document.getElementById("totalCount");

    if(totalCount){

        totalCount.innerHTML =
        `
        <div class="statNumber">
            ${statisticsItems.length}
        </div>

        <div class="statUnit">
            개
        </div>

        <p>
        현재 등록된 전체 제품
        </p>
        `;

    }



    // ===============================
    // 제품별 통계
    // ===============================

    let productCount = {};


    statisticsItems.forEach(item => {

        let productName =
        item.type || "미등록 제품";


        if(!productCount[productName]){

            productCount[productName] = 0;

        }


        productCount[productName]++;

    });



    let productHTML = "";


    for(let product in productCount){

        productHTML +=
        `
        <div>
            ${product} : ${productCount[product]}개
        </div>
        `;

    }


    const productStats =
    document.getElementById("productStats");


    if(productStats){

        productStats.innerHTML =
        productHTML || "<p>등록된 제품이 없습니다.</p>";

    }




    // ===============================
    // 장소별 통계
    // ===============================

    let locationCount = {};


    statisticsItems.forEach(item => {

        let place =
        item.location || "미등록 장소";


        if(!locationCount[place]){

            locationCount[place] = 0;

        }


        locationCount[place]++;

    });



    let locationHTML = "";


    for(let place in locationCount){

        locationHTML +=
        `
        <div>
            ${place} : ${locationCount[place]}개
        </div>
        `;

    }



    const locationStats =
    document.getElementById("locationStats");


    if(locationStats){

        locationStats.innerHTML =
        locationHTML || "<p>등록된 장소가 없습니다.</p>";

    }




    // ===============================
    // 교체 예정 계산
    // ===============================

    let today = new Date();

    let replaceCount = 0;


    statisticsItems.forEach(item => {


        if(!item.install || !item.cycle){

            return;

        }


        let installDate =
        new Date(item.install);


        let replaceDate =
        new Date(installDate);


        replaceDate.setDate(
            replaceDate.getDate() + Number(item.cycle)
        );


        if(replaceDate <= today){

            replaceCount++;

        }


    });



    const replaceStats =
    document.getElementById("replaceStats");


    if(replaceStats){

        replaceStats.innerHTML =
        `
        <h2>${replaceCount}개</h2>
        <p>교체 시기가 지난 제품</p>
        `;

    }


}

// ===============================
// 제품별 통계
// ===============================

let productCount = {};


getStatisticsItems().forEach(item => {

    let productName = item.type || "미등록 제품";

    if(!productCount[productName]){

        productCount[productName] = 0;

    }

    productCount[productName]++;

});



let productHTML = "";


if(Object.keys(productCount).length === 0){

    productHTML = "<p>등록된 제품이 없습니다.</p>";

}
else{

    for(let product in productCount){

        productHTML +=
        `
        <div>
            ${product} : ${productCount[product]}개
        </div>
        `;

    }

}



const productStats = document.getElementById("productStats");

if(productStats){

    productStats.innerHTML = productHTML;

}



// ===============================
// 장소별 통계
// ===============================

let locationCount = {};


getStatisticsItems().forEach(item => {

    let place = item.location || "미등록 장소";

    if(!locationCount[place]){

        locationCount[place] = 0;

    }

    locationCount[place]++;

});



let locationHTML = "";


if(Object.keys(locationCount).length === 0){

    locationHTML = "<p>등록된 장소가 없습니다.</p>";

}
else{

    for(let place in locationCount){

        locationHTML +=
        `
        <div>
            ${place} : ${locationCount[place]}개
        </div>
        `;

    }

}



const locationStats = document.getElementById("locationStats");

if(locationStats){

    locationStats.innerHTML = locationHTML;

}



// ===============================
// 교체 예정 계산
// ===============================

let today = new Date();

let replaceCount = 0;


getStatisticsItems().forEach(item => {


    if(!item.install || !item.cycle){

        return;

    }


    let installDate = new Date(item.install);


    let replaceDate = new Date(installDate);


    replaceDate.setDate(
        replaceDate.getDate() + Number(item.cycle)
    );


    if(replaceDate <= today){

        replaceCount++;

    }


});



const replaceStats = document.getElementById("replaceStats");


if(replaceStats){

    replaceStats.innerHTML =
    `
    <h2>${replaceCount}개</h2>
    <p>교체 시기가 지난 제품</p>
    `;

}



// ===============================
// 통계 페이지 버튼 이동
// ===============================

const homeBtn = document.getElementById("homeBtn");


if(homeBtn){

    homeBtn.onclick = function(){

        location.href = "index.html";

    };

}



const backBtn = document.getElementById("backBtn");


if(backBtn){

    backBtn.onclick = function(){

        location.href = "index.html";

    };

}



const historyBtn = document.getElementById("historyBtn");

if(historyBtn){

    historyBtn.onclick = function(){

        location.href = "statistics-list.html";

    };

}

// ===============================
// 통계 공간 선택 버튼
// ===============================

function renderStatisticsSpaces(){

    const list =
    document.getElementById("statisticsSpaceList");


    if(!list){
        return;
    }


    list.innerHTML = "";

    let totalBtn =
    document.createElement("button");

    totalBtn.className = "spaceButton";

    totalBtn.innerText = "🌍 전체";

    totalBtn.onclick = function(){

    selectedStatisticsSpace = "전체";

    console.log(
        "통계 선택:",
        selectedStatisticsSpace
    );

    updateStatistics();

};

    list.appendChild(totalBtn);

    spaces.forEach(function(space){

        let button =
        document.createElement("button");


        button.className = "spaceButton";


        button.innerText =
        (space.icon || "🏠") + " " + space.name;


        button.onclick = function(){

            selectedStatisticsSpace =
            space.name;


            console.log(
                "통계 선택:",
                selectedStatisticsSpace
            );


    console.log(
        getStatisticsItems()
    );

    updateStatistics();

        };


        list.appendChild(button);

    });

}

// ===============================
// HomeCare 3.1 빠른 이동
// ===============================

const quickCards = document.querySelectorAll(".quickCard");

quickCards.forEach(card => {

    card.addEventListener("click", function(){

        const targetId = this.dataset.target;

        const target = document.getElementById(targetId);

        if(!target) return;

        target.scrollIntoView({

            behavior:"smooth",
            block:"start"

        });

        target.classList.add("highlightSection");

        setTimeout(function(){

            target.classList.remove("highlightSection");

        },600);

    });

});


// ===============================
// 맨 위 버튼
// ===============================

const topButton = document.getElementById("topButton");


window.addEventListener("scroll", function(){

    if(window.scrollY > 300){

        topButton.style.display = "flex";

        topButton.style.alignItems = "center";

        topButton.style.justifyContent = "center";

    }

    else{

        topButton.style.display = "none";

    }

});


topButton.addEventListener("click", function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ===============================
// 통계 공간 버튼 실행
// ===============================

updateStatistics();

renderStatisticsSpaces();