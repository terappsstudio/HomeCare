console.log("HomeCare JS 시작");

let items = JSON.parse(localStorage.getItem("homecareItems")) || [];
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

    const savedFloor = localStorage.getItem("homecareFloor");

    if(savedFloor){

        document.getElementById("floorImage").src = savedFloor;

        document.getElementById("floorImage").style.display = "block";

        document.getElementById("floorImage").style.width = "100%";

        document.getElementById("uploadPlaceholder").style.display = "none";

    }

    render();
};

// 제품 추가 버튼 클릭 시 알림
document.getElementById("addBtn").onclick = function() {


    
    alert("도면에서 설치 위치를 눌러주세요.");
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

   const rect = this.getBoundingClientRect();

const x =
(e.clientX - rect.left) / rect.width;

const y =
(e.clientY - rect.top) / rect.height;


selectedX = x * 100;
selectedY = y * 100;

    // 첫 번째 방 자동 선택 상태로 초기화 (에러 방지)
    const select = document.getElementById("locationName");
    if (select.options.length > 0) {
        select.selectedIndex = 0;
    }

    document.getElementById("popup").classList.remove("hidden");
};

// 새 제품 저장
document.getElementById("saveBtn").onclick = function() {
    const item = {
        type: document.getElementById("itemType").value,
        location: document.getElementById("locationName").value,
        install: document.getElementById("installDate").value,
        cycle: Number(document.getElementById("replaceDays").value),
        x: selectedX,
        y: selectedY
    };

    items.push(item);
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
    localStorage.setItem("homecareItems", JSON.stringify(items));
}

// 화면 그리기 (마커 및 리스트)
function render() {
    const layer = document.getElementById("markerLayer");
    const list = document.getElementById("itemList");

    layer.innerHTML = "";
    list.innerHTML = "";


    items.forEach((item, index) => {
        let icon = "📦";
        if (item.type == "deodorizer") icon = "🌿";
        if (item.type == "dehumidifier") icon = "💧";
        if (item.type == "deodorizer2") icon = "🧸";

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
        div.className = "card"; // class명을 기본 CSS에 맞춰 card로 수정
        div.innerHTML = `
            <h3>${icon} ${item.location}</h3>
            <p>설치일 : ${item.install}</p>
            <p>교체일 : ${getReplace(item)}</p>
            <p>${getRemainText(item)}</p>
            <div class="cardButtons">
                <button class="editBtn" onclick="openEdit(${index})">수정</button>
            </div>
        `;
        list.appendChild(div);
    });

    countSummary();
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


// 수정 팝업 열기
function openEdit(index) {
    editIndex = index;
    let item = items[index];

    document.getElementById("editType").value = item.type;

loadEditRooms();
    
    document.getElementById("editLocation").value = item.location;
    document.getElementById("editInstall").value = item.install;
    document.getElementById("editCycle").value = item.cycle;

    document.getElementById("editPopup").classList.remove("hidden");
}

// 수정본 저장
document.getElementById("editSaveBtn").onclick = function() {
    let item = items[editIndex];

    item.type = document.getElementById("editType").value;
    item.location = document.getElementById("editLocation").value;
    item.install = document.getElementById("editInstall").value;
    item.cycle = Number(document.getElementById("editCycle").value);

    save();
    document.getElementById("editPopup").classList.add("hidden");
    render();
};

// 삭제
document.getElementById("deleteBtn").onclick = function() {
    items.splice(editIndex, 1);
    save();
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

    items.forEach(item => {
        let r = new Date(getReplace(item));
        r.setHours(0, 0, 0, 0);
        
        let diff = Math.floor((r - now) / (1000 * 60 * 60 * 24));

        if (diff === 0) todayCount++;
        if (diff >= 0 && diff <= 7) weekCount++;
    });

    document.getElementById("todayCount").innerHTML = todayCount + "개";
    document.getElementById("weekCount").innerHTML = weekCount + "개";
}

// ===============================
// 안전하고 정밀한 터치/포인터 드래그 기능 (태블릿 최적화)
// ===============================

function startDrag(e) {

    if (!e.target.classList.contains("marker")) return;

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
    
    if (isDragging && !isNaN(index) && items[index]) {
        // 최종 마커 스타일 기준 퍼센트 역산 저장 (정밀도 보장)
       const finalX = parseFloat(dragMarker.style.left);
const finalY = parseFloat(dragMarker.style.top);

items[index].x = finalX;
items[index].y = finalY;
        save();
        render(); // 드래그 끝난 후 상태 동기화 재렌더링
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

    // 도면 저장
    localStorage.setItem("homecareFloor", imgData);


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


// 도면 변경

document.getElementById("changeFloorBtn").onclick = function(){

    document.getElementById("imageLoader").click();

};


// 도면 삭제

document.getElementById("deleteFloorBtn").onclick = function(){

    localStorage.removeItem("homecareFloor");

    location.reload();

};

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



// 방 목록 표시
function renderRooms(){

    const list = document.getElementById("roomList");

    list.innerHTML = "";


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

    mapContent.style.transformOrigin = "center center";

  mapContent.style.transform =
`scale(${mapScale}) translate(${mapOffsetX}px, ${mapOffsetY}px)`;


    document.getElementById("zoomPercentBtn").innerText =
    Math.round(mapScale * 100) + "%";

}

// ===============================
// 확대 버튼 이벤트
// ===============================

document.getElementById("zoomInBtn").onclick = function(){

    if(mapScale >= maxScale) return;

mapScale += zoomStep;

    updateMapScale();

};

// ===============================
// 축소 버튼 이벤트
// ===============================

document.getElementById("zoomOutBtn").onclick = function(){

    if(mapScale <= minScale) return;

    mapScale = Number((mapScale - zoomStep).toFixed(1));

    if(mapScale <= 1){
        mapScale = 1;
        mapOffsetX = 0;
        mapOffsetY = 0;
    }

    updateMapScale();

};

// ===============================
// 도면 이동 시작 (v2.9)
// ===============================

function startMapDrag(e){


    // 마커 드래그 중이면 도면 이동 금지
    if(dragMarker) return;

    // 마커를 누른 경우는 제외
    if(e.target.closest(".marker")) return;

    if(mapScale <= 1) return;

    e.stopPropagation();

    isMapDragging = true;
    mapMoved = false;

    mapStartX = e.clientX;
    mapStartY = e.clientY;

    mapDownX = e.clientX;
    mapDownY = e.clientY;

    mapStartOffsetX = mapOffsetX;
    mapStartOffsetY = mapOffsetY;

   if(mapScale > 1){
    e.preventDefault();
}

}

function moveMapDrag(e){

    if(!isMapDragging) return;

let distance =
Math.sqrt(
Math.pow(e.clientX - mapDownX,2) +
Math.pow(e.clientY - mapDownY,2)
);


if(distance > mapDraggingDistance){
    mapMoved = true;
}


if(!mapMoved) return;

   let moveX = (e.clientX - mapStartX) / mapScale * 1.4;
let moveY = (e.clientY - mapStartY) / mapScale * 1.4;


    mapOffsetX = mapStartOffsetX + moveX;
mapOffsetY = mapStartOffsetY + moveY;


// 이동 범위 제한
if(mapOffsetX > maxMoveX){
    mapOffsetX = maxMoveX;
}

if(mapOffsetX < -maxMoveX){
    mapOffsetX = -maxMoveX;
}


if(mapOffsetY > maxMoveY){
    mapOffsetY = maxMoveY;
}

if(mapOffsetY < -maxMoveY){
    mapOffsetY = -maxMoveY;
}


    updateMapScale();

}

function endMapDrag(){

    isMapDragging = false;

    if(mapMoved){

        setTimeout(function(){

            mapMoved = false;

        },800);

    }

}

// ===============================
// 도면 이동 이벤트 연결
// ===============================

document.getElementById("mapContainer")
.addEventListener("pointerdown", startMapDrag);

document.getElementById("mapContainer")
.addEventListener("pointermove", moveMapDrag);

document.getElementById("mapContainer")
.addEventListener("pointerup", endMapDrag);

document.getElementById("mapContainer")
.addEventListener("pointercancel", endMapDrag);

document.getElementById("zoomPercentBtn").onclick = function(){

    mapScale = 1;
    mapOffsetX = 0;
    mapOffsetY = 0;

    updateMapScale();

};

document.getElementById("homeBtn").onclick = function(){

    // 팝업 모두 닫기
    document.querySelectorAll(".popup").forEach(function(p){
        p.classList.add("hidden");
    });

    // 확대 초기화
    mapScale = 1;
    mapOffsetX = 0;
    mapOffsetY = 0;

    updateMapScale();

    // 설치목록 맨 위
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

};