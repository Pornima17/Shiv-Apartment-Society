
let maintenanceRecords = [];
let editingMaintenanceIndex = -1;

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
// Save Maintenance
// =========================

function saveMaintenance() {

    localStorage.setItem(
        "maintenanceRecords",
        JSON.stringify(maintenanceRecords)
    );

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
// Maintenance View Modal
// =========================

const maintenanceModal =
document.getElementById("maintenanceModal");

const closeMaintenanceModal =
document.getElementById("closeMaintenanceModal");

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
// Load Data
// =========================


loadMaintenance();

displayMaintenance();

updateMaintenanceSummary();

displayRecentMaintenance();

updateMaintenanceChart();

updateMaintenancePieChart();

updateMaintenanceTrendChart();