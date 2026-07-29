console.log("HomeCare 설치 내역 시작");


const items = JSON.parse(
    localStorage.getItem("homecareItems")
) || [];



let html = `

<table>

<tr>
<th>제품</th>
<th>위치</th>
<th>설치일</th>
<th>교체예정</th>
</tr>

`;



items.forEach(item => {


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

<td>${item.type || "-"}</td>

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