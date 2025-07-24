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
