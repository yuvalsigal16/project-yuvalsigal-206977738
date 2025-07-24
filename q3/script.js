let complaints = [];

function safe(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function loadItems() {
  const data = localStorage.getItem("complaints");
  complaints = data ? JSON.parse(data) : [];
}

function saveItems() {
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

function renderItems() {
  const container = document.getElementById("complaintsList");
  if (!container) return;

  container.innerHTML = "";

  if (complaints.length === 0) {
    container.innerHTML = "<p style='text-align:center'>אין תלונות להצגה</p>";
    return;
  }

  const sortSelect = document.getElementById("sortOrder");
  const sortOrder = sortSelect ? sortSelect.value : "desc";

  const sorted = [...complaints].sort((a, b) => {
    return sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
  });

  sorted.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "complaint";

    div.innerHTML = `
      <div class="fields">
        <div class="field"><strong>מזהה:</strong> ${safe(item.boxId)}</div>
        <div class="field"><strong>תלונה:</strong> ${safe(item.complaints)}</div>
        <div class="field"><strong>מצב:</strong> ${safe(item.situation)}</div>
        <div class="field"><strong>כמות דואר:</strong> ${safe(item.mailAmount)}</div>
        <div class="field"><strong>טון:</strong> ${safe(item.tone)}</div>
        <div class="field"><strong>משתמש:</strong> ${safe(item.userType)}</div>
        <div class="field"><strong>אימייל:</strong> ${safe(item.email)}</div>
        <div class="field"><strong>תאריך שליחה:</strong> ${new Date(item.timestamp).toLocaleString()}</div>
      </div>
        <div class="status">סטטוס: ${safe(item.status)}</div>
       <div>
        <button class="btn-status" data-id="${item.timestamp}">שנה סטטוס</button>
       <button class="btn-delete" data-id="${item.timestamp}">מחיקה</button>
     </div> `;
    container.appendChild(div);
  });
}

function findComplaintIndexById(id) {
  return complaints.findIndex(item => item.timestamp === id);
}

function deleteItemById(id) {
  const index = findComplaintIndexById(id);
  if (index === -1) return;
  complaints.splice(index, 1);
  saveItems();
  renderItems();
}

function toggleStatusById(id) {
  const index = findComplaintIndexById(id);
  if (index === -1) return;
  complaints[index].status =
    complaints[index].status === "תיבה רגועה" ? "דורשת טיפול" : "תיבה רגועה";
  saveItems();
  renderItems();
}

function updateItem(index, newStatus) {
  if (!complaints[index]) return;
  complaints[index].status = newStatus;
  saveItems();
  renderItems();
}

function setupForm() {
  const form = document.getElementById("reportForm");
  const msgBox = document.getElementById("messages");
  if (!form || !msgBox) return;

  loadItems();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const errors = [];

    const boxId = document.getElementById("boxId").value.trim();
    const complaintsText = document.getElementById("complaints").value.trim();
    const situation = document.getElementById("situation").value;
    const mailAmountStr = document.getElementById("mailAmount").value.trim();
    const tone = document.getElementById("tone").value;
    const userType = document.getElementById("userType").value;
    const email = document.getElementById("email").value.trim();

    const mailAmount = parseInt(mailAmountStr, 10);
    if (!boxId) errors.push("יש להזין מזהה תיבה.");
    if (!email.includes("@")) errors.push("כתובת אימייל לא תקינה.");
    if (mailAmountStr !== "" && (mailAmount < 0 || isNaN(mailAmount))) {
      errors.push("כמות דואר לא תקינה.");
    }

    if (errors.length > 0) {
      msgBox.style.color = "red";
      msgBox.innerHTML = errors.join("<br>");
      return;
    }

    const newComplaint = {
      boxId,
      complaints: complaintsText,
      situation,
      mailAmount: mailAmountStr === "" ? null : mailAmount,
      tone,
      userType,
      email,
      status: "תיבה רגועה",
      timestamp: Date.now()
    };

    complaints.push(newComplaint);
    saveItems();
    form.reset();

    msgBox.style.color = "green";
    msgBox.textContent = "הדיווח נשלח בהצלחה!";

    setTimeout(() => {
      window.location.href = "view.html";
    }, 1500);
  });
}

window.addEventListener("load", () => {
  if (document.getElementById("reportForm")) {
    setupForm();
  }

  if (document.getElementById("complaintsList")) {
    loadItems();
    renderItems();

    const sortSelect = document.getElementById("sortOrder");
    if (sortSelect) {
      sortSelect.addEventListener("change", renderItems);
    }

    
document.addEventListener("click", (e) => {
  const id = parseInt(e.target.getAttribute("data-id"), 10);
  if (!id) return;

  if (e.target.classList.contains("btn-status")) {
    toggleStatusById(id);
  }

  if (e.target.classList.contains("btn-delete")) {
    deleteItemById(id);
  }
});

  }
});
