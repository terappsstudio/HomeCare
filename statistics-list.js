console.log("HomeCare 설치 내역 시작");


// ===============================
// 데이터 불러오기
// ===============================

const items = JSON.parse(
    localStorage.getItem("installationHistory")
) || [];


let filteredItems = [...items];

let selectedHistorySpace = "전체";

let selectedHistoryIndex = null;

items.sort(function(a,b){

    return new Date(b.install) - new Date(a.install);

});


const markerSettings = JSON.parse(
    localStorage.getItem("homecareMarkers")
) || [];


// ===============================
// 공간 선택 목록
// ===============================

function renderHistorySpaceFilter(){

    const filter =
    document.getElementById("historySpaceFilter");


    if(!filter){
        return;
    }


    const spaces =
    JSON.parse(
        localStorage.getItem("homecareSpaces")
    ) || [];

spaces.forEach(function(space){

    let option =
    document.createElement("option");

    option.value =
    space.name;

    option.innerText =
    (space.icon || "🏠")
    + " "
    + space.name;

    filter.appendChild(option);

});

filter.onchange = function(){

    selectedHistorySpace =
    this.value;

    applyHistoryFilter();

};

}

// ===============================
// 설치내역 필터 적용
// ===============================

function applyHistoryFilter(){


    const keyword =
    document.getElementById("historySearchInput")?.value
    .toLowerCase() || "";



    filteredItems =
    items.filter(function(item){


        let matchSpace =
        selectedHistorySpace === "전체" ||
        item.space === selectedHistorySpace;



        let matchKeyword =

        (item.space || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.location || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.detail || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.type || "")
        .toLowerCase()
        .includes(keyword)

        ||

        getProductName(item)
        .toLowerCase()
        .includes(keyword);



        return matchSpace && matchKeyword;


    });



    // ===============================
    // 정렬
    // ===============================

    const sortType =
    document.getElementById("historySort")?.value || "latest";



    if(sortType === "latest"){

        filteredItems.sort(function(a,b){

            return new Date(b.install) - new Date(a.install);

        });

    }


    else if(sortType === "oldest"){

        filteredItems.sort(function(a,b){

            return new Date(a.install) - new Date(b.install);

        });

    }


    else if(sortType === "replace"){

        filteredItems.sort(function(a,b){

            let dateA = new Date(a.install);

            dateA.setDate(
                dateA.getDate() + Number(a.cycle || 0)
            );


            let dateB = new Date(b.install);

            dateB.setDate(
                dateB.getDate() + Number(b.cycle || 0)
            );


            return dateA - dateB;

        });

    }


    else if(sortType === "product"){

        filteredItems.sort(function(a,b){

            return getProductName(a)
            .localeCompare(
                getProductName(b)
            );

        });

    }



    renderHistory();

}

// ===============================
// 제품명 변환
// ===============================

function getProductName(item){


    let productMap = {

        deodorizer:"🌿 방향제",
        deodorizer2:"🧸 탈취제",
        dehumidifier:"💧 제습제",
        etc:"📦 기타"

    };


    let productName =
    productMap[item.type];


    if(!productName){

        let customMarker =
        markerSettings.find(function(marker){

            return marker.type === item.type;

        });


        productName =
        customMarker ?
        customMarker.icon + " " + customMarker.name :
        item.name || item.type || "미등록 제품";

    }


    return productName;

}




// ===============================
// 설치 기록 출력
// ===============================

function renderHistory(){


let html = `

<table>

<tr>

<th>공간</th>
<th>제품</th>
<th>위치</th>
<th>설치일</th>
<th>교체예정</th>

</tr>

`;



filteredItems.forEach(function(item){


let replaceDate = "-";


if(item.install && item.cycle){


    let date = new Date(item.install);


    date.setDate(
        date.getDate() + Number(item.cycle)
    );


    replaceDate =
    date.toISOString().split("T")[0];

}



html +=

`

<tr
class="historyRow"
data-index="${items.indexOf(item)}"
>


<td>
${item.space || "-"}
</td>


<td>
${getProductName(item)}
</td>


<td>
${item.location || "-"}
${item.detail ? `<br>🔎 ${item.detail}` : ""}
</td>


<td>
${item.install || "-"}
</td>


<td>
${replaceDate}
</td>


</tr>

`;



});


html += "</table>";



document.getElementById(
    "historyTable"
).innerHTML = html;



bindHistoryClick();


}

// ===============================
// 상세 팝업 연결
// ===============================

function bindHistoryClick(){


const historyRows =
document.querySelectorAll(".historyRow");



historyRows.forEach(function(row){


row.onclick=function(){


let index =
this.dataset.index;

selectedHistoryIndex = Number(index);

let item =
items[index];


// 선택한 기록 저장

selectedHistory = index;



let replaceDate="-";



if(item.install && item.cycle){


let date =
new Date(item.install);


date.setDate(
date.getDate()+Number(item.cycle)
);


replaceDate =
date.toISOString().split("T")[0];

}



document.getElementById(
"historyDetailContent"
).innerHTML =


`

<div>
🏠 공간 : ${item.space || "-"}
</div>


<div>
📦 제품 : ${getProductName(item)}
</div>


<div>
📍 위치 : ${item.location || "-"}
</div>


<div>
📅 설치일 : ${item.install || "-"}
</div>


<div>
🔄 교체주기 : ${item.cycle || "-"}일
</div>


<div>
⏰ 교체예정 : ${replaceDate}
</div>


<div>
📝 메모 : ${item.detail || "-"}
</div>

`;



document.getElementById(
"historyDetailPopup"
).classList.remove("hidden");



};


});


}



// ===============================
// 삭제 버튼
// ===============================

const historyDeleteBtn =
document.getElementById("historyDeleteBtn");


if(historyDeleteBtn){


historyDeleteBtn.onclick=function(){


if(selectedHistory === null){

    return;

}



if(confirm("이 설치 기록을 삭제할까요?")){


    items.splice(
        selectedHistory,
        1
    );



    localStorage.setItem(
        "installationHistory",
        JSON.stringify(items)
    );



    filteredItems = [...items];



    document.getElementById(
    "historyDetailPopup"
    ).classList.add("hidden");



    renderHistory();



    selectedHistory = null;


}


};


}


// ===============================
// 검색
// ===============================

const historySearchInput =
document.getElementById("historySearchInput");



if(historySearchInput){


historySearchInput.addEventListener(
"input",
function(){


applyHistoryFilter();


}

);


}

// ===============================
// 팝업 닫기
// ===============================

const closeBtn =
document.getElementById(
"historyDetailClose"
);


if(closeBtn){


closeBtn.onclick=function(){


document.getElementById(
"historyDetailPopup"
).classList.add("hidden");

};

}

// ===============================
// 버튼 이동
// ===============================


const homeBtn =
document.getElementById("homeBtn");


if(homeBtn){

homeBtn.onclick=function(){

location.href="index.html";

};

}

const backBtn =
document.getElementById("backBtn");


if(backBtn){

backBtn.onclick=function(){

location.href="statistics.html";

};

}

const historyEditBtn =
document.getElementById("historyEditBtn");


if(historyEditBtn){

    historyEditBtn.onclick = function(){

        localStorage.setItem(
            "editHistoryIndex",
            selectedHistoryIndex
        );


        location.href = "record.html";

    };

}

// ===============================
// 시작
// ===============================

renderHistorySpaceFilter();



// ===============================
// 정렬 변경
// ===============================

const historySort =
document.getElementById("historySort");


if(historySort){

    historySort.onchange = function(){

        applyHistoryFilter();

    };

}


applyHistoryFilter();

// ===============================
// 설치내역 맨 위로 이동
// ===============================

const historyTopButton =
document.getElementById("historyTopButton");


historyTopButton.onclick = function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

// ===============================
// 스크롤 시 맨 위로 버튼 표시
// ===============================

window.addEventListener("scroll", function(){

    if(window.scrollY > 0){

        historyTopButton.classList.add("show");

    }else{

        historyTopButton.classList.remove("show");

    }

});