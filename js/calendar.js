document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  if (!calendar) {
    console.error('Calendar element not found!');
    return;
  }

  const today = moment();
  const year = today.year();
  const month = today.month(); // 0-based

  // 기본 공휴일 데이터 (fetch 실패 시 대체)
  const defaultHolidays = [
    { date: "2025-01-01", name: "신정" },
    { date: "2025-01-28", name: "설날 연휴" },
    { date: "2025-01-29", name: "설날" },
    { date: "2025-01-30", name: "설날 연휴" },
    { date: "2025-03-01", name: "삼일절" }
  ];

  // 공휴일 데이터 로드
  fetch('holidays.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load holidays.json');
      return response.json();
    })
    .then(holidays => {
      console.log('Holidays loaded:', holidays);
      renderCalendar(year, month, holidays);
    })
    .catch(error => {
      console.error('Error loading holidays:', error);
      console.warn('Using default holidays');
      renderCalendar(year, month, defaultHolidays);
    });

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
      div.className = 'day font-bold text-center bg-gray-200';
      calendar.appendChild(div);
    });

    // 빈 칸
    for (let i = 0; i < startDay; i++) {
      const div = document.createElement('div');
      div.className = 'day';
      calendar.appendChild(div);
    }

    // 날짜
    const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment([year, month, day]).format('YYYY-MM-DD');
      const div = document.createElement('div');
      div.className = 'day cursor-pointer';
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
