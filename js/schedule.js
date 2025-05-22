document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('scheduleForm');
  const isRecurring = document.getElementById('isRecurring');
  const recurringOptions = document.getElementById('recurringOptions');

  if (isRecurring) {
    isRecurring.addEventListener('change', () => {
      recurringOptions.classList.toggle('hidden', !isRecurring.checked);
    });
  }

  if (form) {
    // URL에서 날짜 가져오기
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    if (date) document.getElementById('date').value = date;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const schedule = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value || null,
        isRecurring: isRecurring.checked,
        interval: isRecurring.checked ? parseInt(document.getElementById('interval').value) : null,
        includeWeekends: isRecurring.checked ? document.getElementById('includeWeekends').checked : false,
        includeHolidays: isRecurring.checked ? document.getElementById('includeHolidays').checked : false,
        endDate: isRecurring.checked ? document.getElementById('endDate').value || null : null
      };

      // 반복 일정 생성
      const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
      if (schedule.isRecurring && schedule.endDate) {
        let currentDate = moment(schedule.date);
        const endDate = moment(schedule.endDate);
        while (currentDate.isSameOrBefore(endDate)) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;
          const isHoliday = false; // holidays.json과 연동 필요
          if ((schedule.includeWeekends || !isWeekend) && (schedule.includeHolidays || !isHoliday)) {
            schedules.push({ ...schedule, date: dateStr });
          }
          currentDate.add(schedule.interval, 'days');
        }
      } else {
        schedules.push(schedule);
      }

      localStorage.setItem('schedules', JSON.stringify(schedules));
      window.location.href = 'index.html';
    });
  }
});
