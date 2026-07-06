// =========================
// Residents Data
// =========================

let editingIndex = -1;

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
// Save Residents
// =========================

function saveResidents() {

    localStorage.setItem("residents", JSON.stringify(residents));

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

loadResidents();
displayResidents();