const holidays = {
  "2025-05-05": "어린이날,부처님 오신 날",
  "2025-05-06": "대체공휴일(부처님 오신 날)"
};

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = document.getElementById("year-select").value;
  const month = document.getElementById("month-select").value;

  const date = new Date(year, month - 1, 1);
  const firstDay = date.getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const weeks = [];
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDate; d++) {
    const dayDiv = document.createElement("div");
    const fullDate = `${year}-${month.padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dayDiv.className = "day";
    const weekDay = new Date(year, month - 1, d).getDay();
    if (weekDay === 0) dayDiv.classList.add("sunday");
    if (weekDay === 6) dayDiv.classList.add("saturday");
    if (holidays[fullDate]) dayDiv.classList.add("holiday");

    dayDiv.innerHTML = `
      <div class="date">${d}</div>
      ${holidays[fullDate] ? `<div class="event">${holidays[fullDate]}</div>` : ""}
    `;

    dayDiv.onclick = () => {
      window.location.href = `add_event.html?date=${fullDate}`;
    };

    calendar.appendChild(dayDiv);
  }
}

function populateSelectors() {
  const yearSelect = document.getElementById("year-select");
  const monthSelect = document.getElementById("month-select");

  const now = new Date();
  for (let y = 2020; y <= 2030; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.text = y;
    if (y === now.getFullYear()) option.selected = true;
    yearSelect.appendChild(option);
  }

  for (let m = 1; m <= 12; m++) {
    const option = document.createElement("option");
    option.value = String(m).padStart(2, '0');
    option.text = m;
    if (m === now.getMonth() + 1) option.selected = true;
    monthSelect.appendChild(option);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateSelectors();
  renderCalendar();
});
