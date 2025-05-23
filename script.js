const calendarDiv = document.getElementById("calendar");
const GITHUB_USERNAME = "mtwbv";
const REPO = "glow-data";
const FILE = "data.json";
const TOKEN = "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"; // WARNING: keep this private if deploying

let state = {};

function fetchData() {
  fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${FILE}`, {
    headers: { Authorization: `token ${TOKEN}` }
  })
    .then(res => res.json())
    .then(file => {
      const content = atob(file.content);
      state = JSON.parse(content || "{}");
      renderCalendar(file.sha);
    });
}

function saveData(newState, sha) {
  const body = {
    message: "Update calendar",
    content: btoa(JSON.stringify(newState)),
    sha
  };

  fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${FILE}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(() => console.log("Saved!"));
}

function renderCalendar(sha) {
  const months = [
    { name: "jan", days: 31 }, { name: "feb", days: 28 }, { name: "mar", days: 31 },
    { name: "apr", days: 30 }, { name: "may", days: 31 }, { name: "jun", days: 30 },
    { name: "jul", days: 31 }, { name: "aug", days: 31 }, { name: "sep", days: 30 },
    { name: "oct", days: 31 }, { name: "nov", days: 30 }, { name: "dec", days: 31 }
  ];
  const year = new Date().getFullYear();
  if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) months[1].days = 29;

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  calendarDiv.innerHTML = "";

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
        saveData(state, sha);
      });

      col.appendChild(btn);
    }

    calendarDiv.appendChild(col);
  });
}

fetchData();
