const sidebar = document.querySelector(".sidebar"); 
const sidebarToggler = document.querySelector(".toggler"); 

// Toggle sidebar's collapsed state 
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed"); 
})

const countdowns = document.querySelectorAll(".countdown");

function updateCountdowns() {
    const now = new Date().getTime();

    countdowns.forEach(item => {
        const targetDate = new Date(item.dataset.date).getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            item.textContent = "Deadline reached ✅";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        item.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
    });
}

// Initial run
updateCountdowns();

// Update every minute
setInterval(updateCountdowns, 1000);
