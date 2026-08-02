console.log("HomeCare 설치 내역 시작");


const items = JSON.parse(
    localStorage.getItem("installationHistory")
) || [];

const markerSettings = JSON.parse(
    localStorage.getItem("homecareMarkers")
) || [];

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



items.forEach(item => {

    let productMap = {

    deodorizer: "🌿 방향제",
    deodorizer2: "🧸 탈취제",
    dehumidifier: "💧 제습제",
    etc: "📦 기타"

};

let productName = productMap[item.type];


// 커스텀 마커 이름 찾기

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

let replaceDate = "";


if(item.install && item.cycle){

    let date = new Date(item.install);

    date.setDate(
        date.getDate() + Number(item.cycle)
    );

    replaceDate = date.toISOString().split("T")[0];

}


html += `

<tr>

<td>${item.space || "-"}</td>

<td>${productName}</td>

<td>
${item.location || "-"}
${item.detail ? `<br>🔎 ${item.detail}` : ""}
</td>

<td>${item.install || "-"}</td>

<td>${replaceDate || "-"}</td>

</tr>

`;

});


html += "</table>";



document.getElementById("historyTable").innerHTML = html;



// 홈 이동

const homeBtn = document.getElementById("homeBtn");


if(homeBtn){

    homeBtn.onclick=function(){

        location.href="index.html";

    };

}



// 뒤로가기

const backBtn = document.getElementById("backBtn");


if(backBtn){

    backBtn.onclick=function(){

        location.href="statistics.html";

    };

}