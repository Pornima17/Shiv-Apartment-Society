// =========================
// Route Protection
// =========================

const protectedPages = [
    "dashboard.html",
    "residents.html",
    "complaints.html",
    "maintenance.html",
    "notice.html",
    "visitors.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    sessionStorage.getItem("adminLoggedIn") !== "true"
) {
    window.location.replace("admin-login.html");
}


// =========================
// Admin Login System
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const showPassword = document.getElementById("showPassword");

    // Show Password

    showPassword.addEventListener("change", function () {

        passwordInput.type = this.checked ? "text" : "password";

    });

    // Load Remembered Username

    const savedUsername = localStorage.getItem("rememberedUsername");

    if (savedUsername) {

        usernameInput.value = savedUsername;
        rememberMe.checked = true;

    }

    // Login

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

// Admin Credentials

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD =
localStorage.getItem("adminPassword") || "admin123";

        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem("adminLoggedIn", "true");
// =========================
// Login Statistics
// =========================

// Last Login
localStorage.setItem(
    "lastLogin",
    new Date().toLocaleString()
);

// Login Count
let loginCount =
Number(localStorage.getItem("loginCount")) || 0;

loginCount++;

localStorage.setItem(
    "loginCount",
    loginCount
);

            if (rememberMe.checked) {

                localStorage.setItem(
                    "rememberedUsername",
                    username
                );

            } else {

                localStorage.removeItem(
                    "rememberedUsername"
                );

            }
let loginHistory =
JSON.parse(localStorage.getItem("loginHistory")) || [];

loginHistory.unshift({

    message : "Admin Logged In",

    time : new Date().toLocaleString()

});

if(loginHistory.length > 10){

    loginHistory.pop();

}

localStorage.setItem(
    "loginHistory",
    JSON.stringify(loginHistory)
);
            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Username or Password!");

            passwordInput.value = "";
            passwordInput.focus();

        }

    });

}


// =========================
// Dark Mode with Local Storage
// =========================

const darkModeBtn = document.getElementById("darkModeBtn");

if (darkModeBtn) {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");
        darkModeBtn.innerHTML = "☀️ Light Mode";

    }

    darkModeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");
            darkModeBtn.innerHTML = "☀️ Light Mode";

        } else {

            localStorage.setItem("theme", "light");
            darkModeBtn.innerHTML = "🌙 Dark Mode";

        }

    });

}


// =========================
// Maintenance Data
// =========================

let maintenanceRecords =
JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

let editingMaintenanceIndex = -1;

// =========================
// Complaints Data
// =========================

let complaints = [];
let editingComplaintIndex = -1;

// =========================
// Notice Data
// =========================

let notices =
JSON.parse(localStorage.getItem("notices")) || [];

let editingNoticeIndex = -1;

// =========================
// Visitors Data
// =========================

let visitors = [];
let editingVisitorIndex = -1;

// =========================
// Flats Data
// =========================

let flats = [];
let editingFlatIndex = -1;

// =========================
// Parking Data
// =========================

let parkingRecords = [];
let editingParkingIndex = -1;

// =========================
// Events Data
// =========================

let events =
JSON.parse(localStorage.getItem("events")) || [];

let editingEventIndex = -1;

// =========================
// Save Events
// =========================

function saveEvents(){

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}

// =========================
// Display Events
// =========================

function displayEvents(){

    const tableBody =
    document.getElementById("eventTableBody");

    if(!tableBody) return;

    tableBody.innerHTML = "";

    events.forEach(function(event,index){

        tableBody.innerHTML += `

<tr>

<td>E${String(index+1).padStart(3,"0")}</td>

<td>${event.title}</td>

<td>${event.date}</td>

<td>${event.time}</td>

<td>${event.location}</td>

<td>

<button class="view-event-btn"
data-index="${index}">

<i class="fa-solid fa-eye"></i>

</button>

<button class="edit-event-btn"
data-index="${index}">

<i class="fa-solid fa-pen"></i>

</button>

<button class="delete-event-btn"
data-index="${index}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

updateEventSummary();

}

// =========================
// Update Event Summary
// =========================

function updateEventSummary(){

    const totalEvents =
    document.getElementById("totalEvents");

    const upcomingEvents =
    document.getElementById("upcomingEvents");

    const completedEvents =
    document.getElementById("completedEvents");

    if(
        !totalEvents ||
        !upcomingEvents ||
        !completedEvents
    ){
        return;
    }

    const today = new Date();

    today.setHours(0,0,0,0);

    let upcoming = 0;
    let completed = 0;

events.forEach(function(event){
        const eventDate = new Date(event.date);

        eventDate.setHours(0,0,0,0);

        if(eventDate >= today){

            upcoming++;

        }else{

            completed++;

        }

    });

totalEvents.innerText = events.length;
    upcomingEvents.innerText = upcoming;

    completedEvents.innerText = completed;

}

// =========================
// Add Event
// =========================

const saveEvent =
document.getElementById("saveEvent");

if(saveEvent){

saveEvent.addEventListener("click",function(){

const title =
document.getElementById("eventTitle").value.trim();

const date =
document.getElementById("eventDate").value;

const time =
document.getElementById("eventTime").value;

const location =
document.getElementById("eventLocation").value.trim();

const description =
document.getElementById("eventDescription").value.trim();

if(
title===""||
date===""||
time===""||
location===""
){

alert("Please fill all fields.");

return;

}

if(editingEventIndex!==-1){

events[editingEventIndex]={

title,
date,
time,
location,
description

};

editingEventIndex=-1;

saveEvent.innerText="Save Event";

addActivity(title+" event updated.");

}else{

events.push({

title,
date,
time,
location,
description

});

addActivity(title+" event added.");

}

saveEvents();

displayEvents();

updateEventSummary();

document.getElementById("eventTitle").value="";
document.getElementById("eventDate").value="";
document.getElementById("eventTime").value="";
document.getElementById("eventLocation").value="";
document.getElementById("eventDescription").value="";

alert("Event Saved Successfully.");

});

}

// =========================
// Event Actions
// =========================

const eventTable =
document.getElementById("eventTable");

if(eventTable){

eventTable.addEventListener("click",function(e){

const button =
e.target.closest("button");

if(!button) return;

const index =
button.dataset.index;

if(button.classList.contains("edit-event-btn")){

editingEventIndex=index;

document.getElementById("eventTitle").value=
events[index].title;

document.getElementById("eventDate").value=
events[index].date;

document.getElementById("eventTime").value=
events[index].time;

document.getElementById("eventLocation").value=
events[index].location;

document.getElementById("eventDescription").value=
events[index].description;

saveEvent.innerText="Update Event";

}

if(button.classList.contains("delete-event-btn")){

if(confirm("Delete Event?")){

addActivity(events[index].title+" event deleted.");

events.splice(index,1);

saveEvents();

displayEvents();

updateEventSummary();

}

}

if(button.classList.contains("view-event-btn")){

document.getElementById("viewEventId").innerText=
"E"+String(Number(index)+1).padStart(3,"0");

document.getElementById("viewEventTitle").innerText=
events[index].title;

document.getElementById("viewEventDate").innerText=
events[index].date;

document.getElementById("viewEventTime").innerText=
events[index].time;

document.getElementById("viewEventLocation").innerText=
events[index].location;

document.getElementById("viewEventDescription").innerText=
events[index].description;

document.getElementById("eventModal").style.display="block";

}

});

const closeEventModal =
document.getElementById("closeEventModal");

if(closeEventModal){

closeEventModal.onclick=function(){

document.getElementById("eventModal").style.display="none";

};

}

}

// =========================
// Search Event
// =========================

const searchEvent =
document.getElementById("searchEvent");

if(searchEvent){

searchEvent.addEventListener("keyup",function(){

const value =
this.value.toLowerCase();

document.querySelectorAll("#eventTableBody tr")
.forEach(function(row){

row.style.display=
row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

});

}

// =========================
// Load Parking
// =========================

function loadParking(){

    const savedParking =
    localStorage.getItem("parkingRecords");

    if(savedParking){

        parkingRecords = JSON.parse(savedParking);

    }

}

// =========================
// Save Parking
// =========================

function saveParking(){

    localStorage.setItem(
        "parkingRecords",
        JSON.stringify(parkingRecords)
    );

}

// =========================
// Display Parking
// =========================

function displayParking(){

    const tableBody =
    document.getElementById("parkingTableBody");

    if(!tableBody){

        return;

    }

    tableBody.innerHTML = "";

    parkingRecords.forEach(function(record,index){

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${record.slot}</td>

        <td>${record.vehicleNumber}</td>

        <td>${record.owner}</td>

        <td>${record.flat}</td>

        <td>${record.vehicleType}</td>

       <td>
    <span class="${
        record.status === "Occupied"
            ? "occupied-badge"
            : "vacant-badge"
    }">
        ${record.status}
    </span>
</td>

<td>

<button
class="view-parking-btn"
data-index="${index}">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="edit-parking-btn"
data-index="${index}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-parking-btn"
data-index="${index}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

        `;

        tableBody.appendChild(row);

    });

}

// =========================
// Add Parking
// =========================

const saveParkingBtn =
document.getElementById("saveParking");

if(saveParkingBtn){

    saveParkingBtn.addEventListener("click",function(){

        const slot =
        document.getElementById("parkingSlot").value.trim();

        const vehicleNumber =
        document.getElementById("vehicleNumber").value.trim();

        const owner =
        document.getElementById("ownerName").value.trim();

        const flat =
        document.getElementById("parkingFlat").value.trim();

        const vehicleType =
        document.getElementById("vehicleType").value;

        const status =
        document.getElementById("parkingStatus").value;

        if(
            slot === "" ||
            vehicleNumber === "" ||
            owner === "" ||
            flat === "" ||
            vehicleType === ""
        ){

            alert("Please fill all fields.");

            return;

        }

 // =========================
// Update Parking
// =========================

if (editingParkingIndex !== -1) {

    parkingRecords[editingParkingIndex] = {

        slot: slot,
        vehicleNumber: vehicleNumber,
        owner: owner,
        flat: flat,
        vehicleType: vehicleType,
        status: status

    };

    editingParkingIndex = -1;

    saveParking();

    displayParking();

    addActivity(owner + " parking updated.");

    document.getElementById("parkingSlot").value = "";
    document.getElementById("vehicleNumber").value = "";
    document.getElementById("ownerName").value = "";
    document.getElementById("parkingFlat").value = "";
    document.getElementById("vehicleType").value = "";
    document.getElementById("parkingStatus").value = "Occupied";

    saveParkingBtn.innerText = "Save Parking";

    alert("Parking Updated Successfully!");

    return;

}

        parkingRecords.push({

            slot: slot,
            vehicleNumber: vehicleNumber,
            owner: owner,
            flat: flat,
            vehicleType: vehicleType,
            status: status

        });

        saveParking();

        displayParking();

        addActivity(owner + " parking added.");

        document.getElementById("parkingSlot").value = "";
        document.getElementById("vehicleNumber").value = "";
        document.getElementById("ownerName").value = "";
        document.getElementById("parkingFlat").value = "";
        document.getElementById("vehicleType").value = "";
        document.getElementById("parkingStatus").value = "Occupied";

        alert("Parking Added Successfully!");

    });

}

// =========================
// Edit & Delete Parking
// =========================

const parkingTable =
document.getElementById("parkingTable");

if(parkingTable){

    parkingTable.addEventListener("click",function(event){

        // =========================
        // Edit Parking
        // =========================

        if(event.target.classList.contains("edit-parking-btn")){

            const index = event.target.dataset.index;

            editingParkingIndex = index;

            document.getElementById("parkingSlot").value =
            parkingRecords[index].slot;

            document.getElementById("vehicleNumber").value =
            parkingRecords[index].vehicleNumber;

            document.getElementById("ownerName").value =
            parkingRecords[index].owner;

            document.getElementById("parkingFlat").value =
            parkingRecords[index].flat;

            document.getElementById("vehicleType").value =
            parkingRecords[index].vehicleType;

            document.getElementById("parkingStatus").value =
            parkingRecords[index].status;

            saveParkingBtn.innerText = "Update Parking";

        }

        // =========================
        // Delete Parking
        // =========================

        if(event.target.classList.contains("delete-parking-btn")){

            const index = event.target.dataset.index;

            if(confirm("Are you sure you want to delete this parking record?")){

                const owner =
                parkingRecords[index].owner;

                parkingRecords.splice(index,1);

                saveParking();

                displayParking();

                addActivity(owner + " parking deleted.");

                alert("Parking Deleted Successfully!");

            }

        }

    });

}

// =========================
// Parking View Modal
// =========================

const parkingModal = document.getElementById("parkingModal");
const closeParkingModal = document.getElementById("closeParkingModal");

if (parkingTable) {

    parkingTable.addEventListener("click", function(event){

        const viewBtn = event.target.closest(".view-parking-btn");

        if(viewBtn){

            const index = viewBtn.dataset.index;

            document.getElementById("viewParkingId").innerText =
            "P" + String(Number(index)+1).padStart(3,"0");

            document.getElementById("viewParkingOwner").innerText =
            parkingRecords[index].owner;

            document.getElementById("viewParkingFlat").innerText =
            parkingRecords[index].flat;

            document.getElementById("viewVehicleNo").innerText =
            parkingRecords[index].vehicleNumber;

            document.getElementById("viewVehicleType").innerText =
            parkingRecords[index].vehicleType;

            document.getElementById("viewParkingSlot").innerText =
            parkingRecords[index].slot;

            document.getElementById("viewParkingStatus").innerText =
            parkingRecords[index].status;

            parkingModal.style.display = "block";

        }

    });

}

if(closeParkingModal){

    closeParkingModal.addEventListener("click",function(){

        parkingModal.style.display="none";

    });

}

window.addEventListener("click",function(event){

    if(event.target===parkingModal){

        parkingModal.style.display="none";

    }

});


// =========================
// Search Parking
// =========================

const searchParking = document.getElementById("searchParking");

if (searchParking) {

    searchParking.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const rows = document.querySelectorAll("#parkingTableBody tr");

        rows.forEach(function (row) {

            if (row.innerText.toLowerCase().includes(value)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}

// =========================
// Parking Summary
// =========================

function updateParkingSummary(){

    const totalSlots =
    document.getElementById("totalSlots");

    const occupiedSlots =
    document.getElementById("occupiedSlots");

    const availableSlots =
    document.getElementById("availableSlots");

    if(
        !totalSlots ||
        !occupiedSlots ||
        !availableSlots
    ){
        return;
    }

    let occupied = 0;
    let available = 0;

    parkingRecords.forEach(function(record){

        if(record.status === "Occupied"){

            occupied++;

        }else{

            available++;

        }

    });

    totalSlots.innerText = parkingRecords.length;
    occupiedSlots.innerText = occupied;
    availableSlots.innerText = available;

}

// =========================
// Reports Module
// =========================

function updateReports() {

    const reportResidents = document.getElementById("reportResidents");
    const reportFlats = document.getElementById("reportFlats");
    const reportParking = document.getElementById("reportParking");
    const reportMaintenance = document.getElementById("reportMaintenance");
    const reportTableBody = document.getElementById("reportTableBody");

    // Reports page नसेल तर function बंद
    if (
        !reportResidents ||
        !reportFlats ||
        !reportParking ||
        !reportMaintenance ||
        !reportTableBody
    ) {
        return;
    }

    // Local Storage मधून Data
    const residents =
        JSON.parse(localStorage.getItem("residents")) || [];

    const flats =
        JSON.parse(localStorage.getItem("flats")) || [];

    const parking =
        JSON.parse(localStorage.getItem("parkingRecords")) || [];

    const maintenance =
        JSON.parse(localStorage.getItem("maintenanceRecords")) || [];

    // Total Maintenance Collection
    let totalCollection = 0;

    maintenance.forEach(function(record){

        totalCollection += Number(record.amount) || 0;

    });

    // Summary Cards
    reportResidents.innerText = residents.length;
    reportFlats.innerText = flats.length;
    reportParking.innerText = parking.length;
    reportMaintenance.innerText = "₹" + totalCollection;

    // Table
    reportTableBody.innerHTML = "";

    const reports = [

        ["Residents", residents.length],
        ["Flats", flats.length],
        ["Parking", parking.length],
        ["Maintenance Records", maintenance.length]

    ];

    reports.forEach(function(item){

        reportTableBody.innerHTML += `

        <tr>

            <td>${item[0]}</td>

            <td>${item[1]}</td>

        </tr>

        `;

    });

}

updateReports();

// =========================
// Print Report
// =========================

const printReport =
document.getElementById("printReport");

if(printReport){

    printReport.addEventListener("click",function(){

        window.print();

    });

}

// =========================
// Load Flats
// =========================

function loadFlats(){

    const savedFlats =
    localStorage.getItem("flats");

    if(savedFlats){

        flats = JSON.parse(savedFlats);

    }

}

// =========================
// Save Flats
// =========================

function saveFlats(){

    localStorage.setItem(
        "flats",
        JSON.stringify(flats)
    );

}

// =========================
// Display Flats
// =========================

function displayFlats(){

    const tableBody =
    document.getElementById("flatTableBody");

    if(!tableBody){

        return;

    }
const searchValue =
document.getElementById("searchFlat")?.value.toLowerCase() || "";

const statusFilter =
document.getElementById("filterStatus")?.value || "";

const typeFilter =
document.getElementById("filterType")?.value || "";

    tableBody.innerHTML = "";

    let filteredCount = 0;

flats.forEach(function(flat,index){
const matchSearch =

flat.flatNumber.toLowerCase().includes(searchValue) ||

flat.ownerName.toLowerCase().includes(searchValue);

const matchStatus =

statusFilter === "" ||

flat.status === statusFilter;

const matchType =

typeFilter === "" ||

flat.flatType === typeFilter;

if(

!matchSearch ||

!matchStatus ||

!matchType

){

    return;

}

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>F${String(index+1).padStart(3,"0")}</td>

        <td>${flat.flatNumber}</td>

        <td>${flat.floor}</td>

        <td>${flat.flatType}</td>

        <td>${flat.ownerName}</td>

        <td>

        <span class="${
        flat.status==="Occupied"
        ? "paid-badge"
        : "pending-badge"}">

        ${flat.status}

        </span>

        </td>

<td>

<button
class="view-flat-btn"
data-index="${index}">
View
</button>

<button
class="edit-flat-btn"
data-index="${index}">
Edit
</button>

<button
class="delete-flat-btn"
data-index="${index}">
Delete
</button>

</td>

        `;

        tableBody.appendChild(row);
filteredCount++;
    });
const count =
document.getElementById("filteredFlatCount");

if(count){

    count.innerText =
    filteredCount;

}
    updateFlatSummary();

}


// =========================
// Add Flat
// =========================

const saveFlat =
document.getElementById("saveFlat");

if(saveFlat){

saveFlat.addEventListener("click",function(){

const flatNumber =
document.getElementById("flatNumber").value.trim();

const floor =
document.getElementById("floor").value.trim();

const flatType =
document.getElementById("flatType").value;

const ownerName =
document.getElementById("ownerName").value.trim();

const status =
document.getElementById("flatStatus").value;

if(
flatNumber==="" ||
floor==="" ||
flatType==="" ||
ownerName===""){

alert("Please fill all fields.");

return;

}

// Update

if(editingFlatIndex !== -1){

flats[editingFlatIndex]={

flatNumber,
floor,
flatType,
ownerName,
status

};

editingFlatIndex=-1;

saveFlat.innerText="Save Flat";

saveFlats();

displayFlats();

alert("Flat Updated Successfully!");

return;

}

// Add

flats.push({

flatNumber,
floor,
flatType,
ownerName,
status

});

saveFlats();

displayFlats();

document.getElementById("flatNumber").value="";
document.getElementById("floor").value="";
document.getElementById("flatType").value="";
document.getElementById("ownerName").value="";
document.getElementById("flatStatus").value="Occupied";

alert("Flat Added Successfully!");

});

}

// =========================
// Edit & Delete Flat
// =========================

const flatTable =
document.getElementById("flatTable");

if(flatTable){

flatTable.addEventListener("click",function(event){

// Edit

if(event.target.classList.contains("edit-flat-btn")){

const index =
event.target.dataset.index;

editingFlatIndex=index;

document.getElementById("flatNumber").value=
flats[index].flatNumber;

document.getElementById("floor").value=
flats[index].floor;

document.getElementById("flatType").value=
flats[index].flatType;

document.getElementById("ownerName").value=
flats[index].ownerName;

document.getElementById("flatStatus").value=
flats[index].status;

saveFlat.innerText="Update Flat";

}

// Delete

if(event.target.classList.contains("delete-flat-btn")){

const index=
event.target.dataset.index;

if(confirm("Delete this Flat?")){

flats.splice(index,1);

saveFlats();

displayFlats();

alert("Flat Deleted Successfully!");

}

}

});

}

// =========================
// Flat Filters
// =========================

const searchFlat =
document.getElementById("searchFlat");

const filterStatus =
document.getElementById("filterStatus");

const filterType =
document.getElementById("filterType");

if(searchFlat){

    searchFlat.addEventListener("keyup", displayFlats);

}

if(filterStatus){

    filterStatus.addEventListener("change", displayFlats);

}

if(filterType){

    filterType.addEventListener("change", displayFlats);

}

// =========================
// Flat Summary
// =========================

function updateFlatSummary(){

const totalFlats =
document.getElementById("totalFlats");

const occupiedFlats =
document.getElementById("occupiedFlats");

const vacantFlats =
document.getElementById("vacantFlats");

if(
!totalFlats ||
!occupiedFlats ||
!vacantFlats
){

return;

}

let occupied=0;
let vacant=0;

flats.forEach(function(flat){

if(flat.status==="Occupied"){

occupied++;

}else{

vacant++;

}

});


const total =
flats.length || 1;

const occupiedPercent =
Math.round((occupied / total) * 100);

const vacantPercent =
Math.round((vacant / total) * 100);

const occupiedBadge =
document.getElementById("occupiedPercent");

const vacantBadge =
document.getElementById("vacantPercent");

if(occupiedBadge){

    occupiedBadge.innerText =
    occupiedPercent + "% Occupied";

}

if(vacantBadge){

    vacantBadge.innerText =
    vacantPercent + "% Vacant";

}

animateCounter(
    "totalFlats",
    flats.length
);

animateCounter(
    "occupiedFlats",
    occupied
);

animateCounter(
    "vacantFlats",
    vacant
);

updateFlatChart();

updateFlatPieChart();

updateProgressCircle(

    "occupiedCircle",

    "occupiedProgress",

    occupiedPercent

);

updateProgressCircle(

    "vacantCircle",

    "vacantProgress",

    vacantPercent

);

updateFlatStatusChart();
updateFloorChart();

}

// =========================
// Flat Chart
// =========================

let flatChart = null;
let flatPieChart = null;

function updateFlatChart(){

    const chartCanvas =
    document.getElementById("flatChart");

    if(!chartCanvas){

        return;

    }

    let occupied = 0;
    let vacant = 0;

    flats.forEach(function(flat){

        if(flat.status === "Occupied"){

            occupied++;

        }else{

            vacant++;

        }

    });

    if(flatChart){

        flatChart.destroy();

    }

    flatChart = new Chart(chartCanvas,{

        type:"bar",

        data:{

            labels:[
                "Occupied",
                "Vacant"
            ],

            datasets:[{

                label:"Total Flats",

                data:[
                    occupied,
                    vacant
                ],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ],

                borderRadius:12

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}

function updateFlatPieChart(){

    const chartCanvas =
    document.getElementById("flatPieChart");

    if(!chartCanvas){

        return;

    }

    let occupied = 0;
    let vacant = 0;

    flats.forEach(function(flat){

        if(flat.status === "Occupied"){

            occupied++;

        }else{

            vacant++;

        }

    });

    if(flatPieChart){

        flatPieChart.destroy();

    }

    flatPieChart = new Chart(chartCanvas,{

        type:"pie",

        data:{

            labels:[
                "Occupied",
                "Vacant"
            ],

            datasets:[{

                data:[
                    occupied,
                    vacant
                ],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    position:"bottom"
                }

            }

        }

    });

}

// =========================
// Flat Status Chart
// =========================

let flatStatusChart = null;
let floorChart = null;

// =========================
// Floor Wise Chart
// =========================

function updateFloorChart(){

    const chartCanvas =
    document.getElementById("floorChart");

    if(!chartCanvas){

        return;

    }

    const floorData = {};

    flats.forEach(function(flat){

        const floor = flat.floor;

        if(!floorData[floor]){

            floorData[floor] = 0;

        }

        floorData[floor]++;

    });

    const labels =
    Object.keys(floorData);

    const data =
    Object.values(floorData);

    if(floorChart){

        floorChart.destroy();

    }

    floorChart = new Chart(chartCanvas,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Total Flats",

                data:data,

                backgroundColor:"#4e73df",

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}

// =========================
// Flat Status Donut Chart
// =========================

function updateFlatStatusChart(){

    const chartCanvas =
    document.getElementById("flatStatusChart");

    if(!chartCanvas){

        return;

    }

    let occupied = 0;
    let vacant = 0;

    flats.forEach(function(flat){

        if(flat.status === "Occupied"){

            occupied++;

        }else{

            vacant++;

        }

    });

    if(flatStatusChart){

        flatStatusChart.destroy();

    }

    flatStatusChart = new Chart(chartCanvas,{

        type:"doughnut",

        data:{

            labels:[
                "Occupied",
                "Vacant"
            ],

            datasets:[{

                data:[
                    occupied,
                    vacant
                ],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            cutout:"70%",

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

// =========================
// Flat View Modal
// =========================

const flatModal =
document.getElementById("flatModal");

const closeFlatModal =
document.getElementById("closeFlatModal");

if(flatTable){

flatTable.addEventListener("click",function(event){

if(event.target.classList.contains("view-flat-btn")){

const index =
event.target.dataset.index;

document.getElementById("viewFlatId").innerText =
"F"+String(Number(index)+1).padStart(3,"0");

document.getElementById("viewFlatNumber").innerText =
flats[index].flatNumber;

document.getElementById("viewFloor").innerText =
flats[index].floor;

document.getElementById("viewFlatType").innerText =
flats[index].flatType;

document.getElementById("viewOwner").innerText =
flats[index].ownerName;

document.getElementById("viewFlatStatus").innerText =
flats[index].status;

flatModal.style.display="block";

}

});

}

if(closeFlatModal){

closeFlatModal.addEventListener("click",function(){

flatModal.style.display="none";

});

}

window.addEventListener("click",function(event){

if(event.target===flatModal){

flatModal.style.display="none";

}

});

// =========================
// Load Visitors
// =========================

function loadVisitors(){

    const savedVisitors =
        localStorage.getItem("visitors");

    if(savedVisitors){

        visitors = JSON.parse(savedVisitors);

    }

}

// =========================
// Save Visitors
// =========================

function saveVisitors(){

    localStorage.setItem(
        "visitors",
        JSON.stringify(visitors)
    );

}

// =========================
// Display Visitors
// =========================

function displayVisitors(){

    const visitorTableBody =
        document.getElementById("visitorTableBody");

    if(!visitorTableBody){

        return;

    }

    visitorTableBody.innerHTML = "";

    visitors.forEach(function(visitor,index){

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>V${String(index+1).padStart(3,"0")}</td>

        <td>${visitor.name}</td>

        <td>${visitor.mobile}</td>

        <td>${visitor.flat}</td>

        <td>${visitor.purpose}</td>

<td>

<span class="${visitor.status === "Inside"
? "inside-badge"
: "outside-badge"}">

${visitor.status}

</span>

</td>

<td>

<button class="view-visitor-btn"
data-index="${index}">
View
</button>

<button class="status-visitor-btn"
data-index="${index}">

${visitor.status==="Inside"
? "Check Out"
: "Check In"}

</button>

<button class="edit-visitor-btn"
data-index="${index}">
Edit
</button>

<button class="delete-visitor-btn"
data-index="${index}">
Delete
</button>

        </td>

        `;

        visitorTableBody.appendChild(row);

    });

}

// =========================
// Visitor Summary
// =========================

function updateVisitorSummary(){

    const totalVisitors =
    document.getElementById("totalVisitors");

    const insideVisitors =
    document.getElementById("insideVisitors");

    const outsideVisitors =
    document.getElementById("outsideVisitors");

    if(
        !totalVisitors ||
        !insideVisitors ||
        !outsideVisitors
    ){

        return;

    }

    let inside = 0;
    let outside = 0;

    visitors.forEach(function(visitor){

        if(visitor.status === "Inside"){

            inside++;

        }else{

            outside++;

        }

    });

    totalVisitors.innerText = visitors.length;

    insideVisitors.innerText = inside;

    outsideVisitors.innerText = outside;

}

// =========================
// Add Visitor
// =========================

const saveVisitor =
document.getElementById("saveVisitor");

if(saveVisitor){

saveVisitor.addEventListener("click",function(){

const name =
document.getElementById("visitorName").value.trim();

const mobile =
document.getElementById("visitorMobile").value.trim();

const flat =
document.getElementById("visitorFlat").value.trim();

const purpose =
document.getElementById("visitorPurpose").value;

const inTime =
document.getElementById("visitorInTime").value;

const outTime =
document.getElementById("visitorOutTime").value;

if(
name==="" ||
mobile==="" ||
flat==="" ||
purpose===""
){

alert("Please fill all fields.");

return;

}

// =========================
// Update Visitor
// =========================

if (editingVisitorIndex !== -1) {

    visitors[editingVisitorIndex] = {

        name: name,
        mobile: mobile,
        flat: flat,
        purpose: purpose,
        inTime: inTime,
        outTime: outTime,
        status: visitors[editingVisitorIndex].status

    };

    editingVisitorIndex = -1;

    saveVisitors();
    displayVisitors();
    updateVisitorSummary();

    saveVisitor.innerText = "Save Visitor";

    alert("Visitor Updated Successfully!");

    return;
}

visitors.push({

name:name,
mobile:mobile,
flat:flat,
purpose:purpose,
inTime:inTime,
outTime:outTime,
status:"Inside"

});

saveVisitors();

displayVisitors();

document.getElementById("visitorName").value="";
document.getElementById("visitorMobile").value="";
document.getElementById("visitorFlat").value="";
document.getElementById("visitorPurpose").value="";
document.getElementById("visitorInTime").value="";
document.getElementById("visitorOutTime").value="";

alert("Visitor Added Successfully!");

});

}



// =========================
// Edit & Delete Visitor
// =========================

const visitorTable =
document.getElementById("visitorTable");

if(visitorTable){

visitorTable.addEventListener("click",function(event){

// Edit
if(event.target.classList.contains("edit-visitor-btn")){

const index = event.target.dataset.index;

editingVisitorIndex = index;

document.getElementById("visitorName").value =
visitors[index].name;

document.getElementById("visitorMobile").value =
visitors[index].mobile;

document.getElementById("visitorFlat").value =
visitors[index].flat;

document.getElementById("visitorPurpose").value =
visitors[index].purpose;

document.getElementById("visitorInTime").value =
visitors[index].inTime;

document.getElementById("visitorOutTime").value =
visitors[index].outTime;

saveVisitor.innerText = "Update Visitor";

}
// =========================
// Check In / Check Out
// =========================

if(event.target.classList.contains("status-visitor-btn")){

const index = event.target.dataset.index;

if(visitors[index].status==="Inside"){

visitors[index].status="Outside";

}else{

visitors[index].status="Inside";

}

saveVisitors();

displayVisitors();

}

// Delete
if(event.target.classList.contains("delete-visitor-btn")){

const index = event.target.dataset.index;

if(confirm("Delete this visitor?")){

visitors.splice(index,1);

saveVisitors();

displayVisitors();

alert("Visitor Deleted Successfully!");

}

}

});

}

// =========================
// Visitor View Modal
// =========================

const visitorModal =
document.getElementById("visitorModal");

const closeVisitorModal =
document.getElementById("closeVisitorModal");

if(visitorTable){

visitorTable.addEventListener("click",function(event){

if(event.target.classList.contains("view-visitor-btn")){

const index = event.target.dataset.index;

document.getElementById("viewVisitorId").innerText =
"V"+String(Number(index)+1).padStart(3,"0");

document.getElementById("viewVisitorName").innerText =
visitors[index].name;

document.getElementById("viewVisitorMobile").innerText =
visitors[index].mobile;

document.getElementById("viewVisitorFlat").innerText =
visitors[index].flat;

document.getElementById("viewVisitorPurpose").innerText =
visitors[index].purpose;

document.getElementById("viewVisitorInTime").innerText =
visitors[index].inTime || "-";

document.getElementById("viewVisitorOutTime").innerText =
visitors[index].outTime || "-";

visitorModal.style.display = "block";

}

});

}

if(closeVisitorModal){

closeVisitorModal.addEventListener("click",function(){

visitorModal.style.display = "none";

});

}

window.addEventListener("click",function(event){

if(event.target===visitorModal){

visitorModal.style.display="none";

}

});

// =========================
// Search Visitor
// =========================

const searchVisitor =
document.getElementById("searchVisitor");

if(searchVisitor){

    searchVisitor.addEventListener("keyup",function(){

        const value = this.value.toLowerCase();

        const rows =
        document.querySelectorAll("#visitorTableBody tr");

        rows.forEach(function(row){

            if(row.innerText.toLowerCase().includes(value)){

                row.style.display="";

            }else{

                row.style.display="none";

            }

        });

    });

}

// =========================
// Load Notices
// =========================

function loadNotices(){

    const savedNotices =
        localStorage.getItem("notices");

    if(savedNotices){

        notices = JSON.parse(savedNotices);

    }

}

// =========================
// Load Residents
// =========================

function loadResidents() {

    const savedResidents = localStorage.getItem("residents");

    if (savedResidents) {

        residents = JSON.parse(savedResidents);

    }

}

// =========================
// Load Complaints
// =========================

function loadComplaints() {

    const savedComplaints =
        localStorage.getItem("complaints");

    if (savedComplaints) {

        complaints = JSON.parse(savedComplaints);

    }

}

// =========================
// Save Complaints
// =========================

function saveComplaints() {

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );

}

// =========================
// Save Notices
// =========================

function saveNotices(){

    localStorage.setItem(

        "notices",

        JSON.stringify(notices)

    );

}

// =========================
// Generate Notice ID
// =========================

function generateNoticeId(){

    return "N" +

    String(notices.length + 1)

    .padStart(3,"0");

}



// =========================
// Display Notices
// =========================

function displayNotices(){

    const noticeTableBody =
        document.getElementById("noticeTableBody");

    if(!noticeTableBody){

        return;

    }

    noticeTableBody.innerHTML = "";

    notices.forEach(function(notice,index){

        const row = document.createElement("tr");

row.innerHTML = `

    <td>${notice.id}</td>

    <td>${notice.title}</td>

    <td>${notice.date}</td>

    <td>

        <button
            class="view-btn"
            data-index="${index}">

            View

        </button>

        <button
            class="edit-btn"
            data-index="${index}">

            Edit

        </button>

        <button
            class="delete-btn"
            data-index="${index}">

            Delete

        </button>

    </td>

`;

        noticeTableBody.appendChild(row);

    });

}

// =========================
// Edit & Delete Notice
// =========================

const noticeTable = document.getElementById("noticeTable");

if (noticeTable) {

    noticeTable.addEventListener("click", function (event) {

        // Edit Notice
if(event.target.classList.contains("edit-btn")){

    const index = event.target.dataset.index;

    editingNoticeIndex = index;

    document.getElementById("noticeTitle").value =
    notices[index].title;

    document.getElementById("noticeDate").value =
    notices[index].date;

    document.getElementById("noticeDescription").value =
    notices[index].description;

    saveNotice.innerText = "Update Notice";

}

        // Delete Notice
if(event.target.classList.contains("delete-btn")){

    const index = event.target.dataset.index;

    if(confirm("Are you sure you want to delete this notice?")){

        notices.splice(index,1);

        saveNotices();

        displayNotices();

        alert("Notice Deleted Successfully!");

    }

}

    });

}

// =========================
// Notice View Modal
// =========================

const noticeModal = document.getElementById("noticeModal");
const closeNoticeModal = document.getElementById("closeNoticeModal");

if (noticeTable) {

    noticeTable.addEventListener("click", function (event) {

if(event.target.classList.contains("view-btn")){

    const index = event.target.dataset.index;

    document.getElementById("viewNoticeId").innerText =
    notices[index].id;

    document.getElementById("viewNoticeTitle").innerText =
    notices[index].title;

    document.getElementById("viewNoticeDate").innerText =
    notices[index].date;

    document.getElementById("viewNoticeDescription").innerText =
    notices[index].description;

    noticeModal.style.display = "block";

}

    });

}

if (closeNoticeModal) {

    closeNoticeModal.addEventListener("click", function () {

        noticeModal.style.display = "none";

    });

}

window.addEventListener("click", function (event) {

    if (event.target === noticeModal) {

        noticeModal.style.display = "none";

    }

});

// =========================
// Add Notice
// =========================

const saveNotice =
document.getElementById("saveNotice");

if(saveNotice){

    saveNotice.addEventListener("click",function(){

        const title =
        document.getElementById("noticeTitle").value.trim();

        const date =
        document.getElementById("noticeDate").value;

        const description =
        document.getElementById("noticeDescription").value.trim();

        if(title === "" || date === "" || description === ""){

            alert("Please fill all fields.");

            return;

        }
// =========================
// Update Notice
// =========================

if (editingNoticeIndex !== -1) {

    notices[editingNoticeIndex].title = title;
    notices[editingNoticeIndex].date = date;
    notices[editingNoticeIndex].description = description;

    editingNoticeIndex = -1;

    saveNotices();
    displayNotices();

    document.getElementById("noticeTitle").value = "";
    document.getElementById("noticeDate").value = "";
    document.getElementById("noticeDescription").value = "";

    saveNotice.innerText = "Save Notice";

    alert("Notice Updated Successfully!");

    return;

}
notices.push({

    id: generateNoticeId(),

    title: title,

    date: date,

    description: description

});

        saveNotices();
        displayNotices();

        document.getElementById("noticeTitle").value = "";
        document.getElementById("noticeDate").value = "";
        document.getElementById("noticeDescription").value = "";

        alert("Notice Saved Successfully!");

    });

}

// =========================
// Display Complaints
// =========================

function displayComplaints() {

    console.log("displayComplaints Called");
console.log(complaints);

    const complaintTableBody =
        document.getElementById("complaintTableBody");

    if (!complaintTableBody) {

        return;

    }

    complaintTableBody.innerHTML = "";

    complaints.forEach(function (complaint, index) {
        const selectedStatus =
document.getElementById("filterComplaintStatus")?.value || "";

if(selectedStatus &&
complaint.status !== selectedStatus){

    return;

}

        const row = document.createElement("tr");

     row.innerHTML = `

<td>C00${index+1}</td>

<td>${complaint.resident}</td>

<td>${complaint.flat}</td>

<td>${complaint.title}</td>

<td>

<span class="${
complaint.priority === "High"
? "high-priority"
: complaint.priority === "Medium"
? "medium-priority"
: "low-priority"
}">

${complaint.priority || "Low"}

</span>

</td>

<td>${complaint.date || "-"}</td>

<td>${complaint.time || "-"}</td>

<td>

<span class="${complaint.status === "Solved"
? "solved-badge"
: complaint.status === "In Progress"
? "progress-badge"
: "pending-badge"}">

${complaint.status}

</span>

</td>

<td class="complaint-actions">

    <button class="view-complaint-btn"
        data-index="${index}">
        👁 View
    </button>

    <button class="edit-complaint-btn"
        data-index="${index}">
        ✏ Edit
    </button>

    <button class="delete-complaint-btn"
        data-index="${index}">
        🗑 Delete
    </button>

    <button class="pdf-complaint-btn"
        onclick="downloadComplaintPDF(${index})">
        📄 PDF
    </button>
    <button
class="print-complaint-btn"
onclick="printComplaint(${index})">
🖨 Print
</button>

</td>
        `;

        complaintTableBody.appendChild(row);

    });

    updateComplaintSummary();

}

// =========================
// Complaint Summary
// =========================

function updateComplaintSummary(){

    document.getElementById("totalComplaints").innerText =
    complaints.length;

    const pending =
    complaints.filter(function(complaint){

        return complaint.status === "Pending";

    }).length;

    const progress =
    complaints.filter(function(complaint){

        return complaint.status === "In Progress";

    }).length;

    const solved =
    complaints.filter(function(complaint){

        return complaint.status === "Solved";

    }).length;

    document.getElementById("pendingComplaints").innerText =
    pending;

    document.getElementById("progressComplaints").innerText =
    progress;

    document.getElementById("solvedComplaints").innerText =
    solved;

}

// =========================
// Search Complaint
// =========================

const searchComplaint =
document.getElementById("searchComplaint");

if(searchComplaint){

    searchComplaint.addEventListener("keyup",function(){

        const value =
        this.value.toLowerCase();

        const rows =
        document.querySelectorAll(
        "#complaintTableBody tr"
        );

        rows.forEach(function(row){

            if(row.innerText
            .toLowerCase()
            .includes(value)){

                row.style.display = "";

            }else{

                row.style.display = "none";

            }

        });

    });

}

// =========================
// Filter Complaint
// =========================

const filterComplaintStatus =
document.getElementById("filterComplaintStatus");

if(filterComplaintStatus){

    filterComplaintStatus.addEventListener("change",function(){

        displayComplaints();

    });

}

// =========================
// Add Complaint
// =========================

const saveComplaint =
document.getElementById("saveComplaint");

if (saveComplaint) {

    saveComplaint.addEventListener("click", function () {

        const resident =
        document.getElementById("complaintResident").value.trim();

        const flat =
        document.getElementById("complaintFlat").value.trim();

        const title =
        document.getElementById("complaintTitle").value.trim();

        const description =
        document.getElementById("complaintDescription").value.trim();
const priority =
document.getElementById("complaintPriority").value;

        const status =
        document.getElementById("complaintStatus").value;

        if (
            resident === "" ||
            flat === "" ||
            title === "" ||
            description === ""
        ) {

            alert("Please fill all fields.");

            return;

        }
// =========================
// Update Complaint
// =========================

if (editingComplaintIndex !== -1) {

    complaints[editingComplaintIndex].resident = resident;
    complaints[editingComplaintIndex].flat = flat;
    complaints[editingComplaintIndex].title = title;
    complaints[editingComplaintIndex].description = description;
    complaints[editingComplaintIndex].priority = priority;
    complaints[editingComplaintIndex].status = status;

    editingComplaintIndex = -1;

    saveComplaints();
    displayComplaints();

    document.getElementById("complaintResident").value = "";
    document.getElementById("complaintFlat").value = "";
    document.getElementById("complaintTitle").value = "";
    document.getElementById("complaintDescription").value = "";
    document.getElementById("complaintStatus").value = "Pending";

    saveComplaint.innerText = "Save Complaint";

    alert("Complaint Updated Successfully!");

    return;

}
const now = new Date();

const complaintDate =
now.toLocaleDateString();

const complaintTime =
now.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

complaints.push({

resident:resident,

flat:flat,

title:title,

description:description,

priority:priority,

status:status,

date:complaintDate,

time:complaintTime

});
        console.log(complaints);
displayRecentComplaints();
        saveComplaints();
        displayComplaints();

        document.getElementById("complaintResident").value = "";
        document.getElementById("complaintFlat").value = "";
        document.getElementById("complaintTitle").value = "";
        document.getElementById("complaintDescription").value = "";
        document.getElementById("complaintStatus").value = "Pending";

        alert("Complaint Added Successfully!");

    });

}

// =========================
// Edit & Delete Complaint
// =========================

const complaintTable = document.getElementById("complaintTable");

if (complaintTable) {

    complaintTable.addEventListener("click", function (event) {

        // =========================
        // Edit Complaint
        // =========================

        if (event.target.classList.contains("edit-complaint-btn")) {

            const index = event.target.dataset.index;

            editingComplaintIndex = index;

            document.getElementById("complaintResident").value =
                complaints[index].resident;

            document.getElementById("complaintFlat").value =
                complaints[index].flat;

            document.getElementById("complaintTitle").value =
                complaints[index].title;

            document.getElementById("complaintDescription").value =
                complaints[index].description;

            document.getElementById("complaintStatus").value =
                complaints[index].status;

            saveComplaint.innerText = "Update Complaint";

        }

        // =========================
        // Delete Complaint
        // =========================

        if (event.target.classList.contains("delete-complaint-btn")) {

            const index = event.target.dataset.index;

            const confirmDelete = confirm(
                "Are you sure you want to delete this complaint?"
            );

            if (confirmDelete) {

                complaints.splice(index, 1);

                saveComplaints();
                displayComplaints();

                alert("Complaint Deleted Successfully!");

            }

        }

    });

}

// =========================
// Complaint View Modal
// =========================

const complaintModal =
document.getElementById("complaintModal");

const closeComplaintModal =
document.getElementById("closeComplaintModal");

if (complaintTable) {

    complaintTable.addEventListener("click", function (event) {

        if (event.target.classList.contains("view-complaint-btn")) {

            const index = event.target.dataset.index;

            document.getElementById("viewComplaintId").innerText =
                "C" + String(Number(index) + 1).padStart(3, "0");

            document.getElementById("viewComplaintResident").innerText =
                complaints[index].resident;

            document.getElementById("viewComplaintFlat").innerText =
                complaints[index].flat;

            document.getElementById("viewComplaintTitle").innerText =
                complaints[index].title;

            document.getElementById("viewComplaintDescription").innerText =
                complaints[index].description;

const priorityElement =
document.getElementById("viewComplaintPriority");

priorityElement.innerText =
complaints[index].priority || "Low";

priorityElement.className = "";

if(complaints[index].priority === "High"){

    priorityElement.classList.add("high-priority");

}
else if(complaints[index].priority === "Medium"){

    priorityElement.classList.add("medium-priority");

}
else{

    priorityElement.classList.add("low-priority");

}
            document.getElementById("viewComplaintStatus").innerText =
                complaints[index].status;
                document.getElementById("viewComplaintDate").innerText =
complaints[index].date || "-";

document.getElementById("viewComplaintTime").innerText =
complaints[index].time || "-";

            complaintModal.style.display = "block";

        }

    });

}

if (closeComplaintModal) {

    closeComplaintModal.addEventListener("click", function () {

        complaintModal.style.display = "none";

    });

}

window.addEventListener("click", function (event) {

    if (event.target === complaintModal) {

        complaintModal.style.display = "none";

    }

});

// =========================
// Download Professional Complaint PDF
// =========================

async function downloadComplaintPDF(index){

    const complaint = complaints[index];

    if(!complaint){

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const logo =
document.getElementById("societyLogo");

if(logo.complete){

    const canvas =
    document.createElement("canvas");

    canvas.width =
    logo.naturalWidth;

    canvas.height =
    logo.naturalHeight;

    const ctx =
    canvas.getContext("2d");

    ctx.drawImage(
        logo,
        0,
        0
    );

    const imgData =
    canvas.toDataURL("image/png");

    doc.addImage(
        imgData,
        "PNG",
        15,
        15,
        22,
        22
    );

}

    // =========================
    // Border
    // =========================

    doc.setDrawColor(11,77,162);
    doc.setLineWidth(1);
    doc.rect(10,10,190,277);

    // =========================
    // Header
    // =========================

    doc.setFont("helvetica","bold");
    doc.setFontSize(22);
    doc.setTextColor(11,77,162);
doc.text(
"SHIV APARTMENT",
48,
22
);
    doc.setFontSize(11);
    doc.setTextColor(80);

 doc.text(
"S.R. NO.116/6A, Plot No.01, Palaspe, Panvel, Raigad - 410206",
48,
30
);
    doc.text(
"Phone : +91 9619751999",
48,
37
);

    doc.text(
"Email : shivapartment@gmail.com",
48,
44
);

    doc.setDrawColor(180);
    doc.line(20,52,190,52);

    // =========================
    // Report Title
    // =========================

    doc.setFontSize(17);
    doc.setTextColor(0);
    doc.text("Complaint Report",70,65);

    // =========================
    // Complaint Details
    // =========================

    doc.setFontSize(12);

    let y = 82;

    doc.text("Complaint ID :",20,y);
    doc.text("C00"+(index+1),75,y);

    y += 12;

    doc.text("Resident :",20,y);
    doc.text(complaint.resident,75,y);

    y += 12;

    doc.text("Flat :",20,y);
    doc.text(complaint.flat,75,y);

    y += 12;

    doc.text("Issue :",20,y);
    doc.text(complaint.title,75,y);

    y += 12;

    doc.text("Description :",20,y);

    doc.text(
        complaint.description,
        75,
        y,
        {
            maxWidth:100
        }
    );

    y += 22;

    doc.text("Priority :",20,y);
    doc.text(
        complaint.priority || "Low",
        75,
        y
    );

    y += 12;

    doc.text("Status :",20,y);
    doc.text(
        complaint.status,
        75,
        y
    );

    y += 12;

    doc.text("Complaint Date :",20,y);
    doc.text(
        complaint.date || "-",
        75,
        y
    );

    y += 12;

    doc.text("Complaint Time :",20,y);
    doc.text(
        complaint.time || "-",
        75,
        y
    );

    // =========================
    // Generation Date
    // =========================

    y += 22;

    doc.setFont("helvetica","italic");

    doc.text(
        "Generated On : " +
        new Date().toLocaleString(),
        20,
        y
    );

    // =========================
    // Signature
    // =========================

    doc.line(135,245,185,245);

    doc.setFont("helvetica","bold");

    doc.text(
        "Authorized Signature",
        135,
        253
    );

    // =========================
    // Footer
    // =========================

    doc.setFontSize(10);

    doc.setTextColor(120);

    doc.text(
        "Generated by Shiv Apartment Society Management System",
        25,
        280
    );

    // =========================
    // Save PDF
    // =========================

    doc.save(
        "Complaint_C00" +
        (index+1) +
        ".pdf"
    );

}

// =========================
// Print Complaint
// =========================

function printComplaint(index){

    const complaint = complaints[index];

    if(!complaint){

        return;

    }

    const printWindow = window.open("","","width=900,height=700");

    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>Complaint Report</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

@page{
    size:A4;
    margin:10mm;
}

body{

    font-family:Arial,sans-serif;
    color:#222;
    background:#fff;

}

.receipt{

    width:100%;
    border:2px solid #0B4DA2;
    border-radius:8px;
    padding:18px;

}

.header{

    text-align:center;
    border-bottom:2px solid #0B4DA2;
    padding-bottom:12px;
    margin-bottom:15px;

}

.header img{

    width:55px;
    height:55px;
    object-fit:contain;

}

.header h1{

    font-size:30px;
    color:#0B4DA2;
    margin:8px 0 5px;

}

.header p{

    font-size:13px;
    margin:3px 0;

}

.report-title{

    text-align:center;
    font-size:22px;
    font-weight:bold;
    margin:15px 0;

}

table{

    width:100%;
    border-collapse:collapse;
    margin-top:10px;

}

table td{

    border:1px solid #ddd;
    padding:10px;
    font-size:14px;

}

table td:first-child{

    width:35%;
    background:#f4f7fb;
    font-weight:bold;

}

.footer{

    margin-top:30px;
    display:flex;
    justify-content:space-between;
    align-items:flex-end;

}

.generated{

    font-size:13px;

}

.signature{

    text-align:center;
    width:180px;

}

.signature-line{

    border-top:1px solid #000;
    margin-bottom:6px;

}

.footer-note{

    margin-top:25px;
    text-align:center;
    font-size:12px;
    color:#666;
    border-top:1px solid #ddd;
    padding-top:10px;

}

</style>

</head>

<body>

<div class="receipt">

<div class="header">

<img src="../images/logo.png">

<h1>SHIV APARTMENT</h1>

<p>S.R. No. 116/6A, Plot No. 01
Palaspe, Panvel, Raigad - 410206</p>

<p>📞 +91 9619751999</p>

<p>✉ shivapartment@gmail.com</p>

</div>

<div class="report-title">

Complaint Report

</div>

<table>

<tr>

<td><b>Complaint ID</b></td>

<td>C00${index+1}</td>

</tr>

<tr>

<td><b>Resident</b></td>

<td>${complaint.resident}</td>

</tr>

<tr>

<td><b>Flat</b></td>

<td>${complaint.flat}</td>

</tr>

<tr>

<td><b>Issue</b></td>

<td>${complaint.title}</td>

</tr>

<tr>

<td><b>Description</b></td>

<td>${complaint.description}</td>

</tr>

<tr>

<td><b>Priority</b></td>

<td>${complaint.priority || "Low"}</td>

</tr>

<tr>

<td><b>Status</b></td>

<td>${complaint.status}</td>

</tr>

<tr>

<td><b>Date</b></td>

<td>${complaint.date || "-"}</td>

</tr>

<tr>

<td><b>Time</b></td>

<td>${complaint.time || "-"}</td>

</tr>

</table>

<div class="footer">

<div class="generated">

<b>Generated On :</b><br>

${new Date().toLocaleString()}

</div>

<div class="signature">

<div class="signature-line"></div>

Authorized Signature

</div>

</div>

<div class="footer-note">

Generated by <b>Shiv Apartment Society Management System</b>

<br><br>

This is a computer generated report.

</div>

</div>

<script>

window.onload = function () {

    setTimeout(function () {

        window.print();

        window.onafterprint = function () {
            window.close();
        };

    }, 500);

};

</script>

</body>

</html>

`);

    printWindow.document.close();

}

// =========================
// Load Maintenance
// =========================

function loadMaintenance() {

    const savedMaintenance =
        localStorage.getItem("maintenanceRecords");

    if (savedMaintenance) {

        maintenanceRecords =
            JSON.parse(savedMaintenance);

    }

}

// =========================
// Load Activities
// =========================

function loadActivities() {

    const savedActivities = localStorage.getItem("activities");

    if (savedActivities) {

        activities = JSON.parse(savedActivities);

    }

}


// =========================
// Save Maintenance
// =========================

function saveMaintenance() {

    localStorage.setItem(
        "maintenanceRecords",
        JSON.stringify(maintenanceRecords)
    );

}

// =========================
// Save Activities
// =========================

function saveActivities() {

    localStorage.setItem("activities", JSON.stringify(activities));

}

// =========================
// Add Activity
// =========================

function addActivity(message) {

    const now = new Date();

    const time = now.toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit"

    });

    activities.unshift({

        time: time,

        message: message

    });

    // फक्त शेवटच्या 10 Activities ठेवायच्या
    if (activities.length > 10) {

        activities.pop();

    }

    saveActivities();

    displayActivities();

}

// =========================
// Display Activities
// =========================

function displayActivities() {

    const activityList = document.getElementById("activityList");

    if (!activityList) {

        return;

    }

    activityList.innerHTML = "";

    activities.forEach(function(activity){

        const li = document.createElement("li");

        li.innerHTML = `<strong>${activity.time}</strong> - ${activity.message}`;

        activityList.appendChild(li);

    });

}



// =========================
// Maintenance Summary
// =========================

function updateMaintenanceSummary() {

    const totalCollection =
        document.getElementById("totalCollection");

    const pendingCollection =
        document.getElementById("pendingCollection");

    const paidResidents =
        document.getElementById("paidResidents");

    const unpaidResidents =
        document.getElementById("unpaidResidents");

    if (
        !totalCollection ||
        !pendingCollection ||
        !paidResidents ||
        !unpaidResidents
    ) {
        return;
    }

    let totalAmount = 0;
    let pendingAmount = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    const selectedMonth =
document.getElementById("filterMonth")?.value || "";

    maintenanceRecords.forEach(function(record){

        if(selectedMonth && record.month !== selectedMonth){

    return;

}

        const amount = Number(record.amount);

        if(record.status === "Paid"){

            totalAmount += amount;
            paidCount++;

        } else {

            pendingAmount += amount;
            unpaidCount++;

        }

    });

    totalCollection.innerText =
        "₹" + totalAmount.toLocaleString("en-IN");

    pendingCollection.innerText =
        "₹" + pendingAmount.toLocaleString("en-IN");

    paidResidents.innerText = paidCount;

    unpaidResidents.innerText = unpaidCount;

    updateMaintenanceChart();
    updateMaintenancePieChart();
    updateMaintenanceTrendChart();
}

// =========================
// Maintenance Chart
// =========================

let maintenanceChart = null;
let maintenancePieChart = null;
let maintenanceTrendChart = null;

function updateMaintenanceChart() {
console.log("Maintenance Chart Called");

    const chartCanvas =
        document.getElementById("maintenanceChart");

        console.log(chartCanvas);

    if (!chartCanvas) {
        return;
    }

 console.log("Canvas Found");
    let paidAmount = 0;
    let pendingAmount = 0;

    maintenanceRecords.forEach(function(record){

        const amount = Number(record.amount);

        if(record.status === "Paid"){

            paidAmount += amount;

        }else{

            pendingAmount += amount;

        }

    });

    if(maintenanceChart){

        maintenanceChart.destroy();

    }

    maintenanceChart = new Chart(chartCanvas,{

        type:"bar",

        data:{

            labels:["Paid","Pending"],

            datasets:[{

                label:"Maintenance Amount (₹)",

                data:[paidAmount,pendingAmount],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}

// =========================
// Monthly Collection Trend Chart
// =========================

function updateMaintenanceTrendChart() {

    const trendCanvas =
        document.getElementById("maintenanceTrendChart");

    if (!trendCanvas) {

        return;

    }

    const monthlyData = {};

    maintenanceRecords.forEach(function(record){

        const month = record.month || "Unknown";

        if(!monthlyData[month]){

            monthlyData[month] = 0;

        }

        if(record.status === "Paid"){

            monthlyData[month] += Number(record.amount);

        }

    });

    const labels = Object.keys(monthlyData);
    const data = Object.values(monthlyData);

    if(maintenanceTrendChart){

        maintenanceTrendChart.destroy();

    }

    maintenanceTrendChart = new Chart(trendCanvas,{

        type:"line",

        data:{

            labels: labels,

            datasets:[{

                label:"Monthly Collection (₹)",

                data:data,

                borderColor:"#4e73df",

                backgroundColor:"rgba(78,115,223,0.15)",

                fill:true,

                tension:0.4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:true
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}

// =========================
// Maintenance Pie Chart
// =========================

function updateMaintenancePieChart() {

    const chartCanvas =
        document.getElementById("maintenancePieChart");

    if (!chartCanvas) {

        return;

    }

    let paid = 0;
    let pending = 0;

    maintenanceRecords.forEach(function(record){

        if(record.status === "Paid"){

            paid++;

        }else{

            pending++;

        }

    });

    if(maintenancePieChart){

        maintenancePieChart.destroy();

    }

    maintenancePieChart = new Chart(chartCanvas,{

        type:"pie",

        data:{

            labels:["Paid","Pending"],

            datasets:[{

                data:[paid,pending],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

// =========================
// Recent Maintenance (Dashboard)
// =========================

function displayRecentMaintenance() {

    const tableBody =
        document.getElementById("recentMaintenanceBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    const recentRecords =
        maintenanceRecords.slice(-5).reverse();

    recentRecords.forEach(function(record){

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${record.owner}</td>
            <td>${record.flat}</td>
            <td>₹${record.amount}</td>
<td>

    <span class="${record.status === 'Paid' ? 'paid-badge' : 'pending-badge'}">

        ${record.status}

    </span>

</td>
        `;

        tableBody.appendChild(row);

    });

}

// =========================
// Recent Complaints (Dashboard)
// =========================

function displayRecentComplaints() {

    const tableBody =
        document.getElementById("recentComplaintBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    const recentComplaints =
        complaints.slice(-5).reverse();

    recentComplaints.forEach(function (complaint, index) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>C${String(index + 1).padStart(3, "0")}</td>
            <td>${complaint.resident}</td>
            <td>${complaint.title}</td>

            <td>
                <span class="${
                    complaint.status === "Solved"
                        ? "solved"
                        : complaint.status === "In Progress"
                        ? "progress"
                        : "pending"
                }">
                    ${complaint.status}
                </span>
            </td>

        `;

        tableBody.appendChild(row);

    });

}

// =========================
// Display Maintenance
// =========================

function displayMaintenance(){

    const tableBody =
        document.getElementById("maintenanceTableBody");

    if(!tableBody){

        return;

    }

    tableBody.innerHTML = "";

const selectedMonth =
document.getElementById("filterMonth")?.value || "";

    maintenanceRecords.forEach(function(record,index){

        if(selectedMonth && record.month !== selectedMonth){

    return;

}

        const row = document.createElement("tr");

        row.innerHTML = `

           <td>M00${index+1}</td>

<td>${record.owner}</td>

<td>${record.flat}</td>

<td>${record.month || "-"}</td>

<td>₹${record.amount}</td>

<td>

<span class="${record.status === 'Paid'
? 'paid-badge'
: 'pending-badge'}">

${record.status}

</span>

</td>
<td>
    <div class="action-buttons">

        <button class="view-btn" data-index="${index}">
            <i class="fa-solid fa-eye"></i> View
        </button>

        <button class="edit-btn" data-index="${index}">
            <i class="fa-solid fa-pen"></i> Edit
        </button>

        <button class="delete-btn" data-index="${index}">
            <i class="fa-solid fa-trash"></i> Delete
        </button>

        <button class="receipt-btn" onclick="generateReceipt(${index})">
            <i class="fa-solid fa-file-invoice"></i> Receipt
        </button>

    </div>
</td>

        `;

        tableBody.appendChild(row);

    });

}

// =========================
// Generate Receipt
// =========================

function generateReceipt(index){

    const record = maintenanceRecords[index];

    if(!record){
        return;
    }

    const year = new Date().getFullYear();

const receiptNumber =
String(index + 1).padStart(4,"0");

document.getElementById("receiptNo").innerText =
`RCP-${year}-${receiptNumber}`;

    document.getElementById("receiptResident").innerText =
    record.owner;

    document.getElementById("receiptFlat").innerText =
    record.flat;

    document.getElementById("receiptAmount").innerText =
    record.amount;

    document.getElementById("receiptStatus").innerText =
    record.status;
    const stamp =
document.getElementById("paidStamp");

if(record.status === "Paid"){

stamp.innerHTML = "PAID";

stamp.style.color = "green";

}else{

stamp.innerHTML = "PENDING";

stamp.style.color = "red";

}

    document.getElementById("receiptDate").innerText =
    new Date().toLocaleDateString();

    const qrBox =
document.getElementById("qrcode");

qrBox.innerHTML = "";

new QRCode(qrBox,{
    text: `RCP:${document.getElementById("receiptNo").innerText}
Flat:${record.flat}
Amt:${record.amount}`,
    width:120,
    height:120
});

    document.getElementById("receiptModal").style.display =
    "block";

}

// =========================
// Close Receipt Modal
// =========================

const closeReceipt =
document.getElementById("closeReceipt");

if(closeReceipt){

    closeReceipt.addEventListener("click",function(){

        document.getElementById("receiptModal").style.display =
        "none";

    });

}

window.addEventListener("click",function(e){

    const modal =
    document.getElementById("receiptModal");

    if(e.target === modal){

        modal.style.display = "none";

    }

});

// =========================
// Print Receipt
// =========================

const printReceipt =
document.getElementById("printReceipt");

if(printReceipt){

    printReceipt.addEventListener("click",function(){

        const receipt =
        document.getElementById("receiptContent").innerHTML;

        const printWindow =
        window.open("","","width=800,height=700");

        printWindow.document.write(`

<html>

<head>

<title>Maintenance Receipt</title>

<style>

body{

font-family:Arial,sans-serif;

padding:30px;

}

.receipt{

max-width:600px;

margin:auto;

border:2px solid #333;

padding:25px;

border-radius:10px;

}

h2,h3{

text-align:center;

margin:5px;

}

hr{

margin:15px 0;

}

p{

font-size:18px;

margin:10px 0;

}

.footer{

text-align:center;

margin-top:30px;

font-weight:bold;

}

</style>

</head>

<body>

<div class="receipt">

${receipt}

</div>

</body>

</html>

`);

printWindow.document.close();

printWindow.focus();

// Print after page fully loads
printWindow.onload = function(){

    printWindow.print();

};

// Close print window after printing
printWindow.onafterprint = function(){

    printWindow.close();

};

    });

}


// =========================
// Search Maintenance
// =========================

const searchMaintenance =
document.getElementById("searchMaintenance");

if(searchMaintenance){

    searchMaintenance.addEventListener("keyup",function(){

        const search =
        this.value.toLowerCase();

        const rows =
        document.querySelectorAll("#maintenanceTableBody tr");

        rows.forEach(function(row){

            const text =
            row.innerText.toLowerCase();

            if(text.includes(search)){

                row.style.display = "";

            }else{

                row.style.display = "none";

            }

        });

    });

}

// =========================
// Add Maintenance
// =========================

const saveMaintenanceBtn =
document.getElementById("saveMaintenance");

if(saveMaintenanceBtn){

    saveMaintenanceBtn.addEventListener("click",function(){

        const owner =
        document.getElementById("ownerName").value.trim();

        const flat =
        document.getElementById("flatNo").value.trim();

        const amount =
        document.getElementById("maintenanceAmount").value.trim();

const month =
document.getElementById("maintenanceMonth").value;

        const status =
        document.getElementById("paymentStatus").value;

if(owner==="" || flat==="" || amount==="" || month===""){
            alert("Please fill all fields.");

            return;

        }


// =========================
// Update Maintenance
// =========================

if (editingMaintenanceIndex !== -1) {

    maintenanceRecords[editingMaintenanceIndex].owner = owner;
    maintenanceRecords[editingMaintenanceIndex].flat = flat;
    maintenanceRecords[editingMaintenanceIndex].month = month;
    maintenanceRecords[editingMaintenanceIndex].amount = amount;
    maintenanceRecords[editingMaintenanceIndex].status = status;

    editingMaintenanceIndex = -1;

    saveMaintenance();
    displayMaintenance();
    updateMaintenanceSummary();

    addActivity(owner + " maintenance updated.");

    document.getElementById("ownerName").value = "";
    document.getElementById("flatNo").value = "";
    document.getElementById("maintenanceAmount").value = "";
    document.getElementById("paymentStatus").value = "Paid";

saveMaintenanceBtn.innerText = "Save Maintenance";

alert("✅ Maintenance Updated Successfully!");
    return;
}

        maintenanceRecords.push({

    owner: owner,
    flat: flat,
    month: month,
    amount: amount,
    status: status

});

        addActivity(owner + " maintenance added.");

        saveMaintenance();

displayMaintenance();

updateMaintenanceSummary();

document.getElementById("ownerName").value = "";
document.getElementById("flatNo").value = "";
document.getElementById("maintenanceAmount").value = "";
document.getElementById("paymentStatus").value = "Paid";

alert("✅ Maintenance Added Successfully!");
    });

}

// =========================
// Maintenance View Modal
// =========================

const maintenanceModal =
document.getElementById("maintenanceModal");

const closeMaintenanceModal =
document.getElementById("closeMaintenanceModal");

// =========================
// Edit & Delete Maintenance
// =========================

const maintenanceTable =
document.getElementById("maintenanceTable");

if(maintenanceTable){

    maintenanceTable.addEventListener("click",function(event){

        if(event.target.classList.contains("view-btn")){

    const index = event.target.dataset.index;

    document.getElementById("viewMaintenanceId").innerText =
    "M00" + (Number(index) + 1);

    document.getElementById("viewMaintenanceOwner").innerText =
    maintenanceRecords[index].owner;

    document.getElementById("viewMaintenanceFlat").innerText =
    maintenanceRecords[index].flat;

    document.getElementById("viewMaintenanceAmount").innerText =
    "₹" + maintenanceRecords[index].amount;

    document.getElementById("viewMaintenanceStatus").innerText =
    maintenanceRecords[index].status;

    maintenanceModal.style.display = "block";

}

        if(event.target.classList.contains("edit-btn")){

            const index = event.target.dataset.index;

            editingMaintenanceIndex = index;

            document.getElementById("ownerName").value =
            maintenanceRecords[index].owner;

            document.getElementById("flatNo").value =
            maintenanceRecords[index].flat;

            document.getElementById("maintenanceMonth").value =
maintenanceRecords[index].month;

            document.getElementById("maintenanceAmount").value =
            maintenanceRecords[index].amount;

            document.getElementById("paymentStatus").value =
            maintenanceRecords[index].status;

            saveMaintenanceBtn.innerText = "Update Maintenance";

        }

        if(event.target.classList.contains("delete-btn")){

            const index = event.target.dataset.index;

            const confirmDelete = confirm(
                "Are you sure you want to delete this maintenance record?"
            );

            if(confirmDelete){

                maintenanceRecords.splice(index,1);

                saveMaintenance();

                displayMaintenance();

                updateMaintenanceSummary();

alert("🗑️ Maintenance Deleted Successfully!");
            }

        }

    });

}

// =========================
// Close Maintenance Modal
// =========================

if(closeMaintenanceModal){

    closeMaintenanceModal.addEventListener("click", function(){

        maintenanceModal.style.display = "none";

    });

}

window.addEventListener("click", function(event){

    if(event.target === maintenanceModal){

        maintenanceModal.style.display = "none";

    }

});

// =========================
// Export Maintenance CSV
// =========================

const exportMaintenance =
document.getElementById("exportMaintenance");

if(exportMaintenance){

    exportMaintenance.addEventListener("click",function(){

        if(maintenanceRecords.length === 0){

            alert("No Maintenance Records Found!");

            return;

        }

        let csv =
"ID,Resident,Flat,Amount,Status\n";

        maintenanceRecords.forEach(function(record,index){

            csv +=
`M00${index+1},${record.owner},${record.flat},${record.amount},${record.status}\n`;

        });

        const blob = new Blob([csv],{

            type:"text/csv;charset=utf-8;"

        });

        const url =
        URL.createObjectURL(blob);

        const link =
        document.createElement("a");

        link.href = url;

        link.download = "Maintenance.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        alert("Maintenance CSV Exported Successfully!");

    });

}

// =========================
// Import Maintenance CSV
// =========================

const importMaintenance =
document.getElementById("importMaintenance");

const importMaintenanceBtn =
document.getElementById("importMaintenanceBtn");

if(importMaintenanceBtn && importMaintenance){

    importMaintenanceBtn.addEventListener("click",function(){

        const file = importMaintenance.files[0];

        if(!file){

            alert("Please select a CSV file.");

            return;

        }

        const reader = new FileReader();

        reader.onload = function(e){

            const csv = e.target.result;

            const rows = csv.trim().split("\n");

            // Header Remove
            rows.shift();

            maintenanceRecords = [];

            rows.forEach(function(row){

                const data = row.split(",");

                maintenanceRecords.push({

                    owner: data[1],
                    flat: data[2],
                    amount: data[3],
                    status: data[4]

                });

            });

            saveMaintenance();

            displayMaintenance();

            updateMaintenanceSummary();

            addActivity("Maintenance records imported from CSV.");

            importMaintenance.value = "";

            alert("Maintenance Imported Successfully!");

        };

        reader.readAsText(file);

    });

}

// =========================
// Maintenance Month Filter
// =========================

const filterMonth =
document.getElementById("filterMonth");

if(filterMonth){

    filterMonth.addEventListener("change", function(){

        displayMaintenance();

        updateMaintenanceSummary();

    });

}

// =========================
// Residents Data
// =========================

let residents =
JSON.parse(localStorage.getItem("residents")) || [];

let editingIndex = -1;

// =========================
// Current Resident
// =========================

let currentResident = null;

// =========================
// Resident Photo
// =========================

let residentPhotoData = "";

const residentPhoto =
document.getElementById("residentPhoto");

const photoPreview =
document.getElementById("photoPreview");

if(residentPhoto){

    residentPhoto.addEventListener("change",function(){

        const file =
        this.files[0];

        if(!file){

            return;

        }

        const reader =
        new FileReader();

        reader.onload = function(event){

            residentPhotoData =
            event.target.result;

            photoPreview.src =
            residentPhotoData;

        };

        reader.readAsDataURL(file);

    });

}

// =========================
// Save Residents
// =========================

function saveResidents(){

    localStorage.setItem(

        "residents",

        JSON.stringify(residents)

    );

}

// =========================
// Generate Resident ID
// =========================

function generateResidentId(){

    return "R" +

    String(residents.length + 1)

    .padStart(3,"0");

}

// =========================
// Save Resident
// =========================

const saveResident =
document.getElementById("saveResident");

if(saveResident){

    saveResident.addEventListener("click",function(){

        const name =
        document.getElementById("residentName").value.trim();

        const flat =
        document.getElementById("flatNumber").value.trim();

        const mobile =
        document.getElementById("mobileNumber").value.trim();

        const email =
        document.getElementById("email").value.trim();

        const family =
        document.getElementById("familyMembers").value.trim();

        const status =
        document.getElementById("residentStatus").value;

        const isEditing = editingIndex !== -1;
        // =========================
        // Validation
        // =========================

        if(

            name === "" ||

            flat === "" ||

            mobile === ""

        ){

            alert("Please fill all required fields.");

            return;

        }

// =========================
// Add / Update Resident
// =========================

if(!isEditing){

residents.push({

    id:generateResidentId(),

    name:name,

    flat:flat,

    mobile:mobile,

    email:email,

    familyMembers:family,

    status:status,

    photo:residentPhotoData

});

}else{

residents[editingIndex] = {

    id:residents[editingIndex].id,

    name:name,

    flat:flat,

    mobile:mobile,

    email:email,

    familyMembers:family,

    status:status,

    photo:
    residentPhotoData ||

    residents[editingIndex].photo

};

    editingIndex = -1;

}

        // =========================
        // Save Data
        // =========================

        saveResidents();
        displayResidents();

        // =========================
        // Clear Form
        // =========================

        document.getElementById("residentName").value = "";

        document.getElementById("flatNumber").value = "";

        document.getElementById("mobileNumber").value = "";

        document.getElementById("email").value = "";

        document.getElementById("familyMembers").value = "";

        document.getElementById("residentStatus").value = "Active";

        residentPhotoData = "";

if(photoPreview){

    photoPreview.src =
    "../images/default-user.png";

}

if(residentPhoto){

    residentPhoto.value = "";

}

        // =========================
        // Success Message
        // =========================

if(isEditing){

    alert("Resident Updated Successfully!");

}else{

    alert("Resident Added Successfully!");

}
    });

}

// =========================
// Resident View Modal
// =========================

const residentModal =
document.getElementById("residentModal");

const closeModal =
document.getElementById("closeModal");


// =========================
// Display Residents
// =========================

function displayResidents(){

    const residentTableBody =
    document.getElementById("residentTableBody");

    if(!residentTableBody){

        return;

    }

    residentTableBody.innerHTML = "";

    residents.forEach(function(resident,index){

        const row =
        document.createElement("tr");

        row.innerHTML = `

            <td>${resident.id}</td>

            <td>${resident.name}</td>

            <td>${resident.flat}</td>

            <td>${resident.mobile}</td>

            <td>${resident.status}</td>

            <td>

                <button
                    class="view-btn"
                    data-index="${index}">

                    View

                </button>

                <button
                    class="edit-btn"
                    data-index="${index}">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    data-index="${index}">

                    Delete

                </button>

            </td>

        `;

        residentTableBody.appendChild(row);
        const editBtn =
row.querySelector(".edit-btn");

editBtn.addEventListener("click",function(){

    editingIndex = index;

    document.getElementById("residentName").value =
    resident.name;

    document.getElementById("flatNumber").value =
    resident.flat;

    document.getElementById("mobileNumber").value =
    resident.mobile;

    document.getElementById("email").value =
    resident.email;

    document.getElementById("familyMembers").value =
    resident.familyMembers;

    document.getElementById("residentStatus").value =
    resident.status;

});

const deleteBtn =
row.querySelector(".delete-btn");

deleteBtn.addEventListener("click",function(){

    if(confirm("Are you sure you want to delete this resident?")){

        residents.splice(index,1);

        saveResidents();

        displayResidents();

        alert("Resident Deleted Successfully!");

    }


});

const viewBtn =
row.querySelector(".view-btn");

viewBtn.addEventListener("click",function(){

    document.getElementById("viewId").innerText =
    resident.id;

    document.getElementById("viewName").innerText =
    resident.name;

    document.getElementById("viewFlat").innerText =
    "Flat : " + resident.flat;

    document.getElementById("viewMobile").innerText =
    resident.mobile;

    document.getElementById("viewEmail").innerText =
    resident.email;

    document.getElementById("viewFamily").innerText =
    resident.familyMembers;

const statusBadge =
document.getElementById("viewStatus");

statusBadge.innerText =
resident.status;

statusBadge.className =
"status-badge";

if(resident.status === "Active"){

    statusBadge.classList.add(
        "status-active"
    );

}else{

    statusBadge.classList.add(
        "status-inactive"
    );

}

    const viewPhoto =
    document.getElementById("viewPhoto");

    viewPhoto.src =
    resident.photo
    ? resident.photo
    : "../images/default-user.png";

    currentResident = resident;
    residentModal.style.display = "block";

});


    });

}

const closeResidentBtn =
document.getElementById("closeResidentBtn");

if(closeResidentBtn){

    closeResidentBtn.addEventListener("click",function(){

        residentModal.style.display = "none";

    });

}

window.addEventListener("click",function(event){

    if(event.target === residentModal){

        residentModal.style.display = "none";

    }

});

// =========================
// Print Resident
// =========================

const printResident =
document.getElementById("printResident");

if(printResident){

    printResident.addEventListener("click",function(){

        if(!currentResident){

            return;

        }

        const printWindow =
        window.open(
            "",
            "",
            "width=900,height=700"
        );

        printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<h1>🏢 Shiv Apartment</h1>

<p>Society Management System</p>

<hr>

<h2>Resident Profile</h2>

<style>

body{

font-family:Arial,sans-serif;
padding:40px;
color:#333;

}

.header{

text-align:center;
margin-bottom:30px;

}

.header img{

width:130px;
height:130px;
border-radius:50%;
object-fit:cover;
border:4px solid #0B4DA2;

}

h1{

color:#0B4DA2;

}

table{

width:100%;
border-collapse:collapse;
margin-top:20px;

}

table th,
table td{

border:1px solid #ddd;
padding:12px;
text-align:left;

}

table th{

background:#0B4DA2;
color:#fff;
width:35%;

}

.footer{

margin-top:40px;
text-align:center;
font-size:14px;
color:#666;

}

</style>

</head>

<body>

<div class="header">

<img src="${
currentResident.photo ||
'../images/default-user.png'
}">

<h1>Resident Profile</h1>

</div>

<p>

<b>Print Date :</b>

${new Date().toLocaleString()}

</p>

<table>

<tr>

<th>Resident ID</th>

<td>${currentResident.id}</td>

</tr>

<tr>

<th>Full Name</th>

<td>${currentResident.name}</td>

</tr>

<tr>

<th>Flat Number</th>

<td>${currentResident.flat}</td>

</tr>

<tr>

<th>Mobile</th>

<td>${currentResident.mobile}</td>

</tr>

<tr>

<th>Email</th>

<td>${currentResident.email}</td>

</tr>

<tr>

<th>Family Members</th>

<td>${currentResident.familyMembers}</td>

</tr>

<tr>

<th>Status</th>

<td>

<span
style="
padding:6px 15px;
border-radius:20px;
color:white;
font-weight:bold;
background:${currentResident.status === "Active" ? "#28a745" : "#dc3545"};
">

${currentResident.status}

</span>

</td>

</tr>

</table>

<div class="footer">

<hr>

<p>

<b>Shiv Apartment Society Management System</b>

</p>

<p>

This is a computer generated resident profile.

</p>

</div>

</body>

</html>

`);

printWindow.document.close();

printWindow.focus();

setTimeout(function(){

    printWindow.print();

},300);

printWindow.onafterprint = function(){

    printWindow.close();

};

    });

}

// =========================
// Search Resident
// =========================

const searchResident =
document.getElementById("searchResident");

if(searchResident){

    searchResident.addEventListener("keyup",function(){

        const search =
        this.value.toLowerCase();

        const rows =
        document.querySelectorAll("#residentTableBody tr");

        rows.forEach(function(row){

            const text =
            row.innerText.toLowerCase();

            if(text.includes(search)){

                row.style.display = "";

            }else{

                row.style.display = "none";

            }

        });

    });

}

// =========================
// Export Residents CSV
// =========================

const exportResidents =
document.getElementById("exportResidents");

if(exportResidents){

    exportResidents.addEventListener("click",function(){

        if(residents.length === 0){

            alert("No residents available to export.");

            return;

        }

        let csv =
        "ID,Name,Flat,Mobile,Email,Family Members,Status\n";

        residents.forEach(function(resident){

            csv +=

            resident.id + "," +

            resident.name + "," +

            resident.flat + "," +

            resident.mobile + "," +

            resident.email + "," +

            resident.familyMembers + "," +

            resident.status +

            "\n";

        });

        const blob =
        new Blob(

            [csv],

            {

                type:"text/csv"

            }

        );

        const url =
        URL.createObjectURL(blob);

        const link =
        document.createElement("a");

        link.href = url;

        link.download = "Residents.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    });

}

// =========================
// Import Residents CSV
// =========================

const importBtn =
document.getElementById("importBtn");

const importResidents =
document.getElementById("importResidents");

if(importBtn){

    importBtn.addEventListener("click",function(){

        importResidents.click();

    });

}

if(importResidents){

    importResidents.addEventListener("change",function(){

        const file =
        this.files[0];

        if(!file){

            return;

        }

        const reader =
        new FileReader();

        reader.onload = function(event){

            const csv =
            event.target.result;

            const rows =
            csv.trim().split("\n");

            rows.shift();

          rows.forEach(function(row){

    const columns =
    row.split(",");

    if(columns.length >= 7){

        const id =
        columns[0].trim();

        const flat =
        columns[2].trim();

        const alreadyExists =
        residents.some(function(resident){

            return resident.id === id ||

                   resident.flat === flat;

        });

        if(!alreadyExists){

            residents.push({

                id:id,

                name:columns[1].trim(),

                flat:flat,

                mobile:columns[3].trim(),

                email:columns[4].trim(),

                familyMembers:columns[5].trim(),

                status:columns[6].trim()

            });

        }

    }

});

            saveResidents();

            displayResidents();

            alert("Residents Imported Successfully!");

            importResidents.value = "";

        };

        reader.readAsText(file);

    });

}


// =========================
// Admin Profile
// =========================

const profilePhoto =
document.getElementById("profilePhoto");

const profilePreview =
document.getElementById("profilePreview");

const headerProfileImage =
document.getElementById("headerProfileImage");

const headerAdminName =
document.getElementById("headerAdminName");

const adminName =
document.getElementById("adminName");

const adminEmail =
document.getElementById("adminEmail");

const adminMobile =
document.getElementById("adminMobile");

const adminPassword =
document.getElementById("adminPassword");

const saveProfile =
document.getElementById("saveProfile");

// =========================
// Load Saved Profile
// =========================

if(adminName){

    adminName.value =
    localStorage.getItem("adminName") || "";

    adminEmail.value =
    localStorage.getItem("adminEmail") || "";

    adminMobile.value =
    localStorage.getItem("adminMobile") || "";

    if(headerAdminName){

        headerAdminName.innerText =
        localStorage.getItem("adminName") || "Admin Name";

    }

    const savedPhoto =
    localStorage.getItem("adminPhoto");

    if(savedPhoto){

        profilePreview.src =
        savedPhoto;

        if(headerProfileImage){

            headerProfileImage.src =
            savedPhoto;

        }

    }

    updateProfileProgress();
    updateAdminDashboard();
    displayLoginHistory();

}


// =========================
// Photo Upload
// =========================

if(profilePhoto){

    profilePhoto.addEventListener("change",function(){

        const file =
        this.files[0];

        if(!file){

            return;

        }

        const reader =
        new FileReader();

        reader.onload =
        function(e){

            profilePreview.src =
            e.target.result;

            if(headerProfileImage){

                headerProfileImage.src =
                e.target.result;

            }

            localStorage.setItem(
                "adminPhoto",
                e.target.result
            );

            addProfileActivity(
                "Profile Photo Updated"
            );

            updateProfileProgress();
            updateAdminDashboard();

        };

        reader.readAsDataURL(file);

    });

}

// =========================
// Save Profile
// =========================

if(saveProfile){

    saveProfile.addEventListener("click",function(){

        localStorage.setItem(
            "adminName",
            adminName.value
        );

        localStorage.setItem(
            "adminEmail",
            adminEmail.value
        );

        localStorage.setItem(
            "adminMobile",
            adminMobile.value
        );

        if(adminPassword.value.trim() !== ""){

            localStorage.setItem(
                "adminPassword",
                adminPassword.value
            );

        }

        if(headerAdminName){

            headerAdminName.innerText =
            adminName.value;

        }

        addProfileActivity(
            "Profile Updated"
        );

        updateProfileProgress();
        updateAdminDashboard();

        alert(
            "Profile Saved Successfully!"
        );

    });

}

// =========================
// Profile Completion
// =========================

function updateProfileProgress(){

    const progress =
    document.getElementById("profileProgress");

    if(!progress){
        return;
    }

    let total = 4;
    let completed = 0;

    const adminName =
    document.getElementById("adminName");

    const adminEmail =
    document.getElementById("adminEmail");

    const adminMobile =
    document.getElementById("adminMobile");

    if(adminName && adminName.value.trim() !== ""){
        completed++;
    }

    if(adminEmail && adminEmail.value.trim() !== ""){
        completed++;
    }

    if(adminMobile && adminMobile.value.trim() !== ""){
        completed++;
    }

    if(localStorage.getItem("adminPhoto")){
        completed++;
    }

    const percentage =
    Math.round((completed / total) * 100);

    progress.style.width = percentage + "%";
    progress.innerText = percentage + "%";
}

// =========================
// Update Admin Dashboard
// =========================

function updateAdminDashboard(){

    // Profile Completion
    const profileCompletion =
    document.getElementById("dashboardProfileCompletion");

    const profileProgress =
    document.getElementById("profileProgress");

    if(profileCompletion && profileProgress){

        profileCompletion.innerText =
        profileProgress.innerText;

    }

    // Last Login
    const dashboardLastLogin =
    document.getElementById("dashboardLastLogin");

    const lastLogin =
    localStorage.getItem("lastLogin");

    if(dashboardLastLogin){

        dashboardLastLogin.innerText =
        lastLogin || "Never";

    }

    // Account Status
    const dashboardAccountStatus =
    document.getElementById("dashboardAccountStatus");

    if(dashboardAccountStatus){

        dashboardAccountStatus.innerText =
        "Active";

    }

    // Total Logins
    const dashboardLoginCount =
    document.getElementById("dashboardLoginCount");

    const loginCount =
    localStorage.getItem("loginCount") || 0;

    if(dashboardLoginCount){

        dashboardLoginCount.innerText =
        loginCount;

    }

}

// =========================
// Login History Data
// =========================

let loginHistory =
JSON.parse(localStorage.getItem("loginHistory")) || [];

function saveLoginHistory(){

    localStorage.setItem(
        "loginHistory",
        JSON.stringify(loginHistory)
    );

}

// =========================
// Add Profile Activity
// =========================

function addProfileActivity(message){

    loginHistory.unshift({

        message: message,

        time: new Date().toLocaleString()

    });

    if(loginHistory.length > 10){

        loginHistory.pop();

    }

    saveLoginHistory();

    displayLoginHistory();

}

// =========================
// Display Login History
// =========================

function displayLoginHistory(){

    const activityTimeline =
    document.getElementById("activityTimeline");

    if(!activityTimeline){

        return;

    }

    activityTimeline.innerHTML = "";

    loginHistory.forEach(function(activity){

        activityTimeline.innerHTML += `

        <div class="activity-item">

            <div class="activity-icon">
                <i class="fa-solid fa-user-check"></i>
            </div>

            <div class="activity-content">

                <h4>${activity.message}</h4>

                <p>${activity.time}</p>

            </div>

        </div>

        `;

    });

}

// =========================
// Change Password
// =========================

const currentPassword =
document.getElementById("currentPassword");

const newPassword =
document.getElementById("newPassword");

const confirmPassword =
document.getElementById("confirmPassword");

const changePasswordBtn =
document.getElementById("changePasswordBtn");

if(changePasswordBtn){

    changePasswordBtn.addEventListener("click",function(){

        const savedPassword =
        localStorage.getItem("adminPassword") || "";

        // Current Password Check
        if(currentPassword.value.trim() !== savedPassword){

            alert("Current Password is incorrect!");

            return;

        }

        // New Password Empty Check
        if(newPassword.value.trim() === ""){

            alert("Please enter a new password.");

            return;

        }

        // Minimum Length
        if(newPassword.value.length < 6){

            alert("Password must be at least 6 characters.");

            return;

        }

        // Confirm Password Match
        if(newPassword.value !== confirmPassword.value){

            alert("New Password and Confirm Password do not match.");

            return;

        }

        // Save Password
        localStorage.setItem(
            "adminPassword",
            newPassword.value
        );

        addProfileActivity(
            "Password Changed"
        );

        updateAdminDashboard();

        alert("Password Changed Successfully!");

        // Clear Fields
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

    });

}

// =========================
// Show / Hide Password
// =========================

const passwordToggles =
document.querySelectorAll(".toggle-password");

passwordToggles.forEach(function(icon){

    icon.addEventListener("click",function(){

        const input =
        document.getElementById(
            this.dataset.target
        );

        if(input.type === "password"){

            input.type = "text";

            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");

        }else{

            input.type = "password";

            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");

        }

    });

});

// =========================
// Password Strength
// =========================

const passwordStrength =
document.getElementById("passwordStrength");
const ruleLength =
document.getElementById("ruleLength");

const ruleUpper =
document.getElementById("ruleUpper");

const ruleNumber =
document.getElementById("ruleNumber");

const ruleSpecial =
document.getElementById("ruleSpecial");
if(newPassword){

    newPassword.addEventListener("input",function(){

        if(!passwordStrength){

            return;

        }

        const password =
        this.value;

        let strength = 0;

        if(password.length >= 6){

            strength++;

        }

        if(/[A-Z]/.test(password)){

            strength++;

        }

        if(/[0-9]/.test(password)){

            strength++;

        }

        if(/[^A-Za-z0-9]/.test(password)){

            strength++;

        }

        passwordStrength.className =
        "password-strength";

        if(password.length === 0){

            passwordStrength.innerText =
            "Password Strength";

        }else if(strength <= 1){

            passwordStrength.classList.add("weak");

            passwordStrength.innerText =
            "🔴 Weak Password";

        }else if(strength <= 3){

            passwordStrength.classList.add("medium");

            passwordStrength.innerText =
            "🟡 Medium Password";

        }else{

            passwordStrength.classList.add("strong");

            passwordStrength.innerText =
            "🟢 Strong Password";

        }
        
// =========================
// Password Rules
// =========================

// Minimum Length
if(password.length >= 8){

    ruleLength.innerHTML =
    "✅ Minimum 8 Characters";

    ruleLength.classList.add("valid");

}else{

    ruleLength.innerHTML =
    "❌ Minimum 8 Characters";

    ruleLength.classList.remove("valid");

}

// Uppercase Letter
if(/[A-Z]/.test(password)){

    ruleUpper.innerHTML =
    "✅ One Uppercase Letter";

    ruleUpper.classList.add("valid");

}else{

    ruleUpper.innerHTML =
    "❌ One Uppercase Letter";

    ruleUpper.classList.remove("valid");

}

// Number
if(/[0-9]/.test(password)){

    ruleNumber.innerHTML =
    "✅ One Number";

    ruleNumber.classList.add("valid");

}else{

    ruleNumber.innerHTML =
    "❌ One Number";

    ruleNumber.classList.remove("valid");

}

// Special Character
if(/[^A-Za-z0-9]/.test(password)){

    ruleSpecial.innerHTML =
    "✅ One Special Character";

    ruleSpecial.classList.add("valid");

}else{

    ruleSpecial.innerHTML =
    "❌ One Special Character";

    ruleSpecial.classList.remove("valid");

}

    });

}

// =========================
// Mobile Sidebar
// =========================

const menuToggle =
document.getElementById("menuToggle");

const sidebar =
document.querySelector(".sidebar");

if(menuToggle && sidebar){

    menuToggle.addEventListener("click",function(){

        sidebar.classList.toggle("active");

    });

}

// =========================
// Dashboard Header Profile
// =========================

const profileData =
JSON.parse(localStorage.getItem("adminProfile"));

if(profileData){

    const headerAdminName =
    document.getElementById("headerAdminName");

    const headerProfileImage =
    document.getElementById("adminProfileImage");

    if(headerAdminName && profileData.name){

        headerAdminName.innerText =
        profileData.name;

    }

    if(headerProfileImage && profileData.photo){

        headerProfileImage.src =
        profileData.photo;

    }

}

// =========================
// Current Date
// =========================

const currentDate =
document.getElementById("currentDate");

if(currentDate){

    const today =
    new Date();

    currentDate.innerHTML =
    "📅 " +
    today.toLocaleDateString("en-GB",{

        day:"2-digit",
        month:"long",
        year:"numeric"

    });

}

// =========================
// Notification Dropdown
// =========================

const notificationBtn =
document.getElementById("notificationBtn");

const notificationDropdown =
document.getElementById("notificationDropdown");

if(notificationBtn && notificationDropdown){

    notificationBtn.addEventListener("click",function(e){

        e.stopPropagation();

        notificationDropdown.style.display =
        notificationDropdown.style.display === "block"
        ? "none"
        : "block";

    });

    document.addEventListener("click",function(){

        notificationDropdown.style.display = "none";

    });

}

// =========================
// Admin Profile Dropdown
// =========================

const adminProfile =
document.getElementById("adminProfile");

const profileDropdown =
document.getElementById("profileDropdown");

if(adminProfile && profileDropdown){

    adminProfile.addEventListener("click",function(e){

        e.stopPropagation();

        profileDropdown.style.display =
        profileDropdown.style.display === "block"
        ? "none"
        : "block";

    });

    document.addEventListener("click",function(){

        profileDropdown.style.display = "none";

    });

}

// =========================
// Counter Animation
// =========================

function animateCounter(id,value){

    const element =
    document.getElementById(id);

    if(!element){

        return;

    }

    let start = 0;

    const duration = 1000;

    const increment =
    value / (duration / 20);

    const timer =
    setInterval(function(){

        start += increment;

        if(start >= value){

            start = value;

            clearInterval(timer);

        }

        element.innerText =
        Math.floor(start);

    },20);

}

// =========================
// Circular Progress Function
// =========================

function updateCircularProgress(circleId,textId,percent){

    const circle =
    document.getElementById(circleId);

    const text =
    document.getElementById(textId);


    if(!circle || !text){

        return;

    }


    const radius = 50;

    const circumference =
    2 * Math.PI * radius;


    circle.style.strokeDasharray =
    circumference;


    const offset =
    circumference -
    (percent / 100) * circumference;


    circle.style.strokeDashoffset =
    offset;


    text.innerText =
    percent + "%";

}

// =========================
// Circular Progress
// =========================

function updateProgressCircle(

    circleId,
    textId,
    percent

){

    const circle =
    document.getElementById(circleId);

    const text =
    document.getElementById(textId);

    if(!circle || !text){

        return;

    }

    const radius = 50;

    const circumference =
    2 * Math.PI * radius;

    const offset =
    circumference -
    (percent / 100) * circumference;

    circle.style.strokeDashoffset =
    offset;

    text.innerText =
    percent + "%";

}

// =========================
// Today's Date Widget
// =========================

const todayDateWidget =
document.getElementById("todayDateWidget");

if(todayDateWidget){

    todayDateWidget.innerHTML =
    new Date().toLocaleDateString("en-GB",{

        day:"2-digit",
        month:"long",
        year:"numeric"

    });

}

// =========================
// Live Digital Clock
// =========================

const currentTime =
document.getElementById("currentTime");

function updateClock(){

    if(!currentTime){

        return;

    }

    const now = new Date();

    currentTime.innerHTML =
    "🕒 " +
    now.toLocaleTimeString("en-GB");

}

updateClock();

setInterval(updateClock,1000);

// =========================
// Circular Progress
// =========================

function updateCircularProgress(id,textId,percent){

    const circle =
    document.getElementById(id);

    const text =
    document.getElementById(textId);

    if(!circle || !text){

        return;

    }

    const degree =
    percent * 3.6;

    circle.style.background =
    `conic-gradient(#4e73df ${degree}deg,#e9ecef ${degree}deg)`;

    text.innerText =
    percent + "%";

}

// =========================
// Dashboard Overview
// =========================

function updateOverview(){

    const residents =
    JSON.parse(localStorage.getItem("residents")) || [];

    const totalFlats = 50;

    const occupied =
    residents.length;

    const vacant =
    totalFlats - occupied;

    const flats =
    document.getElementById("overviewFlats");

    const occupiedBox =
    document.getElementById("overviewOccupied");

    const vacantBox =
    document.getElementById("overviewVacant");

    if(flats){

        flats.innerText =
        totalFlats;

    }

    if(occupiedBox){

        occupiedBox.innerText =
        occupied;

    }

    if(vacantBox){

        vacantBox.innerText =
        vacant;

    }

}

// =========================
// Dashboard Statistics
// =========================

function updateDashboardStats(){

    const total =
    document.getElementById("totalResidents");

    const active =
    document.getElementById("activeResidents");

    const inactive =
    document.getElementById("inactiveResidents");


    if(!total || !active || !inactive){
        return;
    }


    const residents =
    JSON.parse(localStorage.getItem("residents")) || [];


    let activeCount = 0;
    let inactiveCount = 0;


    residents.forEach(function(resident){

        if(resident.status === "Active"){

            activeCount++;

        }
        else{

            inactiveCount++;

        }

    });

animateCounter(
    "totalResidents",
    residents.length
);

animateCounter(
    "activeResidents",
    activeCount
);

animateCounter(
    "inactiveResidents",
    inactiveCount
);

// =========================
// Circular Progress
// =========================

const residentTotal =
residents.length || 1;


const paidResidentsCount =
residents.filter(function(resident){

    return resident.status === "Active";

}).length;


const activePercent =
Math.round(
(paidResidentsCount / residentTotal) * 100
);


updateCircularProgress(
    "paidCircle",
    "paidPercent",
    activePercent
);


updateCircularProgress(
    "collectionCircle",
    "collectionPercent",
    activePercent
);


// =========================
// Complaint Resolution Rate
// =========================

const complaints =
JSON.parse(localStorage.getItem("complaints")) || [];


let resolvedComplaints = 0;


complaints.forEach(function(complaint){

    if(
        complaint.status === "Resolved" ||
        complaint.status === "Closed"
    ){

        resolvedComplaints++;

    }

});


const complaintTotal =
complaints.length || 1;


const complaintPercent =
Math.round(
(resolvedComplaints / complaintTotal) * 100
);



// =========================
// Maintenance Collection Rate
// =========================

const maintenanceRecords =
JSON.parse(localStorage.getItem("maintenanceRecords")) || [];


let paidAmount = 0;

let totalAmount = 0;


maintenanceRecords.forEach(function(record){


    const amount =
    Number(record.amount) || 0;


    totalAmount += amount;


    if(
        record.status === "Paid" ||
        record.status === "Paid"
    ){

        paidAmount += amount;

    }


});


const collectionPercent =

totalAmount === 0

?

0

:

Math.round(
(paidAmount / totalAmount) * 100
);



updateCircularProgress(

    "collectionCircle",

    "collectionPercent",

    collectionPercent

);

}


// =========================
// Load Data
// =========================

loadActivities();
loadMaintenance();
loadComplaints();
loadNotices();
loadVisitors();
loadFlats();
loadParking();


displayActivities();
displayMaintenance();
displayComplaints();
displayNotices();
displayVisitors();
displayFlats();
displayParking();
displayEvents();
displayResidents();

updateDashboardStats();
updateOverview();
updateMaintenanceSummary();
displayRecentMaintenance();
updateMaintenanceChart(); 
updateVisitorSummary();
displayRecentComplaints();
updateFlatSummary();
updateParkingSummary();
updateProfileProgress();
updateAdminDashboard();