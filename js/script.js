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

        // Demo Credentials

        const ADMIN_USERNAME = "admin";
        const ADMIN_PASSWORD = "admin123";

        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem("adminLoggedIn", "true");

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
// Dashboard Header Profile
// =========================

const headerAdminName =
document.getElementById("headerAdminName");

const headerProfileImage =
document.getElementById("headerProfileImage");

const profileData =
JSON.parse(localStorage.getItem("adminProfile"));

if(profileData){

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
// Residents Data
// =========================

let residents = [];
let editingIndex = -1;
let activities = [];
let maintenanceRecords = [];
let editingMaintenanceIndex = -1;

// =========================
// Complaints Data
// =========================

let complaints = [];
let editingComplaintIndex = -1;

// =========================
// Notice Data
// =========================

let notices = [];
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

    tableBody.innerHTML = "";

    flats.forEach(function(flat,index){

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

    });

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
// Search Flat
// =========================

const searchFlat =
document.getElementById("searchFlat");

if(searchFlat){

searchFlat.addEventListener("keyup",function(){

const value=
this.value.toLowerCase();

const rows=
document.querySelectorAll("#flatTableBody tr");

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

totalFlats.innerText=flats.length;

occupiedFlats.innerText=occupied;

vacantFlats.innerText=vacant;

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

            <td>N${String(index + 1).padStart(3,"0")}</td>

            <td>${notice.title}</td>

            <td>${notice.date}</td>

            <td>

                <button
                    class="view-notice-btn"
                    data-index="${index}">
                    View
                </button>

                <button
                    class="edit-notice-btn"
                    data-index="${index}">
                    Edit
                </button>

                <button
                    class="delete-notice-btn"
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
        if (event.target.classList.contains("edit-notice-btn")) {

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
        if (event.target.classList.contains("delete-notice-btn")) {

            const index = event.target.dataset.index;

            if (confirm("Are you sure you want to delete this notice?")) {

                notices.splice(index, 1);

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

        if (event.target.classList.contains("view-notice-btn")) {

            const index = event.target.dataset.index;

            document.getElementById("viewNoticeId").innerText =
                "N" + String(Number(index) + 1).padStart(3, "0");

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

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>C${String(index + 1).padStart(3, "0")}</td>

            <td>${complaint.resident}</td>

            <td>${complaint.flat}</td>

            <td>${complaint.title}</td>

            <td>${complaint.status}</td>

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

</td>
        `;

        complaintTableBody.appendChild(row);

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

        complaints.push({

            resident: resident,
            flat: flat,
            title: title,
            description: description,
            status: status

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

            document.getElementById("viewComplaintStatus").innerText =
                complaints[index].status;

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
// Save Residents
// =========================

function saveResidents() {

    localStorage.setItem("residents", JSON.stringify(residents));

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
// Generate Resident ID
// =========================

function generateResidentId() {

    let maxId = 0;

    residents.forEach(function (resident) {

        const number = parseInt(resident.id.replace("R", ""));

        if (number > maxId) {

            maxId = number;

        }

    });

    const newId = maxId + 1;

    return "R" + String(newId).padStart(3, "0");

}


// =========================
// Display Residents
// =========================

function displayResidents() {

    const residentTableBody = document.getElementById("residentTableBody");

   if (!residentTableBody) {

    updateDashboardStats();

    return;

}

    residentTableBody.innerHTML = "";

    residents.forEach(function (resident, index) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${resident.id}</td>

            <td>${resident.name}</td>

            <td>${resident.flat}</td>

            <td>${resident.mobile}</td>

<td>

    <button class="status-btn" data-index="${index}"
        style="background:${resident.status === "Active" ? "#28a745" : "#dc3545"}">

        ${resident.status}

    </button>

</td>
            <td>

    <button class="view-btn" data-index="${index}">
        View
    </button>

    <button class="edit-btn" data-index="${index}">
        Edit
    </button>

    <button class="delete-btn" data-index="${index}">
        Delete
    </button>

</td>
        `;

       residentTableBody.appendChild(row);

});

updateDashboardStats();

}

// =========================
// Add / Update Resident
// =========================

const saveResident = document.getElementById("saveResident");

if (saveResident) {

    saveResident.addEventListener("click", function () {

        const name = document.getElementById("residentName").value.trim();
        const flat = document.getElementById("flatNumber").value.trim();
        const mobile = document.getElementById("mobileNumber").value.trim();
        const email = document.getElementById("email").value.trim();
        const familyMembers = document.getElementById("familyMembers").value.trim();

        if (name === "" || flat === "" || mobile === "") {

            alert("Please fill all required fields.");
            return;

        }

        // =========================
        // Update Resident
        // =========================

        if (editingIndex !== -1) {

            residents[editingIndex].name = name;
            residents[editingIndex].flat = flat;
            residents[editingIndex].mobile = mobile;
            residents[editingIndex].email = email;
            residents[editingIndex].familyMembers = familyMembers;

            editingIndex = -1;

            saveResident.innerText = "Save";

            saveResidents();
            displayResidents();

            addActivity(name + " details updated.");

            document.getElementById("residentName").value = "";
            document.getElementById("flatNumber").value = "";
            document.getElementById("mobileNumber").value = "";
            document.getElementById("email").value = "";
            document.getElementById("familyMembers").value = "";


            alert("Resident Updated Successfully!");

            return;

        }

        // =========================
        // Add Resident
        // =========================

       residents.push({

    id: generateResidentId(),

    name: name,

    flat: flat,

    mobile: mobile,

    email: email,

    familyMembers: familyMembers,

    status: "Active"

});

        saveResidents();
        displayResidents();

        addActivity(name + " added as a new resident.");

        document.getElementById("residentName").value = "";
        document.getElementById("flatNumber").value = "";
        document.getElementById("mobileNumber").value = "";
        document.getElementById("email").value = "";
        document.getElementById("familyMembers").value = "";

        alert("Resident Added Successfully!");

    });

}

// =========================
// Edit & Delete Resident
// =========================

const residentTable = document.getElementById("residentTable");

if (residentTable) {

    residentTable.addEventListener("click", function (event) {

 // =========================
 // Edit Resident
// =========================

        if (event.target.classList.contains("edit-btn")) {

            const index = event.target.dataset.index;

            editingIndex = index;

            document.getElementById("residentName").value =
                residents[index].name;

            document.getElementById("flatNumber").value =
                residents[index].flat;

            document.getElementById("mobileNumber").value =
                residents[index].mobile;

                document.getElementById("email").value =
                residents[index].email || "";

                document.getElementById("familyMembers").value =
                residents[index].familyMembers || "";

            saveResident.innerText = "Update Resident";

        }

 // =========================
// Toggle Status
// =========================

if (event.target.classList.contains("status-btn")) {

    const index = event.target.dataset.index;

    if (residents[index].status === "Active") {

        residents[index].status = "Inactive";

    } else {

        residents[index].status = "Active";

    }

    saveResidents();

    displayResidents();

    addActivity(
    residents[index].name +
    " status changed to " +
    residents[index].status
);

}

        // =========================
        // Delete Resident
        // =========================

        if (event.target.classList.contains("delete-btn")) {

            const index = event.target.dataset.index;

            const confirmDelete = confirm(
                "Are you sure you want to delete this resident?"
            );

            if (confirmDelete) {

                const deletedName = residents[index].name;

residents.splice(index, 1);

saveResidents();

displayResidents();

addActivity(deletedName + " deleted.");

                alert("Resident Deleted Successfully!");

            }

        }

    });

}

// =========================
// Resident View Modal
// =========================

const residentModal = document.getElementById("residentModal");
const closeModal = document.getElementById("closeModal");

if (residentTable) {

    residentTable.addEventListener("click", function(event){

        if(event.target.classList.contains("view-btn")){

            const index = event.target.dataset.index;

            document.getElementById("viewId").innerText =
            residents[index].id;

            document.getElementById("viewName").innerText =
            residents[index].name;

            document.getElementById("viewFlat").innerText =
            residents[index].flat;

            document.getElementById("viewMobile").innerText =
            residents[index].mobile;

            document.getElementById("viewStatus").innerText =
            residents[index].status;

            document.getElementById("viewEmail").innerText =
    residents[index].email || "-";

document.getElementById("viewFamily").innerText =
    residents[index].familyMembers || "-";

            residentModal.style.display = "block";

        }

    });

}

if(closeModal){

    closeModal.addEventListener("click",function(){

        residentModal.style.display = "none";

    });

}

window.addEventListener("click",function(event){

    if(event.target === residentModal){

        residentModal.style.display = "none";

    }

});

// =========================
// Export Residents CSV
// =========================

const exportResidents = document.getElementById("exportResidents");

if (exportResidents) {

    exportResidents.addEventListener("click", function () {

        if (residents.length === 0) {

            alert("No Residents Found!");

            return;

        }

        let csv =
"ID,Name,Flat,Mobile,Email,Family Members,Status\n";

        residents.forEach(function (resident) {

            csv += `${resident.id},${resident.name},${resident.flat},${resident.mobile},${resident.email || ""},${resident.familyMembers || ""},${resident.status}\n`;

        });

        const blob = new Blob([csv], {

            type: "text/csv;charset=utf-8;"

        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

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

const importBtn = document.getElementById("importBtn");
const importResidents = document.getElementById("importResidents");

if (importBtn && importResidents) {

    importBtn.addEventListener("click", function () {

        const file = importResidents.files[0];

        if (!file) {

            alert("Please select a CSV file.");
            return;

        }

        const reader = new FileReader();

        reader.onload = function (e) {

            const csv = e.target.result;

            const rows = csv.trim().split("\n");

            // Header Remove
            rows.shift();

            residents = [];

            rows.forEach(function (row) {

                const data = row.split(",");

                residents.push({

                    id: data[0],
                    name: data[1],
                    flat: data[2],
                    mobile: data[3],
                    email: data[4],
                    familyMembers: data[5],
                    status: data[6]

                });

            });

            saveResidents();
            displayResidents();

            importResidents.value = "";

addActivity("Residents imported from CSV.");

            alert("Residents Imported Successfully!");

        };

        reader.readAsText(file);

    });

}


// =========================
// Resident Chart
// =========================

let residentChart = null;
let statusChart = null;

function updateResidentChart() {

    console.log("Chart Function Called");

    const chartCanvas = document.getElementById("residentChart");

    if (!chartCanvas) {
        return;
    }

    let active = 0;
    let inactive = 0;

    residents.forEach(function (resident) {

        if (resident.status === "Active") {
            active++;
        } else {
            inactive++;
        }

    });

    // =========================
    // Bar Chart
    // =========================

    if (residentChart) {
        residentChart.destroy();
    }

    residentChart = new Chart(chartCanvas.getContext("2d"), {

        type: "bar",

        data: {

            labels: ["Total", "Active", "Inactive"],

            datasets: [{

                label: "Residents",

                data: [
                    residents.length,
                    active,
                    inactive
                ],

                backgroundColor: [
                    "#4e73df",
                    "#28a745",
                    "#dc3545"
                ],

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        precision: 0
                    }

                }

            }

        }

    });

    // =========================
    // Pie Chart
    // =========================

    const pieCanvas = document.getElementById("statusChart");

    if (pieCanvas) {

        if (statusChart) {
            statusChart.destroy();
        }

        statusChart = new Chart(pieCanvas.getContext("2d"), {

            type: "pie",

            data: {

                labels: ["Active", "Inactive"],

                datasets: [{

                    data: [active, inactive],

                    backgroundColor: [
                        "#28a745",
                        "#dc3545"
                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });

    }

}
// =========================
// Dashboard Statistics
// =========================

function updateDashboardStats() {

    const totalResidents = document.getElementById("totalResidents");
    const activeResidents = document.getElementById("activeResidents");
    const inactiveResidents = document.getElementById("inactiveResidents");

    if (!totalResidents || !activeResidents || !inactiveResidents) {
        return;
    }

    let active = 0;
    let inactive = 0;

    residents.forEach(function (resident) {

        if (resident.status === "Active") {
            active++;
        } else {
            inactive++;
        }

    });

    totalResidents.innerText = residents.length;
    activeResidents.innerText = active;
    inactiveResidents.innerText = inactive;

    // ✅ Chart Update
    updateResidentChart();

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

    <button
    class="view-maintenance-btn"
    data-index="${index}">
    View
    </button>

    <button
    class="edit-maintenance-btn"
    data-index="${index}">
    Edit
    </button>

    <button
    class="delete-maintenance-btn"
    data-index="${index}">
    Delete
    </button>

</td>

        `;

        tableBody.appendChild(row);

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

        if(event.target.classList.contains("view-maintenance-btn")){

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

        if(event.target.classList.contains("edit-maintenance-btn")){

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

        if(event.target.classList.contains("delete-maintenance-btn")){

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
// Admin Profile
// =========================

const profilePhoto = document.getElementById("profilePhoto");
const profilePreview = document.getElementById("profilePreview");

const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const adminMobile = document.getElementById("adminMobile");
const adminPassword = document.getElementById("adminPassword");

const saveProfile = document.getElementById("saveProfile");

// Load Saved Profile
if (adminName) {

    adminName.value = localStorage.getItem("adminName") || "";
    adminEmail.value = localStorage.getItem("adminEmail") || "";
    adminMobile.value = localStorage.getItem("adminMobile") || "";

    const savedPhoto = localStorage.getItem("adminPhoto");

    if (savedPhoto) {
        profilePreview.src = savedPhoto;
    }

}

// Photo Preview
if (profilePhoto) {

    profilePhoto.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            profilePreview.src = e.target.result;

            localStorage.setItem(
                "adminPhoto",
                e.target.result
            );

        };

        reader.readAsDataURL(file);

    });

}

// Save Profile
if (saveProfile) {

    saveProfile.addEventListener("click", function () {

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

        if (adminPassword.value.trim() !== "") {

            localStorage.setItem(
                "adminPassword",
                adminPassword.value
            );

        }

        alert("Profile Saved Successfully!");

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
// Load Data
// =========================

loadResidents();
loadActivities();
loadMaintenance();
loadComplaints();
loadNotices();
loadVisitors();
loadFlats();
loadParking();

displayResidents();
displayActivities();
displayMaintenance();
displayComplaints();
displayNotices();
displayVisitors();
displayFlats();
displayParking();
displayEvents();

updateDashboardStats();
updateMaintenanceSummary();
displayRecentMaintenance();
updateMaintenanceChart(); 
updateVisitorSummary();
displayRecentComplaints();
updateFlatSummary();
updateParkingSummary();