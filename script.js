// ==== STATE MANAGEMENT ====
let currentStep = 'home'; // 'home', 'categories', 'themes', 'editor'

let projectData = {
    category: '', themeId: '',
    title: '', subtitle: '', color: '',
    logoUrl: '', whatsapp: '', email: '', address: '', formspreeId: '',
    showTestimonials: true, showFaq: true, showMap: true,
    t1Text: '', t1Author: '', t2Text: '', t2Author: '',
    f1Q: '', f1A: '', f2Q: '', f2A: ''
};

// ==== TEMPLATE DEFAULTS ====
const catDefaults = {
    Clinic: { title: "Advanced Clinic Care", sub: "Professional and compassionate healthcare tailored to your needs." },
    Fitness: { title: "Elite Fitness Center", sub: "Push your limits, achieve your goals, and transform your body." },
    Hotel: { title: "Grand Luxury Resort", sub: "Experience unforgettable moments and elegant luxury." },
    Transfer: { title: "VIP Transport Services", sub: "Reliable, fast, and secure transport for your journey." }
};

// ==== THEME ENGINE (5 Distinct Designs) ====
const themeSystems = {
    SoftMinimal: {
        name: "Soft Minimal", desc: "Clean layout, soft corners.", color: "#0ea5e9",
        font: "font-['Inter']", title: "font-extrabold tracking-tight text-slate-900", general: "text-slate-800",
        btnMain: "rounded-xl font-bold shadow-md border-0",
        btnWa: "rounded-xl font-bold shadow-sm border border-slate-200 bg-white text-slate-700",
        card: "rounded-2xl border border-slate-100 shadow-sm bg-white",
        hero: "bg-slate-50 border-b border-slate-100",
        canvasWrapper: "rounded-2xl border-0"
    },
    Brutalist: {
        name: "Brutalist Impact", desc: "Sharp edges, heavy borders.", color: "#e11d48",
        font: "font-['Montserrat']", title: "font-black uppercase tracking-tighter text-black", general: "text-black",
        btnMain: "rounded-none font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        btnWa: "rounded-none font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black",
        card: "rounded-none border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white",
        hero: "bg-white border-b-4 border-black",
        canvasWrapper: "rounded-none border-4 border-black"
    },
    Elegant: {
        name: "Elegant Serif", desc: "Refined luxury, serif font.", color: "#d97706",
        font: "font-['Playfair_Display']", title: "font-bold tracking-wide text-stone-900", general: "text-stone-800",
        btnMain: "rounded-none font-semibold uppercase tracking-widest text-sm shadow-md",
        btnWa: "rounded-none font-semibold uppercase tracking-widest text-sm shadow-sm border border-stone-300 bg-stone-50 text-stone-800",
        card: "rounded-none border border-stone-200 shadow-sm bg-stone-50",
        hero: "bg-stone-100 border-b border-stone-200",
        canvasWrapper: "rounded-none border border-stone-300"
    },
    VibrantModern: {
        name: "Vibrant Modern", desc: "Floating elements, pill buttons.", color: "#8b5cf6",
        font: "font-['Poppins']", title: "font-extrabold tracking-tight text-slate-900", general: "text-slate-800",
        btnMain: "rounded-full font-bold shadow-xl shadow-current/30 border-0",
        btnWa: "rounded-full font-bold shadow-md border border-slate-100 bg-white text-slate-800",
        card: "rounded-3xl border border-slate-100 shadow-xl bg-white",
        hero: "bg-slate-50 border-b border-slate-100",
        canvasWrapper: "rounded-[2rem] border-0"
    },
    CorporatePro: {
        name: "Corporate Pro", desc: "Standard professional layout.", color: "#1d4ed8",
        font: "font-['Roboto']", title: "font-bold text-gray-800", general: "text-gray-700",
        btnMain: "rounded font-medium shadow-sm border-0",
        btnWa: "rounded font-medium shadow-sm border border-gray-300 bg-white text-gray-800",
        card: "rounded border border-gray-200 shadow bg-white",
        hero: "bg-gray-100 border-b border-gray-300",
        canvasWrapper: "rounded-lg border border-gray-200"
    }
};

// Global Contrast Calculator
function getContrastColor(hex) {
    try {
        let h = hex.replace("#", "");
        if (h.length === 3) h = h.split('').map(x => x + x).join('');
        const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
        return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128 ? '#000000' : '#ffffff';
    } catch (e) { return '#ffffff'; }
}

// ==== APP INITIALIZATION ====
document.addEventListener('DOMContentLoaded', () => {
    setupListeners();
    loadProjectFromBackend();
});

async function loadProjectFromBackend() {
    try {
        const res = await fetch('http://localhost:3000/api/projects');
        if (res.ok) {
            const data = await res.json();
            if (data && Object.keys(data).length > 0 && data.themeId) {
                projectData = data;
            }
        }
    } catch (e) { console.error("Could not load project", e); }
    try { history.replaceState({ step: 'home', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

// ==== BULLETPROOF ROUTING ENGINE ====
function goToHomeSection(sectionId) {
    if (window.event) window.event.preventDefault();
    currentStep = 'home';
    updateViews();
    try { history.pushState({ step: 'home', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }

    setTimeout(() => {
        if (sectionId === 'top') {
            document.getElementById('view-home').scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.getElementById(sectionId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }, 50);
}

function startBuilding() {
    currentStep = 'categories';
    updateViews();
    try { history.pushState({ step: 'categories', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

function goBack() {
    if (currentStep === 'editor') { currentStep = 'themes'; updateViews(); }
    else if (currentStep === 'themes') { currentStep = 'categories'; updateViews(); }
    else if (currentStep === 'categories') { goToHomeSection('top'); }
}

// Browser back button support (safely wrapped)
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.step) {
        currentStep = e.state.step;
        if (e.state.data) projectData = e.state.data;

        if (currentStep === 'themes' && projectData.category) {
            const sub = document.getElementById('theme-category-subtitle');
            if (sub) sub.textContent = `For ${projectData.category} Industry`;
            renderThemesGrid(projectData.category);
        } else if (currentStep === 'editor' && projectData.themeId) {
            updateInputs();
            updatePreview();
        }
        updateViews();
    } else {
        currentStep = 'home';
        updateViews();
    }
});

// Safely toggle all views without crashing
function updateViews() {
    window.scrollTo(0, 0);

    const views = ['home', 'categories', 'themes', 'editor'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
            if (currentStep === v) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    });

    const isApp = currentStep !== 'home';
    const isEditor = currentStep === 'editor';

    const toggleSafe = (id, show) => {
        const el = document.getElementById(id);
        if (el) {
            if (show) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    };

    toggleSafe('nav-marketing-links', !isApp);
    toggleSafe('nav-start-btn', !isApp);
    toggleSafe('nav-back-btn', isApp);
    toggleSafe('nav-save-btn', isEditor);
    toggleSafe('nav-export-html-btn', isEditor);
    toggleSafe('nav-export-zip-btn', isEditor);
}

// ==== THEME SELECTION & RENDERING ====
function selectCategory(catName) {
    projectData.category = catName;

    const subTitle = document.getElementById('theme-category-subtitle');
    if (subTitle) subTitle.textContent = `For ${catName} Industry`;

    renderThemesGrid(catName);

    currentStep = 'themes';
    updateViews();

    try { history.pushState({ step: 'themes', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

function renderThemesGrid(catName) {
    const grid = document.getElementById('theme-grid');
    if (!grid) return;

    let htmlOutput = '';
    const defaultData = catDefaults[catName] || { title: "Landing Page", sub: "Premium Quality Services" };

    Object.keys(themeSystems).forEach(themeKey => {
        const theme = themeSystems[themeKey];
        const textCol = getContrastColor(theme.color);

        htmlOutput += `
        <div onclick="selectTheme('${themeKey}')" class="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group h-[600px] relative">
            <div class="absolute inset-0 z-10"></div>
            
            <div class="flex-1 overflow-hidden pointer-events-none select-none flex flex-col ${theme.font} border-b bg-slate-50 hide-scroll">
                <div class="h-full w-full flex flex-col origin-top transform group-hover:scale-[1.03] transition-transform duration-500">
                    <div class="h-10 border-b flex justify-between items-center px-4 bg-white shrink-0">
                        <div class="w-16 h-2 rounded" style="background-color: ${theme.color}"></div>
                        <div class="flex gap-2"><div class="w-4 h-1 bg-slate-300 rounded"></div><div class="w-4 h-1 bg-slate-300 rounded"></div></div>
                    </div>
                    <div class="py-12 px-4 flex flex-col items-center justify-center shrink-0 ${theme.hero}">
                        <div class="text-xl text-center ${theme.title} mb-2 leading-tight">${defaultData.title}</div>
                        <div class="w-5/6 text-[10px] text-center opacity-60 mb-6 leading-relaxed">${defaultData.sub}</div>
                        <div class="px-5 py-2 text-[10px] ${theme.btnMain}" style="background-color: ${theme.color}; color: ${textCol};">Get Started</div>
                    </div>
                    <div class="py-8 px-4 flex-1 bg-white shrink-0">
                        <div class="grid grid-cols-2 gap-3">
                            <div class="${theme.card} p-3 flex flex-col items-center"><div class="w-5 h-5 rounded mb-2" style="background-color: ${theme.color}40"></div><div class="w-full h-1.5 bg-slate-200 rounded mb-1"></div><div class="w-2/3 h-1.5 bg-slate-200 rounded"></div></div>
                            <div class="${theme.card} p-3 flex flex-col items-center"><div class="w-5 h-5 rounded mb-2" style="background-color: ${theme.color}40"></div><div class="w-full h-1.5 bg-slate-200 rounded mb-1"></div><div class="w-2/3 h-1.5 bg-slate-200 rounded"></div></div>
                        </div>
                    </div>
                    <div class="h-16 bg-slate-200 border-t shrink-0"></div>
                </div>
            </div>
            
            <div class="p-6 bg-white shrink-0 pointer-events-none relative z-0">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-4 h-4 rounded-full border" style="background-color: ${theme.color}"></div>
                    <h3 class="text-lg font-bold text-slate-800">${theme.name}</h3>
                </div>
                <p class="text-xs text-slate-500 mb-5">${theme.desc}</p>
                <div class="w-full text-center py-3 bg-slate-900 text-white rounded-lg font-bold text-sm group-hover:bg-indigo-600 transition-colors shadow-md">
                    Use this template
                </div>
            </div>
        </div>`;
    });

    grid.innerHTML = htmlOutput;
}

function selectTheme(themeId) {
    projectData.themeId = themeId;
    const def = catDefaults[projectData.category] || { title: "Title", sub: "Subtitle" };
    const themeDef = themeSystems[themeId];

    projectData.title = def.title;
    projectData.subtitle = def.sub;
    projectData.color = themeDef.color;
    projectData.email = `info@${projectData.category.toLowerCase()}brand.com`;
    projectData.address = `123 Main St, Central District`;

    currentStep = 'editor';
    updateViews();
    updateInputs();
    updatePreview();

    try { history.pushState({ step: 'editor', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

// ==== EDITOR ENGINE ====
function setupListeners() {
    const attachSafe = (id, event, callback) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, callback);
    };

    const saveEditToHistory = () => {
        try { history.replaceState({ step: currentStep, data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
    };

    attachSafe('input-title', 'input', (e) => { projectData.title = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-subtitle', 'input', (e) => { projectData.subtitle = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-color', 'input', (e) => { projectData.color = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-whatsapp', 'input', (e) => { projectData.whatsapp = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-email', 'input', (e) => { projectData.email = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-address', 'input', (e) => { projectData.address = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-formspree', 'input', (e) => { projectData.formspreeId = e.target.value; updatePreview(); saveEditToHistory(); });

    attachSafe('toggle-testimonials', 'change', (e) => { projectData.showTestimonials = e.target.checked; updatePreview(); saveEditToHistory(); });
    attachSafe('toggle-faq', 'change', (e) => { projectData.showFaq = e.target.checked; updatePreview(); saveEditToHistory(); });
    attachSafe('toggle-map', 'change', (e) => { projectData.showMap = e.target.checked; updatePreview(); saveEditToHistory(); });

    attachSafe('input-t1-text', 'input', (e) => { projectData.t1Text = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-t1-author', 'input', (e) => { projectData.t1Author = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-t2-text', 'input', (e) => { projectData.t2Text = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-t2-author', 'input', (e) => { projectData.t2Author = e.target.value; updatePreview(); saveEditToHistory(); });

    attachSafe('input-f1-q', 'input', (e) => { projectData.f1Q = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-f1-a', 'input', (e) => { projectData.f1A = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-f2-q', 'input', (e) => { projectData.f2Q = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-f2-a', 'input', (e) => { projectData.f2A = e.target.value; updatePreview(); saveEditToHistory(); });

    attachSafe('input-logo', 'change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const r = new FileReader();
            r.onload = (ev) => {
                projectData.logoUrl = ev.target.result;
                updatePreview();
                saveEditToHistory();
            };
            r.readAsDataURL(file);
        }
    });
}

function updatePreview() {
    const activeTheme = themeSystems[projectData.themeId];
    if (!activeTheme) return;

    // Apply strict structural design classes 
    const canvas = document.getElementById('live-preview-canvas');
    if (canvas) canvas.className = `bg-white w-full max-w-5xl mx-auto shadow-2xl overflow-hidden flex flex-col transition-all mb-10 ${activeTheme.fontFamily} ${activeTheme.canvasWrapper} ${activeTheme.general}`;

    const heroBg = document.getElementById('preview-hero-bg');
    if (heroBg) heroBg.className = `dynamic-light-bg px-8 py-32 text-center flex flex-col justify-center items-center transition-all ${activeTheme.hero}`;

    const title = document.getElementById('preview-title');
    if (title) title.className = `text-6xl mb-6 leading-tight max-w-4xl transition-all ${activeTheme.title}`;

    const srvTitle = document.getElementById('preview-services-title');
    if (srvTitle) srvTitle.className = `text-4xl mb-12 ${activeTheme.title}`;

    const cntTitle = document.getElementById('preview-contact-title');
    if (cntTitle) cntTitle.className = `text-4xl mb-4 ${activeTheme.title}`;

    const btnBase = "px-8 py-4 hover:opacity-90 transition-all text-lg flex items-center justify-center ";

    const btnMain = document.getElementById('preview-btn-main');
    if (btnMain) btnMain.className = `dynamic-bg ${btnBase} ${activeTheme.btnMain}`;

    const btnWa = document.getElementById('preview-whatsapp-link');
    if (btnWa) btnWa.className = `${btnBase} ${activeTheme.btnWa}`;

    const btnSub = document.getElementById('preview-btn-submit');
    if (btnSub) btnSub.className = `dynamic-bg mt-2 ${btnBase} ${activeTheme.btnMain}`;

    document.querySelectorAll('.preview-card').forEach(card => card.className = `preview-card p-8 transition-all ${activeTheme.card}`);

    // Update Text Data safely
    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setTxt('preview-title', projectData.title);
    setTxt('preview-subtitle', projectData.subtitle);
    setTxt('preview-footer-name', projectData.title);
    setTxt('preview-phone-text', projectData.whatsapp || '+1234567890');
    setTxt('preview-email-text', projectData.email);
    setTxt('preview-address-text', projectData.address);

    const toggleDisplay = (id, show) => { const el = document.getElementById(id); if (el) el.style.display = show ? 'block' : 'none'; };
    toggleDisplay('preview-testimonials', projectData.showTestimonials !== false);
    toggleDisplay('preview-faq', projectData.showFaq !== false);
    toggleDisplay('preview-map', projectData.showMap !== false);

    setTxt('preview-t1-text', projectData.t1Text || '"Amazing service! Highly recommended."');
    setTxt('preview-t1-author', projectData.t1Author || 'John Doe');
    setTxt('preview-t2-text', projectData.t2Text || '"Great experience from start to finish."');
    setTxt('preview-t2-author', projectData.t2Author || 'Jane Smith');

    function updateDetailsSummary(id, qData, defText) {
        const el = document.getElementById(id);
        if (el && el.querySelector('span')) el.querySelector('span').textContent = qData || defText;
    }
    updateDetailsSummary('preview-f1-q', projectData.f1Q, 'What are your hours?');
    setTxt('preview-f1-a', projectData.f1A || 'We are open 24/7.');
    updateDetailsSummary('preview-f2-q', projectData.f2Q, 'Do you offer refunds?');
    setTxt('preview-f2-a', projectData.f2A || 'Yes, within 30 days.');

    // 🔥 LIVE SMART COLOR ENGINE 🔥
    const rawColor = projectData.color || '#4f46e5';
    const textColor = getContrastColor(rawColor);

    const hexToRgba = (hex, opacity) => {
        try {
            let h = hex.replace("#", "");
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } catch (e) { return 'transparent'; }
    };
    const lightBg = hexToRgba(rawColor, 0.05);

    document.querySelectorAll('.dynamic-bg').forEach(el => {
        el.style.backgroundColor = rawColor;
        el.style.color = textColor;
    });
    document.querySelectorAll('.dynamic-text').forEach(el => {
        el.style.color = rawColor;
    });
    document.querySelectorAll('.dynamic-light-bg').forEach(el => {
        el.style.backgroundColor = lightBg;
    });

    // Handle Logo Visibility
    const logoImg = document.getElementById('preview-logo-img');
    const logoText = document.getElementById('preview-logo-text');
    if (logoImg && logoText) {
        if (projectData.logoUrl) {
            logoImg.src = projectData.logoUrl; logoImg.classList.remove('hidden'); logoText.classList.add('hidden');
        } else {
            logoImg.classList.add('hidden'); logoText.classList.remove('hidden'); logoText.textContent = projectData.title ? projectData.title.split(' ')[0] : 'Brand';
        }
    }

    // Handle Forms
    if (btnWa) {
        if (projectData.whatsapp) { btnWa.href = `https://wa.me/${projectData.whatsapp.replace(/\D/g, '')}`; btnWa.style.display = 'flex'; }
        else { btnWa.style.display = 'none'; }
    }

    const formEl = document.getElementById('preview-contact-form');
    if (formEl) {
        if (projectData.formspreeId) formEl.action = `https://formspree.io/f/${projectData.formspreeId}`;
        else formEl.action = '/api/contact';
    }
}

function updateInputs() {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    setVal('input-title', projectData.title);
    setVal('input-subtitle', projectData.subtitle);
    setVal('input-color', projectData.color);
    setVal('input-whatsapp', projectData.whatsapp);
    setVal('input-email', projectData.email);
    setVal('input-address', projectData.address);
    setVal('input-formspree', projectData.formspreeId || '');

    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setCheck('toggle-testimonials', projectData.showTestimonials !== false);
    setCheck('toggle-faq', projectData.showFaq !== false);
    setCheck('toggle-map', projectData.showMap !== false);

    setVal('input-t1-text', projectData.t1Text || '');
    setVal('input-t1-author', projectData.t1Author || '');
    setVal('input-t2-text', projectData.t2Text || '');
    setVal('input-t2-author', projectData.t2Author || '');

    setVal('input-f1-q', projectData.f1Q || '');
    setVal('input-f1-a', projectData.f1A || '');
    setVal('input-f2-q', projectData.f2Q || '');
    setVal('input-f2-a', projectData.f2A || '');
}

// ==== DATA SAVING & EXPORTS ====
function showToast(msg) {
    const t = document.getElementById('toast-container');
    if (!t) return;
    const msgEl = document.getElementById('toast-message');
    if (msgEl) msgEl.textContent = msg;

    t.classList.remove('hidden'); t.classList.add('toast-enter');
    setTimeout(() => { t.classList.add('hidden'); t.classList.remove('toast-enter'); }, 3000);
}

async function saveProject() {
    try {
        const res = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (res.ok) {
            showToast('Draft Saved to Backend!');
        } else {
            showToast('Error saving project');
        }
    } catch (e) { console.error(e); showToast('Error saving project'); }
}

function getFinalHTML() {
    const canvas = document.getElementById('live-preview-canvas');
    if (!canvas) return '';
    const clone = canvas.cloneNode(true);
    clone.querySelectorAll('[style*="display: none"]').forEach(el => el.remove());
    const content = clone.outerHTML;
    return `<!DOCTYPE html><html class="scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${projectData.title}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Montserrat:ital,wght@0,700;0,900;1,900&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@400;600;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"><script src="https://cdn.tailwindcss.com"><\/script></head><body class="bg-slate-50 text-slate-800 flex justify-center py-10 px-4">${content}</body></html>`;
}

function exportToHTML() {
    saveAs(new Blob([getFinalHTML()], { type: "text/html;charset=utf-8" }), "index.html");
    showToast('HTML Exported!');
}

function exportToZip() {
    const z = new JSZip();
    z.file("index.html", getFinalHTML());
    const a = z.folder("assets");
    a.file("styles.css", "html{scroll-behavior:smooth;}");
    a.file("script.js", "console.log('Site Loaded Successfully');");
    z.generateAsync({ type: "blob" }).then(c => {
        saveAs(c, `devory-${projectData.category.toLowerCase()}-landing.zip`);
        showToast('ZIP Exported!');
    });
}