const navs = document.querySelectorAll('.nav-list li');
const sections = document.querySelectorAll('.section');

navs.forEach((item, idx) => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-list li.active')?.classList.remove('active');
        item.classList.add('active');

        sections.forEach(sec => sec.classList.remove('active'));
        sections[idx].classList.add('active');
    });
});