document.getElementById("reportForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const errors = [];

  const boxId = document.getElementById("boxId").value;
  const email = document.getElementById("email").value;
  const mailAmount = parseInt(document.getElementById("mailAmount").value, 10);

  if (!boxId) errors.push("יש להזין מזהה תיבה.");
  if (!email.includes("@")) errors.push("כתובת אימייל לא תקינה");
  if (mailAmount < 0 || isNaN(mailAmount)) errors.push("כמות דואר לא תקינה");

  const msgBox = document.getElementById("messages");
  if (errors.length > 0) {
    msgBox.style.color = "red";
    msgBox.innerHTML = errors.join("<br>");
  } else {
    msgBox.style.color = "green";
    msgBox.textContent = "הדיווח נשלח בהצלחה! תודה על פנייתך";
  }
});

let complaints = [];

function loadComplaints() {
  const data = localStorage.getItem("complaints");
  complaints = data ? JSON.parse(data) : [];
  renderComplaints();
}

function saveComplaint(complaint) {
  complaints.push(complaint);
  localStorage.setItem("complaints", JSON.stringify(complaints));
  renderComplaints();
}

function renderComplaints() {
  const container = document.getElementById("complaintsList");
  container.innerHTML = "";
  complaints.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "complaint";
    div.innerHTML = `
      <strong>מזהה:</strong> ${c.boxId}<br>
      <strong>צבע:</strong> ${c.color}<br>
      <strong>טון:</strong> ${c.tone}<br>
      <strong>סטטוס:</strong> ${c.status}<br>
      <button onclick="deleteComplaint(${i})">🗑️ מחיקה</button>
      <button onclick="updateStatus(${i})">🌀 שנה סטטוס</button>
    `;
    container.appendChild(div);
  });
}

