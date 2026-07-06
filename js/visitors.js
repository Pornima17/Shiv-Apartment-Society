// =========================
// Visitors Data
// =========================

let visitors = [];
let editingVisitorIndex = -1;

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

loadVisitors();

displayVisitors();

updateVisitorSummary();

