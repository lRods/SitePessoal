// Language toggle logic
let currentLanguage = 'en'; // Default to English
let originalTexts = new Map(); // Store original textContent and attributes

async function loadTranslations() {
    try {
        const response = await fetch('assets/translations.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

function storeOriginalTexts() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        if (element.children.length === 0 && element.textContent.includes('{{')) {
            originalTexts.set(element, element.textContent);
        }
        if (element.hasAttribute('title') && element.getAttribute('title').includes('{{')) {
            originalTexts.set(element, { text: element.textContent, title: element.getAttribute('title') });
        }
    });
}

function applyTranslations(translations, language) {
    // First, revert to original texts
    originalTexts.forEach((original, element) => {
        if (typeof original === 'string') {
            element.textContent = original;
        } else {
            element.textContent = original.text;
            element.setAttribute('title', original.title);
        }
    });

    // Then apply new translations
    originalTexts.forEach((original, element) => {
        if (typeof original === 'string') {
            element.textContent = original.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                return translations[key] ? translations[key][language] : match;
            });
        } else {
            element.textContent = original.text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                return translations[key] ? translations[key][language] : match;
            });
            element.setAttribute('title', original.title.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                return translations[key] ? translations[key][language] : match;
            }));
        }
    });
}

function initEntryAnimation() {
    const targets = [
        'header h1',
        'header h2',
        'header p',
        '#social-links',
        'header ul li',
        '#sobre h3',
        '#sobre p',
        '#experiencia h3',
        '.inst-card',
        '#formacao h3',
        '#formacao .inst-card'
    ];

    const elements = targets
        .map(selector => Array.from(document.querySelectorAll(selector)))
        .flat();

    elements.forEach(el => el.classList.add('fade-up-init'));
    elements.forEach((el, index) => {
        setTimeout(() => el.classList.add('fade-up-in'), 120 + index * 80);
    });
}

async function toggleLanguage() {
    const root = document.getElementById('total');
    if (root) {
        root.classList.add('fade-swap', 'fade-hidden');
    }

    const translations = await loadTranslations();
    await new Promise(resolve => setTimeout(resolve, 160));

    currentLanguage = currentLanguage === 'en' ? 'pt' : 'en';
    applyTranslations(translations, currentLanguage);
    const langIndicator = document.getElementById('lang-indicator');
    if (langIndicator) {
        langIndicator.textContent = currentLanguage.toUpperCase();
    }

    if (root) {
        root.classList.remove('fade-hidden');
    }
}

// Load default language on page load
document.addEventListener('DOMContentLoaded', async () => {
    storeOriginalTexts();
    initEntryAnimation();
    const translations = await loadTranslations();
    applyTranslations(translations, currentLanguage);
    const total = document.getElementById('total');
    if (total) {
        total.classList.remove('preload-hidden');
        total.classList.add('preload-visible');
    }
});

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