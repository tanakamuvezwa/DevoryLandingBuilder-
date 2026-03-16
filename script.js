// ==== STATE MANAGEMENT ====
let currentStep = 'home'; // 'home', 'categories', 'themes', 'editor', 'admin'

let currentUser = null;
let authMode = 'signup'; // 'signup' or 'login'

let adminUsersList = [];
let editingUserId = null;

let projectData = {
    category: '', themeId: '',
    title: '', subtitle: '', color: '',
    logoUrl: '', whatsapp: '', email: '', address: '', formspreeId: '',
    font: '', titleColor: '', subtitleColor: '', textColor: '#1e293b', heroBgType: 'solid', gradientColor2: '#8b5cf6',
    showServices: true, servicesTitle: '',
    s1Title: '', s1Desc: '', s2Title: '', s2Desc: '', s3Title: '', s3Desc: '',
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

const fontOptions = ['Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Roboto', 'Raleway', 'Nunito', 'Lato', 'Oswald', 'DM Sans', 'Space Grotesk'];

const gradientPresets = [
    { from: '#6366f1', to: '#8b5cf6', label: 'Indigo Purple' },
    { from: '#0ea5e9', to: '#06b6d4', label: 'Sky Cyan' },
    { from: '#f43f5e', to: '#f97316', label: 'Rose Orange' },
    { from: '#10b981', to: '#06b6d4', label: 'Emerald Cyan' },
    { from: '#8b5cf6', to: '#ec4899', label: 'Purple Pink' },
    { from: '#f59e0b', to: '#ef4444', label: 'Amber Red' },
    { from: '#1d4ed8', to: '#7c3aed', label: 'Blue Violet' },
    { from: '#0f172a', to: '#334155', label: 'Dark Slate' },
    { from: '#14b8a6', to: '#6366f1', label: 'Teal Indigo' },
    { from: '#dc2626', to: '#9f1239', label: 'Red Rose' }
];

const catServiceIcons = {
    Clinic: [
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    ],
    Fitness: [
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    ],
    Hotel: [
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6l3 3m0 0l3-3m-3 3V2m0 16l-3-3m3 3l3-3"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>'
    ],
    Transfer: [
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>',
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    ]
};

const catServiceDefaults = {
    Clinic: [
        { title: 'Patient Care', desc: 'Compassionate, personalized healthcare for every patient.' },
        { title: 'Health Check', desc: 'Comprehensive diagnostics and screening services.' },
        { title: 'Quick Appointment', desc: 'Book same-day or next-day appointments easily.' }
    ],
    Fitness: [
        { title: 'Power Training', desc: 'High-intensity workouts designed to maximize your strength.' },
        { title: 'Fitness Programs', desc: 'Tailored plans for all fitness levels and goals.' },
        { title: 'Nutrition Plans', desc: 'Custom meal plans to fuel your performance.' }
    ],
    Hotel: [
        { title: 'Luxury Rooms', desc: 'Elegant, fully-equipped rooms for ultimate comfort.' },
        { title: 'Fine Dining', desc: 'World-class cuisine prepared by our expert chefs.' },
        { title: 'Premium Service', desc: 'Five-star hospitality from check-in to checkout.' }
    ],
    Transfer: [
        { title: 'Airport Pickup', desc: 'On-time, comfortable transfers from any airport.' },
        { title: 'City Tours', desc: 'Explore the city in style with our guided tours.' },
        { title: '24/7 Dispatch', desc: 'Available around the clock for your transport needs.' }
    ]
};

// Icon SVG paths per category — color and name are dynamic (from primary color + title)
const catLogoConfig = {
    Clinic:   { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>' },
    Fitness:  { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>' },
    Hotel:    { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>' },
    Transfer: { svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>' }
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
    checkAuth();
    loadProjectFromBackend();
});

// ==== AUTH & ADMIN LOGIC ====
function checkAuth() {
    const savedUser = localStorage.getItem('devory_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch(e){}
    }
    updateAuthUI();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('nav-login-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const manageBtn = document.getElementById('nav-manage-btn');
    const userName = document.getElementById('nav-user-name');
    
    if (currentUser) {
        if(loginBtn) loginBtn.classList.add('hidden');
        if(logoutBtn) logoutBtn.classList.remove('hidden');
        if(userName) {
            userName.textContent = currentUser.name;
            userName.classList.remove('hidden');
        }
        if (manageBtn) {
            if (currentUser.role === 'admin') manageBtn.classList.remove('hidden');
            else manageBtn.classList.add('hidden');
        }
    } else {
        if(loginBtn) loginBtn.classList.remove('hidden');
        if(logoutBtn) logoutBtn.classList.add('hidden');
        if(manageBtn) manageBtn.classList.add('hidden');
        if(userName) userName.classList.add('hidden');
    }
}

function startSignup(plan) {
    if (currentUser) {
        startBuilding();
        return;
    }
    authMode = 'signup';
    document.getElementById('auth-plan').value = plan;
    renderAuthModal();
    document.getElementById('auth-modal').classList.remove('hidden');
}

function openLoginModal() {
    authMode = 'login';
    renderAuthModal();
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-generated-creds').classList.add('hidden');
    document.getElementById('auth-form').classList.remove('hidden');
    document.getElementById('auth-toggle-container').classList.remove('hidden');
}

function toggleAuthMode() {
    authMode = authMode === 'signup' ? 'login' : 'signup';
    renderAuthModal();
}

function renderAuthModal() {
    const title = document.getElementById('auth-title');
    const nameGroup = document.getElementById('auth-name-group');
    const passGroup = document.getElementById('auth-password-group');
    const toggleLink = document.getElementById('auth-toggle-link');
    const submitBtn = document.getElementById('auth-submit-btn');
    const errorMsg = document.getElementById('auth-error');

    errorMsg.classList.add('hidden');
    
    if (authMode === 'signup') {
        title.textContent = 'Sign Up';
        nameGroup.classList.remove('hidden');
        passGroup.classList.add('hidden');
        toggleLink.textContent = 'Already have an account? Log in';
        submitBtn.textContent = 'Complete Signup';
        document.getElementById('auth-password').removeAttribute('required');
        document.getElementById('auth-name').setAttribute('required', 'true');
    } else {
        title.textContent = 'Log In';
        nameGroup.classList.add('hidden');
        passGroup.classList.remove('hidden');
        toggleLink.textContent = 'Need an account? Sign up';
        submitBtn.textContent = 'Log In';
        document.getElementById('auth-password').setAttribute('required', 'true');
        document.getElementById('auth-name').removeAttribute('required');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const errorMsg = document.getElementById('auth-error');
    errorMsg.classList.add('hidden');

    try {
        if (authMode === 'signup') {
            const name = document.getElementById('auth-name').value;
            const plan = document.getElementById('auth-plan').value;
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, plan })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');
            
            currentUser = data.user;
            localStorage.setItem('devory_user', JSON.stringify(currentUser));
            updateAuthUI();

            document.getElementById('auth-form').classList.add('hidden');
            document.getElementById('auth-toggle-container').classList.add('hidden');
            document.getElementById('auth-generated-creds').classList.remove('hidden');
            document.getElementById('gen-email').textContent = currentUser.email;
            document.getElementById('gen-password').textContent = data.generatedPassword;

        } else {
            const password = document.getElementById('auth-password').value;
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            
            currentUser = data.user;
            localStorage.setItem('devory_user', JSON.stringify(currentUser));
            updateAuthUI();
            closeAuthModal();
            startBuilding();
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
}

function closeAuthModalAndStart() {
    closeAuthModal();
    startBuilding();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('devory_user');
    updateAuthUI();
    goToHomeSection('top');
}

// ==== ADMIN SPECIFIC LOGIC ====
function openAdminLogin() {
    document.getElementById('admin-auth-modal').classList.remove('hidden');
}

function closeAdminLogin() {
    document.getElementById('admin-auth-modal').classList.add('hidden');
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-login-email').value;
    const password = document.getElementById('admin-login-password').value;
    const errorMsg = document.getElementById('admin-login-error');
    errorMsg.classList.add('hidden');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        if (data.user.role !== 'admin') throw new Error('Access denied. Administrator privileges required.');
        
        currentUser = data.user;
        localStorage.setItem('devory_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeAdminLogin();
        showAdminDashboard();
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
}

function openUserModal(id = null) {
    editingUserId = id;
    const errorMsg = document.getElementById('admin-user-error');
    errorMsg.classList.add('hidden');

    if (id) {
        document.getElementById('admin-user-modal-title').textContent = 'Edit User';
        const user = adminUsersList.find(u => String(u.id) === String(id));
        if (user) {
            document.getElementById('admin-user-name').value = user.name || '';
            document.getElementById('admin-user-email').value = user.email || '';
            document.getElementById('admin-user-password').value = user.password || '';
            document.getElementById('admin-user-plan').value = user.plan || 'Starter';
            document.getElementById('admin-user-role').value = user.role || 'user';
        }
    } else {
        document.getElementById('admin-user-modal-title').textContent = 'Add User';
        document.getElementById('admin-user-form').reset();
    }
    document.getElementById('admin-user-modal').classList.remove('hidden');
}

function closeUserModal() {
    editingUserId = null;
    document.getElementById('admin-user-modal').classList.add('hidden');
}

async function saveAdminUser(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('admin-user-name').value,
        email: document.getElementById('admin-user-email').value,
        password: document.getElementById('admin-user-password').value,
        plan: document.getElementById('admin-user-plan').value,
        role: document.getElementById('admin-user-role').value,
    };

    const errorEl = document.getElementById('admin-user-error');
    errorEl.classList.add('hidden');

    try {
        const method = editingUserId ? 'PUT' : 'POST';
        const url = editingUserId ? `/api/admin/users/${editingUserId}` : `/api/admin/users`;
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        let data = {};
        try { data = await res.json(); } catch(jsonErr) {}

        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        closeUserModal();
        showAdminDashboard();
    } catch (err) {
        errorEl.textContent = err.message || 'Operation failed. Is the server running?';
        errorEl.classList.remove('hidden');
    }
}

async function deleteAdminUser(id) {
    if (String(id) === '1') return;
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        let data = {};
        try { data = await res.json(); } catch(jsonErr) {}
        if (!res.ok) throw new Error(data.error || `Delete failed (${res.status})`);
        showAdminDashboard();
    } catch (err) {
        alert('Failed to delete user: ' + err.message);
    }
}

async function showAdminDashboard() {
    currentStep = 'admin';
    updateViews();
    try {
        const res = await fetch('/api/admin/users?_t=' + Date.now(), { cache: 'no-store' });
        const users = await res.json();
        adminUsersList = users;
        const tbody = document.getElementById('admin-users-list');
        if(tbody) {
            tbody.innerHTML = users.map(u => `
                <tr class="hover:bg-slate-50">
                    <td class="p-4 text-slate-900 font-medium">${u.name}</td>
                    <td class="p-4 text-slate-600">${u.email}</td>
                    <td class="p-4 font-mono text-sm text-indigo-600">${u.password}</td>
                    <td class="p-4"><span class="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">${u.plan || 'Starter'}</span></td>
                    <td class="p-4 text-sm text-slate-500 capitalize">${u.role}</td>
                    <td class="p-4 text-right">
                        <button onclick="openUserModal('${u.id}')" class="text-indigo-600 hover:text-indigo-800 font-semibold text-sm mr-3">Edit</button>
                        <button onclick="deleteAdminUser('${u.id}')" ${String(u.id) === '1' ? 'disabled' : ''} class="${String(u.id) === '1' ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'} font-semibold text-sm">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error('Failed to load users', err);
    }
}

async function loadProjectFromBackend() {
    // Load from localStorage first (primary – works on Vercel too)
    const saved = localStorage.getItem('devory_project');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.themeId) projectData = parsed;
        } catch (e) { console.error('Could not parse saved project', e); }
    }
    try { history.replaceState({ step: 'home', data: JSON.parse(JSON.stringify(projectData)) }, ''); } catch (e) { }
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
    if (!currentUser) {
        startSignup('Starter');
        return;
    }
    if (currentUser.role === 'admin') {
        showAdminDashboard();
        return;
    }
    currentStep = 'categories';
    updateViews();
    try { history.pushState({ step: 'categories', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

function goBack() {
    if (currentStep === 'editor') { currentStep = 'themes'; updateViews(); }
    else if (currentStep === 'themes') { currentStep = 'categories'; updateViews(); }
    else if (currentStep === 'categories') { goToHomeSection('top'); }
    else if (currentStep === 'admin') { goToHomeSection('top'); }
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

    const views = ['home', 'categories', 'themes', 'editor', 'admin'];
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
        <div onclick="selectTheme('${themeKey}')" class="theme-card bg-white flex flex-col group h-[580px] relative">
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

    // Font from theme
    const fontMatch = themeDef.font.match(/\['(.+?)'\]/);
    projectData.font = fontMatch ? fontMatch[1].replace(/_/g, ' ') : 'Inter';

    // Hero style reset
    projectData.heroBgType = 'solid';
    projectData.gradientColor2 = '#8b5cf6';
    projectData.textColor = '#1e293b';
    // Title/subtitle default colors from theme general tone
    const isDarkTheme = themeId === 'Brutalist' || themeId === 'CorporatePro';
    projectData.titleColor = isDarkTheme ? '#000000' : '#0f172a';
    projectData.subtitleColor = '#64748b';

    // Service defaults from category
    const svcDefs = catServiceDefaults[projectData.category] || [
        { title: 'Premium Quality', desc: 'We offer top-tier services tailored to meet all your needs.' },
        { title: 'Expert Team', desc: 'Our professionals are highly trained and ready to assist you.' },
        { title: '24/7 Support', desc: 'We are always available to answer your questions and concerns.' }
    ];
    projectData.servicesTitle = 'Our Services';
    projectData.showServices = true;
    projectData.s1Title = svcDefs[0].title; projectData.s1Desc = svcDefs[0].desc;
    projectData.s2Title = svcDefs[1].title; projectData.s2Desc = svcDefs[1].desc;
    projectData.s3Title = svcDefs[2].title; projectData.s3Desc = svcDefs[2].desc;

    currentStep = 'editor';
    updateViews();
    updateInputs();
    updatePreview();

    try { history.pushState({ step: 'editor', data: JSON.parse(JSON.stringify(projectData)) }, ""); } catch (e) { }
}

function toggleSection(id) {
    const body = document.getElementById(id);
    const chevId = 'chev-' + id.replace('sec-', '');
    const chev = document.getElementById(chevId);
    if (!body) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    if (chev) chev.classList.toggle('open', isHidden);
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
    attachSafe('input-color', 'input', (e) => {
        projectData.color = e.target.value;
        const hexEl = document.getElementById('input-color-hex');
        if (hexEl) hexEl.value = e.target.value;
        updatePreview(); saveEditToHistory();
    });
    attachSafe('input-color-hex', 'input', (e) => {
        let v = e.target.value;
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            projectData.color = v;
            const colorEl = document.getElementById('input-color');
            if (colorEl) colorEl.value = v;
            updatePreview(); saveEditToHistory();
        }
    });
    attachSafe('input-text-color', 'input', (e) => {
        projectData.textColor = e.target.value;
        const hexEl = document.getElementById('input-text-color-hex');
        if (hexEl) hexEl.value = e.target.value;
        updatePreview(); saveEditToHistory();
    });
    attachSafe('input-text-color-hex', 'input', (e) => {
        let v = e.target.value;
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            projectData.textColor = v;
            const colorEl = document.getElementById('input-text-color');
            if (colorEl) colorEl.value = v;
            updatePreview(); saveEditToHistory();
        }
    });
    attachSafe('input-title-color', 'input', (e) => {
        projectData.titleColor = e.target.value;
        const hexEl = document.getElementById('input-title-color-hex');
        if (hexEl) hexEl.value = e.target.value;
        updatePreview(); saveEditToHistory();
    });
    attachSafe('input-title-color-hex', 'input', (e) => {
        let v = e.target.value;
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            projectData.titleColor = v;
            const el = document.getElementById('input-title-color');
            if (el) el.value = v;
            updatePreview(); saveEditToHistory();
        }
    });
    attachSafe('input-subtitle-color', 'input', (e) => {
        projectData.subtitleColor = e.target.value;
        const hexEl = document.getElementById('input-subtitle-color-hex');
        if (hexEl) hexEl.value = e.target.value;
        updatePreview(); saveEditToHistory();
    });
    attachSafe('input-subtitle-color-hex', 'input', (e) => {
        let v = e.target.value;
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            projectData.subtitleColor = v;
            const el = document.getElementById('input-subtitle-color');
            if (el) el.value = v;
            updatePreview(); saveEditToHistory();
        }
    });
    attachSafe('input-gradient-color2', 'input', (e) => { projectData.gradientColor2 = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('toggle-services', 'change', (e) => { projectData.showServices = e.target.checked; updatePreview(); saveEditToHistory(); });
    attachSafe('input-services-title', 'input', (e) => { projectData.servicesTitle = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s1-title', 'input', (e) => { projectData.s1Title = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s1-desc', 'input', (e) => { projectData.s1Desc = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s2-title', 'input', (e) => { projectData.s2Title = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s2-desc', 'input', (e) => { projectData.s2Desc = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s3-title', 'input', (e) => { projectData.s3Title = e.target.value; updatePreview(); saveEditToHistory(); });
    attachSafe('input-s3-desc', 'input', (e) => { projectData.s3Desc = e.target.value; updatePreview(); saveEditToHistory(); });
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

    renderFontSelector();
    renderGradientPresets();
    updateHeroBgUI();
}

// ==== FONT & GRADIENT HELPERS ====
function renderFontSelector() {
    const container = document.getElementById('font-selector');
    if (!container) return;
    container.innerHTML = `<div class="grid grid-cols-2 gap-1.5 w-full">${fontOptions.map(f =>
        `<button class="font-btn ${projectData.font === f ? 'active' : ''}" style="font-family:'${f}',sans-serif" onclick="selectFont('${f}')">${f}</button>`
    ).join('')}</div>`;
}

function selectFont(fontName) {
    projectData.font = fontName;
    renderFontSelector();
    updatePreview();
}

function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
        projectData.logoUrl = ev.target.result;
        updatePreview();
    };
    r.readAsDataURL(file);
}

function renderGradientPresets() {
    const container = document.getElementById('gradient-presets');
    if (!container) return;
    container.innerHTML = gradientPresets.map(g =>
        `<div class="grad-swatch" title="${g.label}" style="background:linear-gradient(135deg,${g.from},${g.to})" onclick="applyGradientPreset('${g.from}','${g.to}')"></div>`
    ).join('');
}

function applyGradientPreset(from, to) {
    projectData.color = from;
    projectData.gradientColor2 = to;
    const colorEl = document.getElementById('input-color');
    if (colorEl) colorEl.value = from;
    const hexEl = document.getElementById('input-color-hex');
    if (hexEl) hexEl.value = from;
    const c2El = document.getElementById('input-gradient-color2');
    if (c2El) c2El.value = to;
    updatePreview();
}

function setHeroBgType(type) {
    projectData.heroBgType = type;
    updateHeroBgUI();
    updatePreview();
}

function updateHeroBgUI() {
    const solidBtn = document.getElementById('hero-type-solid');
    const gradBtn = document.getElementById('hero-type-gradient');
    const gradOpts = document.getElementById('gradient-options');
    const isGrad = projectData.heroBgType === 'gradient';
    if (solidBtn) solidBtn.classList.toggle('active', !isGrad);
    if (gradBtn) gradBtn.classList.toggle('active', isGrad);
    if (gradOpts) gradOpts.classList.toggle('hidden', !isGrad);
}

function updatePreview() {
    const activeTheme = themeSystems[projectData.themeId];
    if (!activeTheme) return;

    // Build font class from projectData.font (user override) or theme default
    const fontClass = projectData.font
        ? `font-['${projectData.font.replace(/ /g, '_')}']`
        : activeTheme.font;

    // Apply strict structural design classes
    const canvas = document.getElementById('live-preview-canvas');
    if (canvas) canvas.className = `bg-white w-full max-w-5xl mx-auto shadow-2xl overflow-hidden flex flex-col transition-all mb-10 ${fontClass} ${activeTheme.canvasWrapper} ${activeTheme.general}`;

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

    // Services section
    const srvSection = document.getElementById('preview-services');
    if (srvSection) srvSection.style.display = projectData.showServices !== false ? 'block' : 'none';
    setTxt('preview-services-title', projectData.servicesTitle || 'Our Services');
    setTxt('preview-s1-title', projectData.s1Title || 'Premium Quality');
    setTxt('preview-s1-desc', projectData.s1Desc || 'We offer top-tier services tailored to meet all your needs.');
    setTxt('preview-s2-title', projectData.s2Title || 'Expert Team');
    setTxt('preview-s2-desc', projectData.s2Desc || 'Our professionals are highly trained and ready to assist you.');
    setTxt('preview-s3-title', projectData.s3Title || '24/7 Support');
    setTxt('preview-s3-desc', projectData.s3Desc || 'We are always available to answer your questions and concerns.');

    // Category icons
    const icons = catServiceIcons[projectData.category];
    if (icons) {
        ['preview-s1-icon', 'preview-s2-icon', 'preview-s3-icon'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = icons[i];
        });
    }

    // 🔥 LIVE SMART COLOR ENGINE 🔥
    const rawColor = projectData.color || '#4f46e5';
    const contrastOnColor = getContrastColor(rawColor);

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
        el.style.color = contrastOnColor;
    });
    document.querySelectorAll('.dynamic-text').forEach(el => {
        el.style.color = rawColor;
    });

    // Hero background: solid or gradient
    const heroBgEl = document.getElementById('preview-hero-bg');
    if (heroBgEl) {
        if (projectData.heroBgType === 'gradient') {
            const c2 = projectData.gradientColor2 || '#8b5cf6';
            heroBgEl.style.background = `linear-gradient(135deg, ${rawColor}, ${c2})`;
            heroBgEl.style.backgroundColor = '';
        } else {
            heroBgEl.style.background = '';
            heroBgEl.style.backgroundColor = lightBg;
        }
    }
    document.querySelectorAll('.dynamic-light-bg').forEach(el => {
        if (el.id !== 'preview-hero-bg') el.style.backgroundColor = lightBg;
    });

    // Body text color
    const bodyTextColor = projectData.textColor || '#1e293b';
    if (canvas) canvas.style.color = bodyTextColor;

    // Apply hero title and subtitle colors
    const titleEl = document.getElementById('preview-title');
    if (titleEl) titleEl.style.color = projectData.titleColor || '#0f172a';
    const subtitleEl = document.getElementById('preview-subtitle');
    if (subtitleEl) subtitleEl.style.color = projectData.subtitleColor || '#64748b';

    // Logo placeholder — icon uses category SVG, color and name sync with primary color + title
    const logoImg = document.getElementById('preview-logo-img');
    const logoPlaceholder = document.getElementById('preview-logo-placeholder');
    const logoIconWrap = document.getElementById('preview-logo-icon-wrap');
    const logoIconSvg = document.getElementById('preview-logo-icon-svg');
    const logoText = document.getElementById('preview-logo-text');

    if (projectData.logoUrl) {
        if (logoImg) { logoImg.src = projectData.logoUrl; logoImg.classList.remove('hidden'); }
        if (logoPlaceholder) logoPlaceholder.style.display = 'none';
    } else {
        if (logoImg) logoImg.classList.add('hidden');
        if (logoPlaceholder) logoPlaceholder.style.display = '';

        // Icon: category-specific SVG, background = primary color
        const logoCfg = catLogoConfig[projectData.category];
        if (logoIconWrap) logoIconWrap.style.background = rawColor;
        if (logoIconSvg && logoCfg) logoIconSvg.innerHTML = logoCfg.svgPath;

        // Name: derived from the hero title (max 2 words), color = primary color
        const logoName = projectData.title
            ? projectData.title.split(' ').slice(0, 2).join(' ')
            : (projectData.category || 'Brand');
        if (logoText) { logoText.textContent = logoName; logoText.style.color = rawColor; }
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
    setVal('input-color-hex', projectData.color || '');
    setVal('input-text-color', projectData.textColor || '#1e293b');
    setVal('input-text-color-hex', projectData.textColor || '#1e293b');
    setVal('input-title-color', projectData.titleColor || '#0f172a');
    setVal('input-title-color-hex', projectData.titleColor || '#0f172a');
    setVal('input-subtitle-color', projectData.subtitleColor || '#64748b');
    setVal('input-subtitle-color-hex', projectData.subtitleColor || '#64748b');
    setVal('input-gradient-color2', projectData.gradientColor2 || '#8b5cf6');
    setVal('input-whatsapp', projectData.whatsapp);
    setVal('input-email', projectData.email);
    setVal('input-address', projectData.address);
    setVal('input-formspree', projectData.formspreeId || '');

    setVal('input-services-title', projectData.servicesTitle || '');
    setVal('input-s1-title', projectData.s1Title || '');
    setVal('input-s1-desc', projectData.s1Desc || '');
    setVal('input-s2-title', projectData.s2Title || '');
    setVal('input-s2-desc', projectData.s2Desc || '');
    setVal('input-s3-title', projectData.s3Title || '');
    setVal('input-s3-desc', projectData.s3Desc || '');

    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    setCheck('toggle-services', projectData.showServices !== false);
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

    renderFontSelector();
    renderGradientPresets();
    updateHeroBgUI();
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
    // Save to localStorage (works everywhere including Vercel)
    localStorage.setItem('devory_project', JSON.stringify(projectData));
    // Also notify the API endpoint (no-op on Vercel, persists on local Express)
    try {
        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
    } catch (e) { /* backend may not be running, localStorage is the fallback */ }
    showToast('Draft Saved!');
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