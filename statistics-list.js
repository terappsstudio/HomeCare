console.log("HomeCare 설치 내역 시작");


// ===============================
// 데이터 불러오기
// ===============================

const items = JSON.parse(
    localStorage.getItem("installationHistory")
) || [];


let filteredItems = [...items];

let selectedHistorySpace = "전체";

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

filter.onchange=function(){

    selectedHistorySpace =
    this.value;


    applyHistoryFilter();

};

    });


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


let item =
items[index];



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
// 검색
// ===============================

const historySearchInput =
document.getElementById("historySearchInput");



if(historySearchInput){


historySearchInput.addEventListener(
"input",
function(){


let keyword =
this.value.toLowerCase();

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



// ===============================
// 시작
// ===============================

renderHistorySpaceFilter();

renderHistory();