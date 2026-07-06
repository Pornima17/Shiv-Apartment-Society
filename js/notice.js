// =========================
// Notice Data
// =========================

let notices = [];
let editingNoticeIndex = -1;

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

loadNotices();

displayNotices();
