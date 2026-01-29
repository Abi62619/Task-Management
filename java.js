// ---------------- NAVIGATION ----------------
const navs = document.querySelectorAll('.nav-list li');
const sections = document.querySelectorAll('.section');

navs.forEach((item, idx) => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-list li.active')?.classList.remove('active');
        item.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active'));
        sections[idx].classList.add('active');

        // Update counter when switching to Game section
        if (sections[idx].querySelector("#taskAmount")) {
            updateTaskAmount();
        }
    });
});


//----------------- CALENDAR ------------------

document.addEventListener("DOMContentLoaded", () => {
    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!monthYearElement || !datesElement) return;

    let currentDate = new Date();

    function updateCalendar() {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        const totalDays = lastDay.getDate();

        // Convert JS Sunday start → Monday start
        const firstDayIndex = (firstDay.getDay() + 6) % 7;
        const lastDayIndex = (lastDay.getDay() + 6) % 7;

        const monthYearString = currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        monthYearElement.textContent = monthYearString;

        let datesHTML = '';

        // Previous month's ending days
        const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
            datesHTML += `<div class="date inactive">${prevLastDay - i + 1}</div>`;
        }

        // Current month days
        const today = new Date();
        today.setHours(0,0,0,0); // remove time

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentYear, currentMonth, i);
            date.setHours(0,0,0,0);

            const isToday = date.getTime() === today.getTime();
            const activeClass = isToday ? 'active' : '';

            datesHTML += `<div class="date ${activeClass}">${i}</div>`;
        }

        // Next month's starting days
        const remaining = 42 - (firstDayIndex + totalDays);
        for (let i = 1; i <= remaining; i++) {
            datesHTML += `<div class="date inactive">${i}</div>`;
        }

        datesElement.innerHTML = datesHTML;
    }

    // Buttons
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    // 🔥 THIS WAS MISSING
    updateCalendar();
});

//-------------Timer------------------
const Days = document.getElementById('days'); 
const Hours = document.getElementById('hours'); 
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds'); 

const targetDate = new Date("2026-03-06T00:00:00").getTime();

function timer() {
    const currentDate = new Date().getTime(); 
    const distance = targetDate - currentDate; 

    const days = Math.floor(distance / (1000 * 60 * 60 * 24)); 
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24); 
    const minutes = Math.floor((distance / (1000 * 60)) % 60); 
    const seconds = Math.floor((distance / 1000) % 60);

    Days.innerHTML = days; 
    Hours.innerHTML = hours; 
    Minutes.innerHTML = minutes; 
    Seconds.innerHTML = seconds; 
}

setInterval(timer, 1000);
timer(); // run once immediately
