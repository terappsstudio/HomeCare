/* ===================================================
   HomeCare 3.2 - 생필품 관리
=================================================== */

console.log("HomeCare 생필품 JS 시작");


/* ===================================================
   데이터
=================================================== */

let supplies = [];

let editingSupplyId = null;

let selectedSupplyLocation = "전체";


/* ===================================================
   보관 장소
=================================================== */

const STORAGE_LOCATION_KEY =
    "homecareStorageLocations";


const DEFAULT_STORAGE_LOCATIONS = [

    "주방",
    "펜트리",
    "완강기실",
    "세탁실",
    "기타"

];


let storageLocations = [];


/* ===================================================
   LocalStorage
=================================================== */

const SUPPLY_STORAGE_KEY =
    "homecareSupplies";


/* ===================================================
   생필품 불러오기
=================================================== */

function loadSupplies(){

    const saved =
        localStorage.getItem(
            SUPPLY_STORAGE_KEY
        );


    if(!saved){

        supplies = [];

        return;

    }


    try{

        const parsed =
            JSON.parse(saved);


        if(!Array.isArray(parsed)){

            supplies = [];

            return;

        }


        supplies =
            parsed.map(function(item){

                return {

                    id:
                        item.id ||
                        Date.now().toString(),

                    name:
                        item.name || "",

                    spec:
                        item.spec || "",

                    quantity:
                        Math.max(
                            0,
                            Number(item.quantity) || 0
                        ),

                    minQuantity:
                        Math.max(
                            0,
                            Number(item.minQuantity) || 0
                        ),

                    location:
                        item.location || "",

                    memo:
                        item.memo || ""

                };

            });

    }

    catch(error){

        console.error(
            "생필품 데이터 불러오기 오류:",
            error
        );

        supplies = [];

    }

}


/* ===================================================
   생필품 저장
=================================================== */

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
    document.getElementById(
        "supplyList"
    );


const supplyNeedList =
    document.getElementById(
        "supplyNeedList"
    );


const supplyTotalCount =
    document.getElementById(
        "supplyTotalCount"
    );


const supplyLowCount =
    document.getElementById(
        "supplyLowCount"
    );


const supplyNeedCount =
    document.getElementById(
        "supplyNeedCount"
    );


const supplyPopup =
    document.getElementById(
        "supplyPopup"
    );


const supplyPopupTitle =
    document.getElementById(
        "supplyPopupTitle"
    );


const supplyName =
    document.getElementById(
        "supplyName"
    );


const supplySpec =
    document.getElementById(
        "supplySpec"
    );


const supplyQuantity =
    document.getElementById(
        "supplyQuantity"
    );


const supplyMinQuantity =
    document.getElementById(
        "supplyMinQuantity"
    );


const supplyLocation =
    document.getElementById(
        "supplyLocation"
    );


const supplyMemo =
    document.getElementById(
        "supplyMemo"
    );


const settingBtn =
    document.getElementById(
        "settingBtn"
    );


const settingsPopup =
    document.getElementById(
        "settingsPopup"
    );


const settingsCloseBtn =
    document.getElementById(
        "settingsCloseBtn"
    );


const storageSettingsBtn =
    document.getElementById(
        "storageSettingsBtn"
    );


const storageManagePopup =
    document.getElementById(
        "storageManagePopup"
    );


const storageCloseBtn =
    document.getElementById(
        "storageCloseBtn"
    );


const addStorageLocationBtn =
    document.getElementById(
        "addStorageLocationBtn"
    );


const addSupplyBtn =
    document.getElementById(
        "addSupplyBtn"
    );


const supplySaveBtn =
    document.getElementById(
        "supplySaveBtn"
    );


const supplyCancelBtn =
    document.getElementById(
        "supplyCancelBtn"
    );


const backHomeBtn =
    document.getElementById(
        "backHomeBtn"
    );


const homeCareBtn =
    document.getElementById(
        "homeCareBtn"
    );


/* ===================================================
   상태 계산
=================================================== */

function getSupplyStatus(item){

    const quantity =
        Number(item.quantity) || 0;


    const minQuantity =
        Number(item.minQuantity) || 0;


    if(quantity <= 0){

        return "empty";

    }


    if(quantity <= minQuantity){

        return "warning";

    }


    return "normal";

}


/* ===================================================
   상태 텍스트
=================================================== */

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
   구매 필요 여부
=================================================== */

function isSupplyNeed(item){

    return (
        getSupplyStatus(item) !==
        "normal"
    );

}


/* ===================================================
   HTML 안전 처리
=================================================== */

function escapeHTML(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ===================================================
   보관 장소 필터
=================================================== */

function matchesLocation(item){

    if(
        selectedSupplyLocation ===
        "전체"
    ){

        return true;

    }


    const location =
        String(item.location || "")
        .trim();


    return (
        location ===
        selectedSupplyLocation
    );

}


/* ===================================================
   요약 표시
=================================================== */

function renderSupplySummary(){

    if(supplyTotalCount){

        supplyTotalCount.innerText =
            supplies.length;

    }


    const lowCount =
        supplies.filter(function(item){

            return isSupplyNeed(item);

        }).length;


    if(supplyLowCount){

        supplyLowCount.innerText =
            lowCount;

    }


    if(supplyNeedCount){

        const filteredNeedCount =
            supplies.filter(function(item){

                return (
                    isSupplyNeed(item) &&
                    matchesLocation(item)
                );

            }).length;


        supplyNeedCount.innerText =
            filteredNeedCount;

    }

}


/* ===================================================
   구매 필요 목록
=================================================== */

function renderSupplyNeedList(){

    if(!supplyNeedList){

        return;

    }


    supplyNeedList.innerHTML = "";


    const needList =
        supplies.filter(function(item){

            return (
                isSupplyNeed(item) &&
                matchesLocation(item)
            );

        });


    if(needList.length === 0){

        supplyNeedList.innerHTML = `

            <div class="emptyNeedSupply">

                현재 구매가 필요한 생필품이 없습니다.

            </div>

        `;

        return;

    }


    needList.forEach(function(item){

        const status =
            getSupplyStatus(item);


        const statusText =
            getSupplyStatusText(item);


        const div =
            document.createElement("div");


        div.className =
            "supplyNeedItem";


        div.innerHTML = `

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:10px;
                "
            >

                <div style="min-width:0;">

                    <div
                        style="
                            font-size:17px;
                            font-weight:bold;
                            color:#333;
                        "
                    >

                        ${escapeHTML(item.name)}

                    </div>


                    ${
                        item.spec
                        ?
                        `
                        <div
                            style="
                                margin-top:3px;
                                font-size:14px;
                                color:#777;
                            "
                        >

                            ${escapeHTML(item.spec)}

                        </div>
                        `
                        :
                        ""
                    }


                    <div
                        style="
                            margin-top:5px;
                            font-size:14px;
                            color:#666;
                        "
                    >

                        현재 ${item.quantity}개
                        · 기준 ${item.minQuantity}개

                    </div>

                </div>


                <span
                    class="supplyStatus ${status}"
                >

                    ${statusText}

                </span>

            </div>

        `;


        supplyNeedList.appendChild(div);

    });

}


/* ===================================================
   생필품 카드 생성
=================================================== */

function createSupplyCard(item){

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


            <span
                class="supplyStatus ${status}"
            >

                ${statusText}

            </span>

        </div>


        ${
            item.spec
            ?
            `
            <div class="supplySpec">

                📏 ${escapeHTML(item.spec)}

            </div>
            `
            :
            ""
        }


        <div class="supplyInfo">

            <div>

                📦 현재 수량 :

                <strong>
                    ${item.quantity}
                </strong>

            </div>


            <div>

                ⚠️ 구매 기준 :

                <strong>
                    ${item.minQuantity}
                </strong>

            </div>


            <div>

                📍 보관 위치 :

                ${escapeHTML(
                    item.location || "-"
                )}

            </div>


            <div>

                📊 상태 :

                <strong>
                    ${statusText}
                </strong>

            </div>

        </div>


        <div class="supplyQuantityControl">

            <button
                class="supplyQuantityButton"
                onclick="changeSupplyQuantity('${item.id}', -1)"
            >

                −

            </button>


            <span class="supplyQuantityValue">

                현재 수량
                ${item.quantity}

            </span>


            <button
                class="supplyQuantityButton"
                onclick="changeSupplyQuantity('${item.id}', 1)"
            >

                ＋

            </button>

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


    return card;

}


/* ===================================================
   전체 생필품 목록
=================================================== */

function renderSupplies(){

    if(!supplyList){

        return;

    }


    supplyList.innerHTML = "";


    const filteredSupplies =
        supplies.filter(function(item){

            return matchesLocation(item);

        });


    if(filteredSupplies.length === 0){

        supplyList.innerHTML = `

            <div class="emptySupply">

                ${
                    supplies.length === 0
                    ?
                    `
                    아직 등록된 생필품이 없습니다.<br>
                    ＋ 생필품 추가 버튼으로 등록해보세요.
                    `
                    :
                    `
                    선택한 보관 장소에<br>
                    등록된 생필품이 없습니다.
                    `
                }

            </div>

        `;

        return;

    }


    filteredSupplies.forEach(function(item){

        supplyList.appendChild(
            createSupplyCard(item)
        );

    });

}


/* ===================================================
   전체 화면 렌더링
=================================================== */

function renderAll(){

    renderSupplySummary();

    renderSupplyNeedList();

    renderSupplies();

}


/* ===================================================
   빠른 수량 조절
=================================================== */

function changeSupplyQuantity(
    id,
    amount
){

    const item =
        supplies.find(function(item){

            return item.id === id;

        });


    if(!item){

        return;

    }


    const currentQuantity =
        Number(item.quantity) || 0;


    item.quantity =
        Math.max(
            0,
            currentQuantity + amount
        );


    saveSupplies();

    renderAll();

}


/* ===================================================
   생필품 추가 팝업
=================================================== */

function openSupplyPopup(){

    editingSupplyId = null;


    if(supplyPopupTitle){

        supplyPopupTitle.innerText =
            "생필품 추가";

    }


    if(supplyName){

        supplyName.value = "";

    }


    if(supplySpec){

        supplySpec.value = "";

    }


    if(supplyQuantity){

        supplyQuantity.value = 0;

    }


    if(supplyMinQuantity){

        supplyMinQuantity.value = 1;

    }


    renderSupplyLocationSelect();


    if(supplyLocation){

        supplyLocation.value = "";

    }


    if(supplyMemo){

        supplyMemo.value = "";

    }


    if(supplyPopup){

        supplyPopup.classList.remove(
            "hidden"
        );

    }


    if(supplyName){

        supplyName.focus();

    }

}


/* ===================================================
   생필품 팝업 닫기
=================================================== */

function closeSupplyPopup(){

    if(supplyPopup){

        supplyPopup.classList.add(
            "hidden"
        );

    }


    editingSupplyId = null;

}


/* ===================================================
   생필품 저장
=================================================== */

function saveSupply(){

    const name =
        supplyName
        ?
        supplyName.value.trim()
        :
        "";


    if(!name){

        alert(
            "제품명을 입력해주세요."
        );


        if(supplyName){

            supplyName.focus();

        }


        return;

    }


    const spec =
        supplySpec
        ?
        supplySpec.value.trim()
        :
        "";


    const quantity =
        Math.max(
            0,
            Number(
                supplyQuantity
                ?
                supplyQuantity.value
                :
                0
            ) || 0
        );


    const minQuantity =
        Math.max(
            0,
            Number(
                supplyMinQuantity
                ?
                supplyMinQuantity.value
                :
                0
            ) || 0
        );


    const location =
        supplyLocation
        ?
        supplyLocation.value.trim()
        :
        "";


    const memo =
        supplyMemo
        ?
        supplyMemo.value.trim()
        :
        "";


    /* 수정 */

    if(editingSupplyId){

        const item =
            supplies.find(function(item){

                return (
                    item.id ===
                    editingSupplyId
                );

            });


        if(item){

            item.name =
                name;

            item.spec =
                spec;

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

            spec:
                spec,

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

    renderAll();

    closeSupplyPopup();

}


/* ===================================================
   생필품 수정
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


    if(supplyPopupTitle){

        supplyPopupTitle.innerText =
            "생필품 수정";

    }


    if(supplyName){

        supplyName.value =
            item.name || "";

    }


    if(supplySpec){

        supplySpec.value =
            item.spec || "";

    }


    if(supplyQuantity){

        supplyQuantity.value =
            item.quantity || 0;

    }


    if(supplyMinQuantity){

        supplyMinQuantity.value =
            item.minQuantity || 0;

    }


    renderSupplyLocationSelect();


    if(supplyLocation){

        supplyLocation.value =
            item.location || "";

    }


    if(supplyMemo){

        supplyMemo.value =
            item.memo || "";

    }


    if(supplyPopup){

        supplyPopup.classList.remove(
            "hidden"
        );

    }


    if(supplyName){

        supplyName.focus();

    }

}


/* ===================================================
   생필품 삭제
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

    renderAll();

}


/* ===================================================
   보관 장소 불러오기
=================================================== */

function loadStorageLocations(){

    const saved =
        localStorage.getItem(
            STORAGE_LOCATION_KEY
        );


    if(!saved){

        storageLocations =
            [...DEFAULT_STORAGE_LOCATIONS];

        saveStorageLocations();

        return;

    }


    try{

        const parsed =
            JSON.parse(saved);


        if(Array.isArray(parsed)){

            storageLocations =
                parsed;

        }

        else{

            storageLocations =
                [...DEFAULT_STORAGE_LOCATIONS];

        }

    }

    catch(error){

        console.error(
            "보관 장소 불러오기 오류:",
            error
        );

        storageLocations =
            [...DEFAULT_STORAGE_LOCATIONS];

    }


    if(storageLocations.length === 0){

        storageLocations =
            [...DEFAULT_STORAGE_LOCATIONS];

        saveStorageLocations();

    }

}


/* ===================================================
   보관 장소 저장
=================================================== */

function saveStorageLocations(){

    localStorage.setItem(
        STORAGE_LOCATION_KEY,
        JSON.stringify(storageLocations)
    );

}


/* ===================================================
   보관 장소 버튼 생성
=================================================== */

function renderStorageLocationButtons(){

    const container =
        document.getElementById(
            "supplyLocationButtons"
        );


    if(!container){

        return;

    }


    container.innerHTML = "";


    /* 전체 */

    const allButton =
        document.createElement("button");


    allButton.className =
        "locationButton";


    allButton.dataset.location =
        "전체";


    allButton.innerText =
        "전체";


    if(
        selectedSupplyLocation ===
        "전체"
    ){

        allButton.classList.add(
            "active"
        );

    }


    allButton.addEventListener(
        "click",
        function(){

            selectedSupplyLocation =
                "전체";


            renderStorageLocationButtons();

            renderAll();

        }
    );


    container.appendChild(
        allButton
    );


    /* 보관 장소 */

    storageLocations.forEach(
        function(location){

            const button =
                document.createElement("button");


            button.className =
                "locationButton";


            button.dataset.location =
                location;


            button.innerText =
                location;


            if(
                selectedSupplyLocation ===
                location
            ){

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                function(){

                    selectedSupplyLocation =
                        location;


                    renderStorageLocationButtons();

                    renderAll();

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* ===================================================
   보관 장소 관리 목록
=================================================== */

function renderStorageManageList(){

    const list =
        document.getElementById(
            "storageManageList"
        );


    if(!list){

        return;

    }


    list.innerHTML = "";


    if(storageLocations.length === 0){

        list.innerHTML = `

            <div class="emptyNeedSupply">

                등록된 보관 장소가 없습니다.

            </div>

        `;

        return;

    }


    storageLocations.forEach(
        function(location, index){

            const item =
                document.createElement("div");


            item.className =
                "storageManageItem";


            item.innerHTML = `

                <span class="storageManageName">

                    📍 ${escapeHTML(location)}

                </span>


                <button
                    class="storageDeleteBtn"
                    data-index="${index}"
                >

                    삭제

                </button>

            `;


            const deleteButton =
                item.querySelector(
                    ".storageDeleteBtn"
                );


            if(deleteButton){

                deleteButton.addEventListener(
                    "click",
                    function(){

                        deleteStorageLocation(
                            index
                        );

                    }
                );

            }


            list.appendChild(item);

        }
    );

}


/* ===================================================
   보관 장소 추가
=================================================== */

function addStorageLocation(){

    const name =
        prompt(
            "추가할 보관 장소 이름을 입력해주세요."
        );


    if(name === null){

        return;

    }


    const location =
        name.trim();


    if(!location){

        alert(
            "보관 장소 이름을 입력해주세요."
        );

        return;

    }


    if(
        storageLocations.includes(
            location
        )
    ){

        alert(
            "이미 등록된 보관 장소입니다."
        );

        return;

    }


    storageLocations.push(
        location
    );


    saveStorageLocations();

    renderStorageLocationButtons();

    renderStorageManageList();

    renderSupplyLocationSelect();

}


/* ===================================================
   보관 장소 삭제
=================================================== */

function deleteStorageLocation(index){

    const location =
        storageLocations[index];


    if(!location){

        return;

    }


    const usedCount =
        supplies.filter(
            function(item){

                return (
                    String(
                        item.location || ""
                    ).trim() ===
                    location
                );

            }
        ).length;


    let message =
        `"${location}" 보관 장소를 삭제할까요?`;


    if(usedCount > 0){

        message +=
            `\n\n현재 ${usedCount}개의 생필품이 이 장소를 사용하고 있습니다.` +
            `\n삭제해도 생필품 자체는 삭제되지 않습니다.`;

    }


    if(!confirm(message)){

        return;

    }


    storageLocations.splice(
        index,
        1
    );


    saveStorageLocations();


    /* 해당 장소를 사용하던 생필품의 위치 비우기 */

    supplies.forEach(
        function(item){

            if(
                String(
                    item.location || ""
                ).trim() ===
                location
            ){

                item.location = "";

            }

        }
    );


    saveSupplies();


    if(
        selectedSupplyLocation ===
        location
    ){

        selectedSupplyLocation =
            "전체";

    }


    renderStorageLocationButtons();

    renderStorageManageList();

    renderSupplyLocationSelect();

    renderAll();

}


/* ===================================================
   생필품 보관 위치 선택창
=================================================== */

function renderSupplyLocationSelect(){

    if(!supplyLocation){

        return;

    }


    const currentValue =
        supplyLocation.value;


    supplyLocation.innerHTML = `

        <option value="">
            선택 안 함
        </option>

    `;


    storageLocations.forEach(
        function(location){

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                location;


            option.innerText =
                location;


            supplyLocation.appendChild(
                option
            );

        }
    );


    if(
        storageLocations.includes(
            currentValue
        )
    ){

        supplyLocation.value =
            currentValue;

    }

}


/* ===================================================
   설정 팝업 열기
=================================================== */

function openSettingsPopup(){

    if(settingsPopup){

        settingsPopup.classList.remove(
            "hidden"
        );

    }

}


/* ===================================================
   설정 팝업 닫기
=================================================== */

function closeSettingsPopup(){

    if(settingsPopup){

        settingsPopup.classList.add(
            "hidden"
        );

    }

}


/* ===================================================
   보관 장소 관리 팝업 열기
=================================================== */

function openStorageManagePopup(){

    closeSettingsPopup();

    renderStorageManageList();


    if(storageManagePopup){

        storageManagePopup.classList.remove(
            "hidden"
        );

    }

}


/* ===================================================
   보관 장소 관리 팝업 닫기
=================================================== */

function closeStorageManagePopup(){

    if(storageManagePopup){

        storageManagePopup.classList.add(
            "hidden"
        );

    }

}


/* ===================================================
   설정 버튼
=================================================== */

if(settingBtn){

    settingBtn.addEventListener(
        "click",
        openSettingsPopup
    );

}


/* ===================================================
   설정 닫기 버튼
=================================================== */

if(settingsCloseBtn){

    settingsCloseBtn.addEventListener(
        "click",
        closeSettingsPopup
    );

}


/* ===================================================
   보관 장소 관리 버튼
=================================================== */

if(storageSettingsBtn){

    storageSettingsBtn.addEventListener(
        "click",
        openStorageManagePopup
    );

}


/* ===================================================
   보관 장소 관리 닫기
=================================================== */

if(storageCloseBtn){

    storageCloseBtn.addEventListener(
        "click",
        closeStorageManagePopup
    );

}


/* ===================================================
   보관 장소 추가 버튼
=================================================== */

if(addStorageLocationBtn){

    addStorageLocationBtn.addEventListener(
        "click",
        addStorageLocation
    );

}


/* ===================================================
   생필품 추가 버튼
=================================================== */

if(addSupplyBtn){

    addSupplyBtn.addEventListener(
        "click",
        openSupplyPopup
    );

}


/* ===================================================
   생필품 저장 버튼
=================================================== */

if(supplySaveBtn){

    supplySaveBtn.addEventListener(
        "click",
        saveSupply
    );

}


/* ===================================================
   생필품 취소 버튼
=================================================== */

if(supplyCancelBtn){

    supplyCancelBtn.addEventListener(
        "click",
        closeSupplyPopup
    );

}


/* ===================================================
   생필품 팝업 바깥 클릭
=================================================== */

if(supplyPopup){

    supplyPopup.addEventListener(
        "click",
        function(event){

            if(
                event.target ===
                supplyPopup
            ){

                closeSupplyPopup();

            }

        }
    );

}


/* ===================================================
   설정 팝업 바깥 클릭
=================================================== */

if(settingsPopup){

    settingsPopup.addEventListener(
        "click",
        function(event){

            if(
                event.target ===
                settingsPopup
            ){

                closeSettingsPopup();

            }

        }
    );

}


/* ===================================================
   보관 장소 관리 팝업 바깥 클릭
=================================================== */

if(storageManagePopup){

    storageManagePopup.addEventListener(
        "click",
        function(event){

            if(
                event.target ===
                storageManagePopup
            ){

                closeStorageManagePopup();

            }

        }
    );

}


/* ===================================================
   ESC 팝업 닫기
=================================================== */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key !== "Escape"){

            return;

        }


        if(
            supplyPopup &&
            !supplyPopup.classList.contains(
                "hidden"
            )
        ){

            closeSupplyPopup();

            return;

        }


        if(
            storageManagePopup &&
            !storageManagePopup.classList.contains(
                "hidden"
            )
        ){

            closeStorageManagePopup();

            return;

        }


        if(
            settingsPopup &&
            !settingsPopup.classList.contains(
                "hidden"
            )
        ){

            closeSettingsPopup();

        }

    }
);


/* ===================================================
   뒤로가기
=================================================== */

if(backHomeBtn){

    backHomeBtn.addEventListener(
        "click",
        function(){

            history.back();

        }
    );

}


/* ===================================================
   HomeCare 로고
=================================================== */

if(homeCareBtn){

    homeCareBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "index.html";

        }
    );

}


/* ===================================================
   시작
=================================================== */

loadSupplies();

loadStorageLocations();

renderStorageLocationButtons();

renderSupplyLocationSelect();

renderAll();


console.log(
    "HomeCare 생필품 초기화 완료"
);