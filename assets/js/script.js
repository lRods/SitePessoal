// Active navigation link logic
function activeNavLink(e) {
    let activeLink = document.querySelector(".active");
    if (e && activeLink && activeLink != e) {
        activeLink.classList.remove("active");
        e.classList.add("active");
    }
}

// Scroll spy logic
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-link");
window.onscroll = () => {
    var current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        var style = section.currentStyle || window.getComputedStyle(section);
        
        if (pageYOffset >= sectionTop - style.marginTop.replace("px", "") - 10) {
            current = section.getAttribute("nav-id");
        }
    });

    if (!current) return;
    let navLink = document.getElementById(current);
    activeNavLink(navLink);
};


// Overlay gradient follow logic
(function() {
    const body = document.querySelector('body');
    const overlay = document.getElementById('overlay');
    if (!body || !overlay) return;

    let raf = null;
    let targetX = null;
    let targetY = null;

    const update = () => {
        if (targetX !== null && targetY !== null) {
            overlay.style.setProperty('--gx', targetX + 'px');
            overlay.style.setProperty('--gy', targetY + 'px');
        }
        raf = null;
    };

    body.addEventListener('mousemove', (e) => {
        const rect = body.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        targetX = x;
        targetY = y;
        // overlay.style.opacity = '1';
        if (!raf) raf = requestAnimationFrame(update);
    });

    // body.addEventListener('mouseenter', () => {
    //     overlay.style.opacity = '1';
    // });

    // body.addEventListener('mouseleave', () => {
    //     overlay.style.opacity = '0';
    // });
})();