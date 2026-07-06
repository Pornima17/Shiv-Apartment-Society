// =========================
// Complaints Data
// =========================

let complaints = [];
let editingComplaintIndex = -1;

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

loadComplaints();
displayComplaints();
displayRecentComplaints();