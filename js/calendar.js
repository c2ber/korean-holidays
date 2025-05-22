document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const today = moment();
  const year = today.year();
  const month = today.month(); // 0-based

  // 공휴일 데이터 로드
  fetch('holidays.json')
    .then(response => response.json())
    .then(holidays => renderCalendar(year, month, holidays))
    .catch(error => console.error('Error loading holidays:', error));

  function renderCalendar(year, month, holidays) {
    calendar.innerHTML = '';
    const firstDay = moment([year, month]);
    const daysInMonth = firstDay.daysInMonth();
    const startDay = firstDay.day();

    // 요일 헤더
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    days.forEach(day => {
      const div = document.createElement('div');
      div.textContent = day;
      div.className = 'day font-bold';
      calendar.appendChild(div);
    });

    // 빈 칸
    for (let i = 0; i < startDay; i++) {
      calendar.appendChild(document.createElement('div'));
    }

    // 날짜
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment([year, month, day]).format('YYYY-MM-DD');
      const div = document.createElement('div');
      div.className = 'day';
      if (moment([year, month, day]).day() === 0) div.classList.add('weekend-sunday');
      if (moment([year, month, day]).day() === 6) div.classList.add('weekend-saturday');
      if (holidays.some(h => h.date === date)) div.classList.add('holiday');
      if (schedules.some(s => s.date === date)) div.classList.add('has-schedule');
      div.textContent = day;
      div.addEventListener('click', () => {
        window.location.href = `add-schedule.html?date=${date}`;
      });
      calendar.appendChild(div);
    }
  }
});
