/* ===================================================
   HomeCare - 생필품 관리
=================================================== */

console.log("HomeCare 생필품 JS 시작");


/* ===================================================
   데이터
=================================================== */

let supplies = [];

let editingSupplyId = null;


/* ===================================================
   LocalStorage
=================================================== */

const SUPPLY_STORAGE_KEY =
    "homecareSupplies";


function loadSupplies(){

    const saved =
        localStorage.getItem(SUPPLY_STORAGE_KEY);

    if(saved){

        try{

            supplies = JSON.parse(saved);

        }

        catch(error){

            console.error(
                "생필품 데이터 불러오기 오류:",
                error
            );

            supplies = [];

        }

    }

    else{

        supplies = [];

    }

}


function saveSupplies(){

    localStorage.setItem(
        SUPPLY_STORAGE_KEY,
        JSON.stringify(supplies)
    );

}


/* ===================================================
   DOM
=================================================== */

const supplyList =
    document.getElementById("supplyList");

const supplyTotalCount =
    document.getElementById("supplyTotalCount");

const supplyLowCount =
    document.getElementById("supplyLowCount");

const supplyPopup =
    document.getElementById("supplyPopup");

const supplyPopupTitle =
    document.getElementById("supplyPopupTitle");

const supplyName =
    document.getElementById("supplyName");

const supplyQuantity =
    document.getElementById("supplyQuantity");

const supplyMinQuantity =
    document.getElementById("supplyMinQuantity");

const supplyLocation =
    document.getElementById("supplyLocation");

const supplyMemo =
    document.getElementById("supplyMemo");


/* ===================================================
   상태 계산
=================================================== */

function getSupplyStatus(item){

    const quantity =
        Number(item.quantity);

    const minQuantity =
        Number(item.minQuantity);


    if(quantity === 0){

        return "empty";

    }


    if(quantity <= minQuantity){

        return "warning";

    }


    return "normal";

}


function getSupplyStatusText(item){

    const status =
        getSupplyStatus(item);


    if(status === "empty"){

        return "품절";

    }


    if(status === "warning"){

        return "구매 필요";

    }


    return "충분";

}


/* ===================================================
   목록 표시
=================================================== */

function renderSupplies(){

    if(!supplyList){

        return;

    }


    supplyList.innerHTML = "";


    /* -------------------------------
       요약
    -------------------------------- */

    if(supplyTotalCount){

        supplyTotalCount.innerText =
            supplies.length;

    }


    const lowCount =
        supplies.filter(function(item){

            return getSupplyStatus(item) !== "normal";

        }).length;


    if(supplyLowCount){

        supplyLowCount.innerText =
            lowCount;

    }


    /* -------------------------------
       목록 없음
    -------------------------------- */

    if(supplies.length === 0){

        supplyList.innerHTML = `

            <div class="emptySupply">

                아직 등록된 생필품이 없습니다.<br>

                ＋ 생필품 추가 버튼으로 등록해보세요.

            </div>

        `;

        return;

    }


    /* -------------------------------
       카드 생성
    -------------------------------- */

    supplies.forEach(function(item){

        const status =
            getSupplyStatus(item);

        const statusText =
            getSupplyStatusText(item);


        const card =
            document.createElement("div");

        card.className =
            "supplyCard";


        card.innerHTML = `

            <div class="supplyCardTop">

                <span class="supplyName">
                    ${escapeHTML(item.name)}
                </span>

                <span class="supplyStatus ${status}">
                    ${statusText}
                </span>

            </div>


            <div class="supplyInfo">

                <div>
                    📦 현재 수량 :
                    <strong>
                        ${item.quantity}
                    </strong>
                </div>

                <div>
                    ⚠️ 적정 수량 :
                    <strong>
                        ${item.minQuantity}
                    </strong>
                </div>

                <div>
                    📍 보관 위치 :
                    ${escapeHTML(item.location || "-")}
                </div>

            </div>


            ${
                item.memo
                ?
                `
                <div class="supplyMemo">

                    📝 ${escapeHTML(item.memo)}

                </div>
                `
                :
                ""
            }


            <div class="supplyCardButtons">

                <button
                    class="supplyEditBtn"
                    onclick="editSupply('${item.id}')"
                >
                    수정
                </button>


                <button
                    class="supplyDeleteBtn"
                    onclick="deleteSupply('${item.id}')"
                >
                    삭제
                </button>

            </div>

        `;


        supplyList.appendChild(card);

    });

}


/* ===================================================
   HTML 안전 처리
=================================================== */

function escapeHTML(value){

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ===================================================
   팝업 열기
=================================================== */

function openSupplyPopup(){

    editingSupplyId = null;


    supplyPopupTitle.innerText =
        "생필품 추가";


    supplyName.value = "";

    supplyQuantity.value = 0;

    supplyMinQuantity.value = 1;

    supplyLocation.value = "";

    supplyMemo.value = "";


    supplyPopup.classList.remove("hidden");


    supplyName.focus();

}


/* ===================================================
   팝업 닫기
=================================================== */

function closeSupplyPopup(){

    supplyPopup.classList.add("hidden");

    editingSupplyId = null;

}


/* ===================================================
   생필품 저장
=================================================== */

function saveSupply(){

    const name =
        supplyName.value.trim();


    if(!name){

        alert("제품명을 입력해주세요.");

        supplyName.focus();

        return;

    }


    const quantity =
        Math.max(
            0,
            Number(supplyQuantity.value) || 0
        );


    const minQuantity =
        Math.max(
            0,
            Number(supplyMinQuantity.value) || 0
        );


    const location =
        supplyLocation.value.trim();


    const memo =
        supplyMemo.value.trim();


    /* 수정 */

    if(editingSupplyId){

        const item =
            supplies.find(function(item){

                return item.id === editingSupplyId;

            });


        if(item){

            item.name =
                name;

            item.quantity =
                quantity;

            item.minQuantity =
                minQuantity;

            item.location =
                location;

            item.memo =
                memo;

        }

    }


    /* 신규 */

    else{

        supplies.push({

            id:
                Date.now().toString(),

            name:
                name,

            quantity:
                quantity,

            minQuantity:
                minQuantity,

            location:
                location,

            memo:
                memo

        });

    }


    saveSupplies();

    renderSupplies();

    closeSupplyPopup();

}


/* ===================================================
   수정
=================================================== */

function editSupply(id){

    const item =
        supplies.find(function(item){

            return item.id === id;

        });


    if(!item){

        return;

    }


    editingSupplyId =
        id;


    supplyPopupTitle.innerText =
        "생필품 수정";


    supplyName.value =
        item.name;

    supplyQuantity.value =
        item.quantity;

    supplyMinQuantity.value =
        item.minQuantity;

    supplyLocation.value =
        item.location || "";

    supplyMemo.value =
        item.memo || "";


    supplyPopup.classList.remove("hidden");


    supplyName.focus();

}


/* ===================================================
   삭제
=================================================== */

function deleteSupply(id){

    const item =
        supplies.find(function(item){

            return item.id === id;

        });


    if(!item){

        return;

    }


    const confirmed =
        confirm(
            `"${item.name}"을(를) 삭제할까요?`
        );


    if(!confirmed){

        return;

    }


    supplies =
        supplies.filter(function(item){

            return item.id !== id;

        });


    saveSupplies();

    renderSupplies();

}


/* ===================================================
   이벤트
=================================================== */

document
    .getElementById("addSupplyBtn")
    .addEventListener(
        "click",
        openSupplyPopup
    );


document
    .getElementById("supplySaveBtn")
    .addEventListener(
        "click",
        saveSupply
    );


document
    .getElementById("supplyCancelBtn")
    .addEventListener(
        "click",
        closeSupplyPopup
    );


/* ===================================================
   팝업 바깥 클릭
=================================================== */

supplyPopup.addEventListener(
    "click",
    function(event){

        if(event.target === supplyPopup){

            closeSupplyPopup();

        }

    }
);


/* ===================================================
   뒤로가기
=================================================== */

document
    .getElementById("backHomeBtn")
    .addEventListener(
        "click",
        function(){

            history.back();

        }
    );


/* ===================================================
   시작
=================================================== */

loadSupplies();

renderSupplies();

// ===============================
// HomeCare 로고 → 메인 화면
// ===============================

const homeCareBtn =
document.getElementById("homeCareBtn");

if(homeCareBtn){

    homeCareBtn.addEventListener("click", function(){

        window.location.href = "index.html";

    });

}