console.log("HomeCare JS 시작");

let items = JSON.parse(localStorage.getItem("homecareItems")) || [];

let installationHistory = JSON.parse(
    localStorage.getItem("installationHistory")
) || [];

let spaces = JSON.parse(
    localStorage.getItem("homecareSpaces")
) || [
    {
        name:"우리집",
        image:"",
        markers:[]
    }
];

console.log(
    "초기 spaces:",
    spaces
);

let currentSpace =
localStorage.getItem("currentSpace") || "우리집";

// 기존 items를 우리집 markers로 한번 이동
if(items.length > 0){

    let homeSpace = spaces.find(function(space){

        return space.name === "우리집";

    });


    if(homeSpace && homeSpace.markers.length === 0){

        homeSpace.markers = items;

        localStorage.setItem(
            "homecareSpaces",
            JSON.stringify(spaces)
        );

        console.log(
            "기존 마커를 우리집으로 이동 완료"
        );

    }

}

// ===============================
// 공간 목록 표시
// ===============================

function renderSpaces(){

    let list =
    document.getElementById("spaceList");

    if(!list){
        return;
    }

    list.innerHTML = "";

    spaces.forEach(function(space){

        let button =
        document.createElement("button");

        button.className = "spaceButton";

        button.innerText =
        (space.icon || "🏠") + " " + space.name;

        button.onclick = function(){

            currentSpace = space.name;

            localStorage.setItem(
                "currentSpace",
                currentSpace
            );

            console.log(
                "현재 공간:",
                currentSpace
            );

            loadSpace(currentSpace);

        };

        list.appendChild(button);

    });

}

// ===============================
// 공간 관리 목록 표시
// ===============================

function renderSpaceManageList(){

    let manageList =
document.getElementById("spaceManageList");


  if(!manageList){
    return;
}


manageList.innerHTML="";


    spaces.forEach(function(space){

        let div =
        document.createElement("div");

// 공간 이름

let name =
document.createElement("button");

name.className = "spaceButton";

name.innerText =
(space.icon || "🏠") + " " + space.name;


name.onclick = function(){

    openSpaceDetail(space);

};

div.appendChild(name);

manageList.appendChild(div);

    });


}

// ===============================
// 공간 상세 관리 열기
// ===============================

let selectedManageSpace = null;


function openSpaceDetail(space){

    selectedManageSpace = space;


    document.getElementById("floorManagePopup")
    .classList.add("hidden");


    document.getElementById("spaceDetailPopup")
    .classList.remove("hidden");


    document.getElementById("spaceDetailTitle")
    .innerText =
    "🏠 " + space.name + " 관리";

}

// ===============================
// 도면 변경 버튼
// ===============================

document.getElementById("spaceImageChangeBtn").onclick = function(){

    if(!selectedManageSpace){
        return;
    }


    document.getElementById("spaceImageChangeInput")
    .click();

};

// ===============================
// 도면 변경 이미지 선택
// ===============================

document.getElementById("spaceImageChangeInput").onchange = function(e){

    let file = e.target.files[0];


    if(!file){
        return;
    }


    let reader = new FileReader();


    reader.onload = function(event){

        let imageData = event.target.result;


        selectedManageSpace.image = imageData;


        localStorage.setItem(
            "homecareSpaces",
            JSON.stringify(spaces)
        );


        alert("도면이 변경되었습니다.");


        loadSpace(selectedManageSpace.name);


        // 선택 초기화
        e.target.value = "";

    };


    reader.readAsDataURL(file);

};

// ===============================
// 도면 삭제
// ===============================

document.getElementById("spaceImageDeleteBtn").onclick = function(){

    if(!selectedManageSpace){
        return;
    }


    if(!confirm("도면을 삭제할까요?\n(마커 위치는 유지됩니다.)")){
        return;
    }


    selectedManageSpace.image = "";


    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );


    loadSpace(selectedManageSpace.name);


    alert("도면이 삭제되었습니다.");

};

// ===============================
// 공간 삭제
// ===============================

document.getElementById("spaceDeleteBtn").onclick = function(){

    if(!selectedManageSpace){
        return;
    }
    
if(spaces.length <= 1){
    alert("최소 1개의 공간은 있어야 합니다.");
    return;
}

    let check = confirm(
        "공간을 삭제하시겠습니까?\n\n" +
        "도면과 이 공간의 모든 기록이 사라집니다."
    );


    if(!check){
        return;
    }


    let index = spaces.indexOf(selectedManageSpace);


    if(index !== -1){

        spaces.splice(index,1);

    }


    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );


    renderSpaces();

    renderSpaceManageList();


    document.getElementById("spaceDetailPopup")
    .classList.add("hidden");


    document.getElementById("floorManagePopup")
    .classList.remove("hidden");


    selectedManageSpace = null;


    alert("공간이 삭제되었습니다.");

};

// ===============================
// 공간 이름 변경
// ===============================

document.getElementById("spaceNameChangeBtn").onclick = function(){

    console.log("이름 변경 버튼 클릭");


    if(!selectedManageSpace){
        return;
    }


    let oldName = selectedManageSpace.name;


    let newName = prompt(
        "새 공간 이름을 입력하세요",
        oldName
    );

    console.log("입력 결과:", newName);


    if(!newName){

    document.getElementById("spaceDetailPopup")
    .classList.add("hidden");

    document.getElementById("floorManagePopup")
    .classList.remove("hidden");

    return;

}
    selectedManageSpace.name = newName;

    console.log("변경 후 spaces:", spaces);

    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );

    renderSpaceManageList();

    renderSpaces();

    console.log("공간목록 다시 그림");

    if(currentSpace === oldName){

        currentSpace = newName;

        localStorage.setItem(
            "currentSpace",
            currentSpace
        );

        loadSpace(newName);

    }


    alert("공간 이름이 변경되었습니다.");

};

// ===============================
// 공간 상세 관리 닫기
// ===============================

document.getElementById("spaceDetailCloseBtn").onclick = function(){

    document.getElementById("spaceDetailPopup")
    .classList.add("hidden");


    document.getElementById("floorManagePopup")
    .classList.remove("hidden");

};

// ===============================
// 공간 불러오기
// ===============================

function loadSpace(name){

    let space = spaces.find(function(item){

        return item.name === name;

    });


    if(!space){
        return;
    }


  let currentSpaceTitle =
document.querySelector(".current-space");

if(currentSpaceTitle){

    currentSpaceTitle.innerText =
    "🏠 " + space.name;

}

let floorImage =
document.getElementById("floorImage");

let uploadPlaceholder =
document.getElementById("uploadPlaceholder");


if(space.image){

    floorImage.src = space.image;

        floorImage.style.display = "block";


    uploadPlaceholder.style.display = "none";


    console.log(
        "도면 변경:",
        space.name,
        floorImage.src.substring(0,50)
    );


}else{

floorImage.removeAttribute("src");

    floorImage.style.display = "none";

    uploadPlaceholder.style.display = "block";


    console.log(
        "도면 없음:",
        space.name
    );

}
    console.log(
        "불러온 공간:",
        space
    );

    console.log(
    "버튼 상태:",
    uploadPlaceholder.style.display
);

        render();

    console.log(
        "loadSpace 최종 floorImage:",
        document.getElementById("floorImage").src
    );


}


// ===============================
// 교체 완료 제품 자동 처리
// ===============================

function removeExpiredItems(){

    const today = new Date();
    today.setHours(0,0,0,0);

    const remainItems = [];

    items.forEach(function(item){

        const replaceDate = new Date(getReplace(item));

        replaceDate.setHours(0,0,0,0);

        const expiredDays = Math.floor(
            (today - replaceDate) /
            (1000 * 60 * 60 * 24)
        );


        // 교체 후 7일까지는 유지
        if(expiredDays <= 7){

            remainItems.push(item);

        }

    });


    items = remainItems;

    save();

}

// ===============================
// 마커 설정 (v3.0)
// ===============================

let markerSettings = JSON.parse(
    localStorage.getItem("homecareMarkers")
) || [
    {
        type:"deodorizer",
        icon:"🌿",
        name:"방향제"
    },
    {
        type:"dehumidifier",
        icon:"💧",
        name:"제습제"
    },
    {
        type:"deodorizer2",
        icon:"🧸",
        name:"탈취제"
    },
    {
        type:"etc",
        icon:"📦",
        name:"기타"
    }
];

// 최초 실행 시 기본 마커 저장
if(!localStorage.getItem("homecareMarkers")){
    localStorage.setItem(
        "homecareMarkers",
        JSON.stringify(markerSettings)
    );
}

// ===============================
// 제품 설정 (v3.0)
// ===============================

let productSettings = JSON.parse(
    localStorage.getItem("homecareProducts")
) || [];

let selectedX = 0;
let selectedY = 0;
let editIndex = null;

// 드래그 관련 변수
let dragMarker = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let markerStartX = 0;
let markerStartY = 0;

let dragThreshold = 8;


// 도면 이동 드래그 변수
let isMapDragging = false;
let mapStartX = 0;
let mapStartY = 0;
let mapStartOffsetX = 0;
let mapStartOffsetY = 0;
let mapMoved = false;

// 클릭과 드래그 구분용
let mapDownX = 0;
let mapDownY = 0;
let mapDraggingDistance = 10;

// ===============================
// 도면 확대/축소 변수 (v2.9)
// ===============================

let mapScale = 1;
const minScale = 1;
const maxScale = 3;
const zoomStep = 0.2;

// ===============================
// 핀치 확대 변수
// ===============================

let pinchStartDistance = 0;
let pinchStartScale = 1;

let pinchCenterX = 0;
let pinchCenterY = 0;

// 두 손가락 거리 계산
function getPinchDistance(e){

    const dx =
    e.touches[0].clientX -
    e.touches[1].clientX;

    const dy =
    e.touches[0].clientY -
    e.touches[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);

}

function updateZoomText(){

    const btn = document.getElementById("zoomResetBtn");

    if(btn){
        btn.innerHTML = Math.round(mapScale * 100) + "%";
    }

}

// 도면 이동 변수
let mapOffsetX = 0;
let mapOffsetY = 0;

// 도면 이동 제한
const maxMoveX = 1000;
const maxMoveY = 1000;

// 오늘 날짜 구하기
function today() {
    const d = new Date();
    return d.toISOString().split("T")[0];
}

// 시작
window.onload = function() {

    document.getElementById("installDate").value = today();

    loadRooms();

    loadProductSelect();

    loadDueFilter();

    loadRoomFilter();

    removeExpiredItems();

// ===============================
// 수정 모드 확인
// ===============================

editHistoryIndex =
Number(localStorage.getItem("editHistoryIndex"));

if(!isNaN(editHistoryIndex)){

    editMode = true;

    console.log(
        "수정모드",
        editHistoryIndex
    );

}


if(editMode){

    let editItem =
    installationHistory[editHistoryIndex];


    if(editItem){

        console.log(
            "수정 데이터:",
            editItem
        );
// ===============================
// 수정할 공간으로 이동
// ===============================

if(editItem.space){

    currentSpace =
    editItem.space;

    localStorage.setItem(
        "currentSpace",
        currentSpace
    );

    console.log(
        "수정할 공간으로 이동:",
        currentSpace
    );

}

        // ===============================
        // 수정 데이터 불러오기
        // ===============================

        document.getElementById("installDate").value =
        editItem.install || "";


        document.getElementById("detailLocation").value =
        editItem.detail || "";


        document.getElementById("replaceDays").value =
        editItem.cycle || "";

    }

}

// ===============================
// 현재 공간 불러오기
// ===============================

console.log(
    "최종 수정 공간:",
    currentSpace
);

loadSpace(currentSpace);

};


// 도면 클릭 시 등록 팝업 열기
document.getElementById("mapContainer").onclick = function(e) {

if(e.target.closest("#uploadPlaceholder")){
    return;
}

if(e.target.closest("#zoomControls")){
    return;
}

    // 드래그 중인 상태였다면 등록 팝업을 띄우지 않음
    if (isDragging) return;

    if (isMapDragging) return;

    if (mapMoved) return;



const mapContent = document.getElementById("mapContent");

const rect = mapContent.getBoundingClientRect();

let x = e.clientX - rect.left;
let y = e.clientY - rect.top;

x = x / mapScale;
y = y / mapScale;

selectedX = (x / mapContent.offsetWidth) * 100;
selectedY = (y / mapContent.offsetHeight) * 100;

    // 첫 번째 방 자동 선택 상태로 초기화 (에러 방지)
    const select = document.getElementById("locationName");
    if (select.options.length > 0) {
        select.selectedIndex = 0;
    }

    document.getElementById("popup").classList.remove("hidden");
};

let editMode = false;
let editHistoryIndex = null;

// 새 제품 저장
document.getElementById("saveBtn").onclick = function() {
    const selectedType =
document.getElementById("itemType").value;

console.log("선택한 제품:", selectedType);
console.log("전체 마커:", markerSettings);

const selectedMarker =
markerSettings.find(function(marker){

    return marker.type === selectedType;

})|| {};


const item = {

    type: selectedType,

    name: selectedMarker ? selectedMarker.name : selectedType,

    icon: selectedMarker ? selectedMarker.icon : "",

    location: document.getElementById("locationName").value,

    detail: document.getElementById("detailLocation").value,

    install: document.getElementById("installDate").value,

    cycle: Number(document.getElementById("replaceDays").value),

    x: selectedX,

    y: selectedY

};

// ===============================
// 제품별 마지막 설정 저장
// ===============================

const productDefaults =
    JSON.parse(
        localStorage.getItem("homecareProductDefaults") || "{}"
    );

productDefaults[selectedType] = {

    location: item.location,

    cycle: item.cycle

};

localStorage.setItem(
    "homecareProductDefaults",
    JSON.stringify(productDefaults)
);

    console.log(
    "등록 공간:",
    currentSpace
);

  //  items.push(item);

  let space = spaces.find(function(space){

    return space.name === currentSpace;

});


if(space){

    space.markers.push(item);

}

installationHistory.push({

    space: currentSpace,

    type: item.type,

    name: item.name,

    icon: item.icon,

    space: currentSpace,

    location: item.location,

    detail: item.detail,

    install: item.install,

    cycle: item.cycle,

    x: item.x,

    y: item.y

});

localStorage.setItem(
    "installationHistory",
    JSON.stringify(installationHistory)
);
    
    save();
    closePopup();
    render();
};

// 등록 취소
document.getElementById("cancelBtn").onclick = function() {
    closePopup();
};

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
}

// 로컬스토리지 저장
function save() {

    localStorage.setItem(
        "homecareItems",
        JSON.stringify(items)
    );

    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );

}

// 화면 그리기 (마커 및 리스트)
function render() {
    const layer = document.getElementById("markerLayer");
const itemList = document.getElementById("itemList");
const dueList = document.getElementById("dueList");

let currentSpaceData = spaces.find(function(space){

    return space.name === currentSpace;

});

let currentMarkers = 
currentSpaceData ? currentSpaceData.markers : [];


if(dueList){
    dueList.innerHTML = "";
}

    layer.innerHTML = "";
itemList.innerHTML = "";

currentMarkers.forEach((item, index) => {
          let markerData = markerSettings.find(
    m => m.type === item.type
);


let icon = markerData ? markerData.icon : "📦";

let markerName = markerData ? markerData.name : "기타";


        // 마커 생성
        let marker = document.createElement("div");
        marker.className = "marker " + getStatus(item);
        marker.innerHTML = icon;
        marker.style.left = item.x + "%";
        marker.style.top = item.y + "%";
        marker.dataset.index = index; // 데이터 인덱스 보관

        // 태블릿 터치 스크롤 방해 금지 설정
        marker.style.touchAction = "none";

        // 클릭 시 수정 팝업 오픈
       marker.onclick = function(e) {

    e.stopPropagation();

    setTimeout(function(){

        if(!isDragging){
            openEdit(index);
        }

    },30);

};

        layer.appendChild(marker);

        // 우측 리스트 카드 생성
   let div = document.createElement("div");
div.className = "card";

div.innerHTML = `
<h3>${icon} ${markerName} - ${item.location}</h3>
${item.detail ? `<p>📌 ${item.detail}</p>` : ""}
<p>설치일 : ${item.install}</p>
<p>교체일 : ${getReplace(item)}</p>
<p>${getRemainText(item)}</p>
<div class="cardButtons">
    <button class="editBtn" onclick="openEdit(${index})">수정</button>
</div>
`;
itemList.appendChild(div);
    });

    countSummary();

renderDueList(currentMarkers);
}

// 교체일 계산
function getReplace(item) {
    let d = new Date(item.install);
    d.setDate(d.getDate() + item.cycle);
    return d.toISOString().split("T")[0];
}

function getRemainDays(item){

    const today = new Date();
    today.setHours(0,0,0,0);

    const replace = new Date(getReplace(item));
    replace.setHours(0,0,0,0);

    return Math.floor(
        (replace - today) /
        (1000 * 60 * 60 * 24)
    );

}

function getRemainText(item){

    const days = getRemainDays(item);

    if(days > 3){
        return "🟢 D-" + days;
    }

    if(days > 0){
        return "🟠 D-" + days;
    }

    if(days === 0){
        return "🔴 오늘 교체";
    }

    return "⚫ 교체 후 " + Math.abs(days) + "일";

}

// ===============================
// 교체 예정 목록
// ===============================

function renderDueList(currentMarkers){

    const dueList = document.getElementById("dueList");

    if(!dueList) return;


    dueList.innerHTML = "";


let dueItems = [...currentMarkers];

let filter =
document.getElementById("dueFilter").value;

let roomFilter =
document.getElementById("roomFilter").value;


if(roomFilter !== "all"){

    dueItems = dueItems.filter(function(item){

        return item.location === roomFilter;

    });

}


if(filter !== "all"){

    dueItems = dueItems.filter(function(item){

        return item.type === filter;

    });

}


    // 교체가 빠른 순서
    dueItems.sort(function(a,b){

        return getRemainDays(a) - getRemainDays(b);

    });


    dueItems.slice(0,10).forEach(function(item){

        let markerData = markerSettings.find(
            m => m.type === item.type
        );


        let icon = markerData ? markerData.icon : "📦";

        let name = markerData ? markerData.name : "기타";


        let div = document.createElement("div");

        div.className = "dueCard";


        div.innerHTML =
        `
        <strong>${icon} ${name}</strong><br>
        📍 ${item.location}<br>
        ⏰ ${getRemainText(item)}
        `;


        dueList.appendChild(div);

    });

}


// 수정 팝업 열기
function openEdit(index) {

    editIndex = index;


    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    let item = currentSpaceData.markers[index];

    loadEditProductSelect();

    document.getElementById("editType").value = item.type;

    loadEditRooms();

    document.getElementById("editLocation").value = item.location;
    document.getElementById("editInstall").value = item.install;
    document.getElementById("editCycle").value = item.cycle;

    document.getElementById("editPopup")
    .classList.remove("hidden");

}

// 수정본 저장
document.getElementById("editSaveBtn").onclick = function() {


    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    let item = currentSpaceData.markers[editIndex];

    item.type = document.getElementById("editType").value;
    item.location = document.getElementById("editLocation").value;
    item.install = document.getElementById("editInstall").value;
    item.cycle = Number(document.getElementById("editCycle").value);

  localStorage.setItem(
    "homecareSpaces",
    JSON.stringify(spaces)
);
    document.getElementById("editPopup").classList.add("hidden");
    render();
};

// 삭제
document.getElementById("deleteBtn").onclick = function() {


    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    currentSpaceData.markers.splice(editIndex, 1);


    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );
    document.getElementById("editPopup").classList.add("hidden");
    render();
};

// 수정 취소
document.getElementById("editCancelBtn").onclick = function() {
    document.getElementById("editPopup").classList.add("hidden");
};

// 요약 카운트 계산
function countSummary() {

    let todayCount = 0;
    let weekCount = 0;

    let now = new Date();
    now.setHours(0, 0, 0, 0);


    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    let currentItems =
    currentSpaceData ? currentSpaceData.markers : [];


    currentItems.forEach(item => {

        let r = new Date(getReplace(item));
        r.setHours(0, 0, 0, 0);
        
        let diff = Math.floor(
            (r - now) /
            (1000 * 60 * 60 * 24)
        );

        if (diff === 0) todayCount++;

        if (diff >= 0 && diff <= 7) weekCount++;

    });


    document.getElementById("todayCount").innerHTML =
    todayCount + "개";

    document.getElementById("weekCount").innerHTML =
    weekCount + "개";
}


// ===============================
// 안전하고 정밀한 터치/포인터 드래그 기능 (태블릿 최적화)
// ===============================

function startDrag(e) {

    if (!e.target.classList.contains("marker")) return;

   // 확대 중이거나 두 손가락 터치 가능 상태에서는 마커 드래그 금지
if(
    e.pointerType === "touch" &&
    mapScale !== 1
){
    return;
}

if(e.pointerType === "touch"){
    const touches = document.querySelectorAll(":active");
}


// 마커 선택
dragMarker = e.target;

    isDragging = false;

    dragStartX = e.clientX;
    dragStartY = e.clientY;

    markerStartX = parseFloat(dragMarker.style.left);
    markerStartY = parseFloat(dragMarker.style.top);

    //dragMarker.setPointerCapture(e.pointerId);

    e.stopPropagation();
}

function moveMarker(e) {

    if (!dragMarker) return;

    const container = document.getElementById("mapContent");
    const rect = container.getBoundingClientRect();

  let x =
((e.clientX - rect.left) / rect.width) * 100;

let y =
((e.clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

   const moveDistance =
Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

if (moveDistance < dragThreshold) {
    return;
}

dragMarker.style.left = x + "%";
dragMarker.style.top = y + "%";

isDragging = true;

}

function endDrag(e) {
    if (!dragMarker) return;

    const index = Number(dragMarker.dataset.index);
    

console.log(
    "드래그 종료 index:",
    index,
    "현재공간:",
    currentSpace
);

let currentSpaceData = spaces.find(function(space){

    return space.name === currentSpace;

});

if(
    isDragging &&
    currentSpaceData &&
    currentSpaceData.markers[index]
){

    const finalX = parseFloat(dragMarker.style.left);
    const finalY = parseFloat(dragMarker.style.top);

    currentSpaceData.markers[index].x = finalX;
    currentSpaceData.markers[index].y = finalY;

    save();
    render();

}

 //dragMarker.releasePointerCapture(e.pointerId);
    dragMarker = null;
    // 클릭 이벤트 오작동을 막기 위해 약간의 시차를 두고 드래그 해제
    setTimeout(() => { isDragging = false; }, 50);
}

// 포인터 이벤트 리스너 등록 (마우스+터치 통합 지원)
document.addEventListener("pointerdown", startDrag);
document.addEventListener("pointermove", moveMarker);
document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);

// ===============================
// 교체 상태 색상 반환
// ===============================
function getStatus(item) {
    const today = new Date();
    const replace = new Date(getReplace(item));

    today.setHours(0, 0, 0, 0);
    replace.setHours(0, 0, 0, 0);

    const diff = Math.floor((replace - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "expired";
    if (diff <= 3) return "warning";
    return "normal";
}

// 방 목록 로드 (v2.6)
function loadRooms() {

    const select = document.getElementById("locationName");

    if (!select) return;


    let savedRooms = JSON.parse(
        localStorage.getItem("homecareRooms")
    );


    // 저장된 방이 없으면 기본 방 사용
    if (!savedRooms) {

        savedRooms = [
            "주방",
            "침실1",
            "침실2",
            "욕실1",
            "욕실2"
        ];

    }


    select.innerHTML = "";


    savedRooms.forEach(function(room) {

        const option = document.createElement("option");

        option.value = room;
        option.innerHTML = room;

        select.appendChild(option);

    });

}


// 기존 window.onload 내부 또는 아래쪽에 이 이벤트를 추가하세요
document.getElementById("imageLoader").onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
   reader.onload = function(event) {

    const imgData = event.target.result;

    console.log(
        "이미지 읽음:",
        imgData.substring(0,50)
    );

    console.log(
        "현재 저장 공간:",
        currentSpace
    );


    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    if(currentSpaceData){

        currentSpaceData.image = imgData;


        console.log(
            "저장 직전:",
            currentSpaceData
        );


        localStorage.setItem(
            "homecareSpaces",
            JSON.stringify(spaces)
        );

    }
    const imgElement = document.getElementById("floorImage");
    const placeholder = document.getElementById("uploadPlaceholder");

    // 화면 표시
    imgElement.src = imgData;

    // 버튼 숨김
    placeholder.style.display = "none";

    // 이미지 표시
    imgElement.style.display = "block";
    imgElement.style.width = "100%";
    imgElement.style.height = "auto";

    render();

};

  reader.readAsDataURL(file);

};

// ===============================
// 설정 메뉴
// ===============================

document.getElementById("settingBtn").onclick = function(){

    document.getElementById("settingPopup")
    .classList.remove("hidden");

};

// 닫기

document.getElementById("settingCloseBtn").onclick = function(){

    document.getElementById("settingPopup")
    .classList.add("hidden");

};
/*
// ===============================
// 도면 삭제
// ===============================

document.getElementById("deleteFloorBtn").onclick = function(){

    let currentSpaceData = spaces.find(function(space){

        return space.name === currentSpace;

    });


    if(!currentSpaceData){
        return;
    }


    if(!confirm("현재 도면을 삭제할까요?")){
        return;
    }


    currentSpaceData.image = "";


    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );


    let floorImage =
    document.getElementById("floorImage");


    let uploadPlaceholder =
    document.getElementById("uploadPlaceholder");


    floorImage.removeAttribute("src");

    floorImage.style.display = "none";

    uploadPlaceholder.style.display = "block";


};*/

// ===============================
// 룸 관리 기능 (v2.6)
// ===============================

let userRooms = JSON.parse(localStorage.getItem("homecareRooms")) 
|| [
    "주방",
    "침실1",
    "침실2",
    "욕실1",
    "욕실2"
];


// 룸 관리 열기
document.getElementById("roomManageBtn").onclick = function(){

    document.getElementById("settingPopup")
    .classList.add("hidden");

    document.getElementById("roomPopup")
    .classList.remove("hidden");

    renderRooms();
    loadRooms();

};


// 룸 관리 닫기
document.getElementById("roomCloseBtn").onclick = function(){

    document.getElementById("roomPopup")
    .classList.add("hidden");

};


/*
// ===============================
// 제품 관리 기능 (v3.1)
// ===============================


// 제품 관리 열기
document.getElementById("productManageBtn").onclick = function(){

    document.getElementById("settingPopup")
    .classList.add("hidden");

    document.getElementById("productPopup")
    .classList.remove("hidden");

};


// 제품 관리 닫기
document.getElementById("productCloseBtn").onclick = function(){

    document.getElementById("productPopup")
    .classList.add("hidden");

};*/

// ===============================
// 공간 관리 열기
// ===============================

document.getElementById("floorManageBtn").onclick = function(){

    console.log("공간관리 버튼 클릭");

    document.getElementById("settingPopup")
    .classList.add("hidden");

    document.getElementById("floorManagePopup")
    .classList.remove("hidden");

       renderSpaceManageList();


};

// 공간 관리 닫기

document.getElementById("floorManageCloseBtn").onclick = function(){

    document.getElementById("floorManagePopup")
    .classList.add("hidden");

};

// ===============================
// 마커 관리 팝업 (v3.0)
// ===============================

document.getElementById("markerManageBtn").onclick = function(){

    document.getElementById("settingPopup")
    .classList.add("hidden");

    document.getElementById("markerPopup")
    .classList.remove("hidden");

    renderMarkers();
    
};


document.getElementById("markerCloseBtn").onclick = function(){

    document.getElementById("markerPopup")
    .classList.add("hidden");

};

// 방 목록 표시
function renderRooms(){

const roomList = document.getElementById("roomList");

roomList.innerHTML = "";

    userRooms.forEach(function(room,index){

        const div = document.createElement("div");

       div.innerHTML = `
    <span>${room}</span>

    <button onclick="moveRoomUp(${index})">
        ▲
    </button>

    <button onclick="moveRoomDown(${index})">
        ▼
    </button>

    <button onclick="editRoom(${index})">
        수정
    </button>

    <button onclick="deleteRoom(${index})">
        삭제
    </button>
`;

        list.appendChild(div);

    });

}



// 방 추가
document.getElementById("addRoomBtn").onclick = function(){

    const input = document.getElementById("newRoomName");

    const name = input.value.trim();


    if(name === "") return;


   userRooms.push(name);

saveRooms();

input.value = "";

renderRooms();

loadRooms();   // 추가

};



// 방 수정
function editRoom(index){

    const newName = prompt(
        "새로운 방 이름을 입력하세요",
        userRooms[index]
    );


    if(newName === null) return;


    const name = newName.trim();


    if(name === "") return;


   userRooms[index] = name;

saveRooms();

renderRooms();

loadRooms();

}



// 방 삭제
function deleteRoom(index){

    const result = confirm(
        userRooms[index] + "을 삭제하시겠습니까?"
    );


    if(!result) return;


    userRooms.splice(index,1);

saveRooms();

renderRooms();

loadRooms();

}



// 저장
function saveRooms(){

    localStorage.setItem(
        "homecareRooms",
        JSON.stringify(userRooms)
    );

}

function loadEditRooms(){

    const select = document.getElementById("editLocation");

    if(!select) return;

    select.innerHTML = "";

    userRooms.forEach(function(room){

        const option = document.createElement("option");

        option.value = room;
        option.textContent = room;

        select.appendChild(option);

    });

}

// 방 위로 이동
function moveRoomUp(index){

    if(index === 0) return;

    let temp = userRooms[index - 1];

    userRooms[index - 1] = userRooms[index];

    userRooms[index] = temp;

    saveRooms();

    renderRooms();

    loadRooms();

}


// 방 아래로 이동
function moveRoomDown(index){

    if(index === userRooms.length - 1) return;

    let temp = userRooms[index + 1];

    userRooms[index + 1] = userRooms[index];

    userRooms[index] = temp;

    saveRooms();

    renderRooms();

    loadRooms();

}

// ===============================
// 도면 확대/축소 함수 (v2.9)
// ===============================

function updateMapScale(){

    const mapContent = document.getElementById("mapContent");

    if(!mapContent) return;

mapContent.style.transformOrigin = "0 0";
 mapContent.style.transform =
`translate(${mapOffsetX}px, ${mapOffsetY}px) scale(${mapScale})`;


    document.getElementById("zoomPercentBtn").innerText =
    Math.round(mapScale * 100) + "%";

}

// ===============================
// 확대 버튼 이벤트
// ===============================

document.getElementById("zoomInBtn").onclick = function(){

    if(mapScale >= maxScale) return;


    const oldScale = mapScale;

    const newScale = mapScale + zoomStep;


    const centerX = mapContainer.clientWidth / 2;
    const centerY = mapContainer.clientHeight / 2;


    mapOffsetX = centerX - (centerX - mapOffsetX) * (newScale / oldScale);

    mapOffsetY = centerY - (centerY - mapOffsetY) * (newScale / oldScale);


    mapScale = newScale;


    updateMapScale();

};

// ===============================
// 축소 버튼 이벤트
// ===============================

document.getElementById("zoomOutBtn").onclick = function(){

    if(mapScale <= minScale) return;


    const oldScale = mapScale;

    const newScale = mapScale - zoomStep;


    const centerX = mapContainer.clientWidth / 2;
    const centerY = mapContainer.clientHeight / 2;


    mapOffsetX = centerX - (centerX - mapOffsetX) * (newScale / oldScale);

    mapOffsetY = centerY - (centerY - mapOffsetY) * (newScale / oldScale);


    mapScale = Number(newScale.toFixed(1));


    if(mapScale <= 1){

        mapScale = 1;

        mapOffsetX = 0;

        mapOffsetY = 0;

    }


    updateMapScale();

};

// ===============================
// 도면 이동 시작
// ===============================

function startMapDrag(e){

    if(dragMarker) return;

    if(e.target.closest(".marker")) return;

    if(mapScale <= 1) return;


    isMapDragging = true;
    mapMoved = false;

    mapStartX = e.clientX;
    mapStartY = e.clientY;

    mapStartOffsetX = mapOffsetX;
    mapStartOffsetY = mapOffsetY;

}


function moveMapDrag(e){

    if(!isMapDragging) return;


 const dragSpeed = 1.3;   // 지도 이동 속도

let moveX =
((e.clientX - mapStartX) / mapScale) * dragSpeed;

let moveY =
((e.clientY - mapStartY) / mapScale) * dragSpeed;


    if(Math.abs(moveX)+Math.abs(moveY) > 5){
        mapMoved = true;
    }


    mapOffsetX = mapStartOffsetX + moveX;
    mapOffsetY = mapStartOffsetY + moveY;


    updateMapScale();

}


function endMapDrag(){

    isMapDragging = false;

}


// 이벤트 연결

const mapContainer =
document.getElementById("mapContainer");


mapContainer.addEventListener(
"pointerdown",
startMapDrag,
{passive:false}
);

mapContainer.addEventListener(
"pointermove",
moveMapDrag
);

mapContainer.addEventListener(
"pointerup",
endMapDrag
);

mapContainer.addEventListener(
"pointercancel",
endMapDrag
);

document.getElementById("zoomPercentBtn").onclick = function(){

    mapScale = 1;
    mapOffsetX = 0;
    mapOffsetY = 0;

    updateMapScale();

};

console.log("homeBtn 찾기:", document.getElementById("homeBtn"));

const homeBtn = document.getElementById("homeBtn");

console.log("homeBtn:", homeBtn);

if(homeBtn){

    homeBtn.onclick = function(){

        location.href = "index.html";

    };

}

// ===============================
// 두 손가락 핀치 확대 (v3.1 정리)
// ===============================

const pinchMap = document.getElementById("mapContainer");

pinchMap.addEventListener("touchstart", function(e){

    if(e.touches.length !== 2) return;

    e.preventDefault();

    pinchStartDistance = getPinchDistance(e);
    pinchStartScale = mapScale;

    const rect = pinchMap.getBoundingClientRect();

    pinchCenterX =
    ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;

    pinchCenterY =
    ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;

    pinchBaseOffsetX = mapOffsetX;
pinchBaseOffsetY = mapOffsetY;

    dragMarker = null;
    isDragging = false;
    isMapDragging = false;

},{passive:false});



pinchMap.addEventListener("touchmove", function(e){

    if(e.touches.length !== 2) return;

    e.preventDefault();

    if(pinchStartDistance === 0) return;

    let distance = getPinchDistance(e);

    let newScale =
    pinchStartScale *
    (distance / pinchStartDistance);

    newScale =
    Math.max(minScale,
    Math.min(maxScale,newScale));

  let ratio =
newScale / pinchStartScale;

mapOffsetX =
pinchCenterX -
(pinchCenterX - pinchBaseOffsetX) * ratio;

mapOffsetY =
pinchCenterY -
(pinchCenterY - pinchBaseOffsetY) * ratio;

mapScale = newScale;

    updateMapScale();

},{passive:false});



pinchMap.addEventListener("touchend",function(e){

    if(e.touches.length < 2){

        pinchStartDistance = 0;

    }

});

// ===============================
// 제품 선택 목록 생성 (v3.0)
// ===============================

function loadProductSelect(){

    const select = document.getElementById("itemType");

    if(!select) return;

    select.innerHTML = "";

    markerSettings.forEach(function(marker){

        const option = document.createElement("option");

        option.value = marker.type;

        option.textContent =
            marker.icon + " " + marker.name;

        select.appendChild(option);

    });

}


// ===============================
// 제품 선택 목록 생성 (v3.0)
// ===============================

function loadProductSelect(){

    const select = document.getElementById("itemType");

    if(!select) return;

    select.innerHTML = "";

    markerSettings.forEach(function(marker){

        const option = document.createElement("option");

        option.value = marker.type;

        option.textContent =
            marker.icon + " " + marker.name;

        select.appendChild(option);

    });

}

// ===============================
// 제품별 마지막 설정 불러오기
// ===============================

function loadProductDefaults(){

    const select =
        document.getElementById("itemType");

    if(!select) return;


    const selectedType =
        select.value;


    const saved =
        JSON.parse(
            localStorage.getItem("homecareProductDefaults") || "{}"
        );


    const data =
        saved[selectedType];


    if(!data) return;


    // 마지막 위치 불러오기
    const location =
        document.getElementById("locationName");

    if(location && data.location){

        location.value =
            data.location;

    }


    // 마지막 교체주기 불러오기
    const replaceDays =
        document.getElementById("replaceDays");

    if(replaceDays && data.cycle){

        replaceDays.value =
            data.cycle;

    }
    // 상세 위치는 항상 새로 입력
const detailLocation =
    document.getElementById("detailLocation");

if(detailLocation){

    detailLocation.value = "";

}

}

// ===============================
// 제품 선택 변경
// ===============================

document.getElementById("itemType").addEventListener(
    "change",
    function(){

        loadProductDefaults();

    }
);

// ===============================
// 마커 목록 표시 (v3.0)
// ===============================

function renderMarkers(){

const defaultList = document.getElementById("markerList");
    const customList = document.getElementById("customMarkerList");

    if(!defaultList || !customList) return;


    defaultList.innerHTML = "";
    customList.innerHTML = "";


    markerSettings.forEach(function(marker, index){

        const div = document.createElement("div");

        div.className = "markerItem";

        div.innerHTML = `
            <span>
                ${marker.icon}
                ${marker.name}
            </span>

            <button onclick="editMarker(${index})">
                수정
            </button>
        `;


        // 기본 마커 / 추가 마커 구분
        if(marker.custom){

            customList.appendChild(div);

        }else{

            defaultList.appendChild(div);

        }

    });

}

// ===============================
// 마커 수정 기능 (v3.0)
// ===============================

let editMarkerIndex = null;


// 수정 버튼 클릭
function editMarker(index){

    editMarkerIndex = index;

    const marker = markerSettings[index];

    document.getElementById("editMarkerIcon").value = marker.icon;

    document.getElementById("editMarkerName").value = marker.name;


    document.getElementById("markerEditArea")
    .style.display = "block";

}



// 저장
document.getElementById("markerSaveBtn").onclick = function(){

    if(editMarkerIndex === null) return;


    const marker = markerSettings[editMarkerIndex];


    marker.icon =
    document.getElementById("editMarkerIcon").value;


    marker.name =
    document.getElementById("editMarkerName").value;


    localStorage.setItem(
        "homecareMarkers",
        JSON.stringify(markerSettings)
    );


    document.getElementById("markerEditArea")
    .style.display = "none";


    renderMarkers();

    render();

};



// 취소
document.getElementById("markerCancelBtn").onclick = function(){

    editMarkerIndex = null;

    document.getElementById("markerEditArea")
    .style.display = "none";

};

// 삭제
document.getElementById("markerDeleteBtn").onclick = function(){

    if(editMarkerIndex === null) return;


if(!markerSettings[editMarkerIndex].custom){
    alert("기본 마커는 삭제할 수 없습니다.");
    return;
}

    if(!confirm("이 마커를 삭제할까요?")){
        return;
    }
 
    markerSettings.splice(editMarkerIndex,1);


    localStorage.setItem(
        "homecareMarkers",
        JSON.stringify(markerSettings)
    );


    editMarkerIndex = null;


    document.getElementById("markerEditArea")
    .style.display = "none";


    renderMarkers();

    render();

};

// ===============================
// 교체 예정 필터 생성
// ===============================

function loadDueFilter(){

    const select = document.getElementById("dueFilter");

    if(!select) return;

    select.innerHTML = "";


    // 전체 추가
    let allOption = document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "전체 제품";

    select.appendChild(allOption);



    // 제품 종류 추가
    markerSettings.forEach(function(marker){

        let option = document.createElement("option");

        option.value = marker.type;

        option.textContent =
            marker.icon + " " + marker.name;

        select.appendChild(option);

    });

}

// ===============================
// 교체 예정 방 필터 생성
// ===============================

function loadRoomFilter(){

    const select = document.getElementById("roomFilter");

    if(!select) return;


    select.innerHTML = "";


    let allOption = document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "전체 위치";

    select.appendChild(allOption);


let rooms = JSON.parse(
    localStorage.getItem("homecareRooms")
) || [
    "주방",
    "침실1",
    "침실2",
    "욕실1",
    "욕실2"
];


rooms.forEach(function(room){

    let option = document.createElement("option");

    option.value = room;
    option.textContent = room;

    select.appendChild(option);

});

}

// ===============================
// 마커 추가창 열기 / 닫기 (v3.0)
// ===============================

document.getElementById("addMarkerBtn").onclick = function(){

    document.getElementById("markerEditArea")
    .style.display = "none";

    document.getElementById("markerAddArea")
    .style.display = "block";

};


document.getElementById("markerAddCancelBtn").onclick = function(){

    document.getElementById("markerAddArea")
    .style.display = "none";

};

// ===============================
// 새 마커 저장 (v3.0)
// ===============================

document.getElementById("markerAddSaveBtn").onclick = function(){

    const icon =
    document.getElementById("newMarkerIcon").value.trim();


    const name =
    document.getElementById("newMarkerName").value.trim();


    if(icon === "" || name === ""){
        alert("아이콘과 이름을 입력하세요.");
        return;
    }


   const newMarker = {

    type: "marker_" + Date.now(),

    icon: icon,

    name: name,
    custom: true


};


    markerSettings.push(newMarker);


    localStorage.setItem(
        "homecareMarkers",
        JSON.stringify(markerSettings)
    );


    // 입력창 초기화

    document.getElementById("newMarkerIcon").value = "";

    document.getElementById("newMarkerName").value = "";


    // 추가창 닫기

    document.getElementById("markerAddArea")
    .style.display = "none";


    // 목록 새로 표시

   renderMarkers();

loadProductSelect();

loadDueFilter();

render();

};

// ===============================
// 교체 예정 필터 변경
// ===============================

document.getElementById("dueFilter").onchange = function(){

    renderDueList();

};

document.getElementById("roomFilter").onchange = function(){

    renderDueList();

};

function loadEditProductSelect(){

    const select = document.getElementById("editType");

    if(!select) return;

    select.innerHTML = "";

    markerSettings.forEach(function(marker){

        const option = document.createElement("option");

        option.value = marker.type;

        option.textContent =
            marker.icon + " " + marker.name;

        select.appendChild(option);

    });

}

// ===============================
// 맨 위 이동 버튼
// ===============================

const topButton = document.getElementById("topButton");


window.addEventListener("scroll", function(){

    if(window.scrollY > 300){

        topButton.style.display = "flex";

    }
    else{

        topButton.style.display = "none";

    }

});

if(topButton){

    topButton.onclick = function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    };

}

// ===============================
// 공간 추가 팝업 열기
// ===============================

document
.getElementById("addSpaceBtn")
.onclick=function(){

    document
    .getElementById("spacePopup")
    .classList.remove("hidden");

};

// ===============================
// 공간 추가 버튼
// ===============================

// ===============================
// 공간 추가 팝업 열기
// ===============================

document
.getElementById("addSpaceBtn")
.onclick = function(){

    document
    .getElementById("spacePopup")
    .classList.remove("hidden");

};

// ===============================
// 공간 추가 팝업 닫기
// ===============================

document
.getElementById("spaceCloseBtn")
.onclick = function(){

    document
    .getElementById("spacePopup")
    .classList.add("hidden");

};

// ===============================
// 새 공간 이미지 선택
// ===============================

let selectedSpaceImage = "";

document
.getElementById("spaceImageInput")
.onchange = function(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(){

    const img = new Image();

    img.onload = function(){

        const canvas = document.createElement("canvas");

        const maxSize = 1200;

        let width = img.width;
        let height = img.height;


        if(width > height){

            if(width > maxSize){

                height =
                height * (maxSize / width);

                width = maxSize;

            }

        }else{

            if(height > maxSize){

                width =
                width * (maxSize / height);

                height = maxSize;

            }

        }


        canvas.width = width;
        canvas.height = height;


        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            img,
            0,
            0,
            width,
            height
        );


        selectedSpaceImage =
        canvas.toDataURL(
            "image/jpeg",
            0.8
        );


        const preview =
        document.getElementById("spacePreview");


        preview.src = selectedSpaceImage;

        preview.classList.remove("hidden");


        console.log(
            "압축 완료:",
            Math.round(selectedSpaceImage.length / 1024),
            "KB"
        );

        console.log(selectedSpaceImage.substring(0,50));

    };


    img.src = reader.result;

};

    reader.readAsDataURL(file);

};

// ===============================
// 새 공간 저장
// ===============================

document
.getElementById("spaceSaveBtn")
.onclick = function(){

    let name =
    document.getElementById("spaceNameInput").value.trim();

    if(name === ""){
        alert("공간 이름을 입력해주세요");
        return;
    }

    if(selectedSpaceImage === ""){

    alert("도면 이미지를 선택해주세요");

    return;

}

    spaces.push({

        name:name,

        icon:"🏠",

        image:selectedSpaceImage,

        markers:[]

    });

    try{

    localStorage.setItem(
        "homecareSpaces",
        JSON.stringify(spaces)
    );

}
catch(e){

    alert(
        "이미지 용량이 너무 커 저장할 수 없습니다.\n작은 이미지를 선택해주세요."
    );

    return;

}

   currentSpace = name;

localStorage.setItem(
    "currentSpace",
    currentSpace
);

renderSpaces();

loadSpace(currentSpace);

    document
    .getElementById("spacePopup")
    .classList.add("hidden");

selectedSpaceImage = "";

document.getElementById("spaceImageInput").value = "";

document.getElementById("spacePreview").src = "";

document.getElementById("spacePreview").classList.add("hidden");

    alert(name + " 공간이 만들어졌습니다");

};



// ===============================
// 공간 목록 표시 실행
// ===============================

renderSpaces();