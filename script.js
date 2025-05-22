let currentUser = null;
const loginDiv = document.getElementById("login");
const calendarDiv = document.getElementById("calendar");

function enter() {
  const code = document.getElementById("code").value.trim();
  if (!/^[0-9]{3}$/.test(code)) {
    alert("Please enter a valid 3-digit code");
    return;
  }
  currentUser = code;
  loginDiv.classList.add("hidden");
  calendarDiv.classList.remove("hidden");
  calendarDiv.innerHTML = ""; // очистка предыдущего календаря
  loadCalendar();
}

function loadCalendar() {
  const months = [
    { name: "jan", days: 31 }, { name: "feb", days: 28 }, { name: "mar", days: 31 },
    { name: "apr", days: 30 }, { name: "may", days: 31 }, { name: "jun", days: 30 },
    { name: "jul", days: 31 }, { name: "aug", days: 31 }, { name: "sep", days: 30 },
    { name: "oct", days: 31 }, { name: "nov", days: 30 }, { name: "dec", days: 31 }
  ];
  const year = new Date().getFullYear();
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) months[1].days = 29;

  const now = new Date();
  const todayMonth = now.getMonth(), todayDay = now.getDate();
  const state = JSON.parse(localStorage.getItem("calendar-" + currentUser) || "{}");

  months.forEach((month, mIndex) => {
    const col = document.createElement("div");
    col.className = "month";
    const label = document.createElement("div");
    label.className = "month-name";
    label.innerText = month.name;
    col.appendChild(label);

    for (let d = 1; d <= month.days; d++) {
      const id = `${mIndex}-${d}`;
      const btn = document.createElement("div");
      btn.className = "day";
      btn.innerText = d;

      if (state[id]) btn.classList.add("active");
      if (mIndex === todayMonth && d === todayDay) btn.classList.add("today");

      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        state[id] = btn.classList.contains("active");
        localStorage.setItem("calendar-" + currentUser, JSON.stringify(state));
      });

      col.appendChild(btn);
    }

    calendarDiv.appendChild(col);
  });
}
