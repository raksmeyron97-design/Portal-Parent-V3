// Global State variables that are accessed across modules
window.loggedInStudent = null;
window.realId = "";
window.currentNotifs = [];
window.unsubNotifications = null;
window.attemptLogin = null; // Will be safely injected by the Firebase module if it loads

let currentLang = localStorage.getItem('app_lang') || 'km';
let isDarkMode = localStorage.getItem('theme') !== 'light';
let activeFocusTrap = null;
let html5QrCode;
let qrPreviousFocus;
let isIdVisible = false;

const translations = {
    km: {
        loading_data: "កំពុងរៀបចំទិន្នន័យ...",
        auth_subtitle: "សម្រាប់អាណាព្យាបាលសិស្ស",
        class_code_label: "លេខកូដថ្នាក់រៀន",
        placeholder_teacher: "ឧទាហរណ៍៖ KS9lut...",
        class_code_helper: "សួរគ្រូរបស់អ្នកសម្រាប់លេខកូដនេះ",
        student_id_label: "អត្តលេខសិស្ស",
        placeholder_student: "ឧទាហរណ៍៖ STU001",
        student_id_helper: "អត្តលេខសម្គាល់កូនរបស់អ្នក",
        login_error_default: "ព័ត៌មានមិនត្រឹមត្រូវ។",
        scan_qr_btn: "ស្កេន QR",
        login_btn: "ចូលប្រើប្រាស់",
        login_footer: "ស្កេន QR Code ពីសាលាដើម្បីចូលដោយស្វ័យប្រវត្តិ។",
        school_name_default: "សាលាបឋមសិក្សា",
        academic_year_default: "ឆ្នាំសិក្សា ២០២៥-២០២៦",
        student_info_label: "ព័ត៌មានកូនរបស់អ្នក៖",
        loading: "កំពុងទាញយក...",
        unknown_name: "មិនស្គាល់ឈ្មោះ",
        tracking_features: "មុខងារតាមដាន",
        student_info_heading: "ព័ត៌មានសិស្ស",
        settings_title: "ការកំណត់",
        preferences: "ចំណូលចិត្ត",
        theme: "រូបរាង (Theme)",
        dark_mode_active: "កំពុងប្រើ Dark Mode",
        light_mode_active: "កំពុងប្រើ Light Mode",
        language_label: "ភាសា",
        lang_name: "ខ្មែរ",
        account_info: "ព័ត៌មានគណនី",
        logout_btn: "ចាកចេញ",
        logout_desc: "ចាកចេញពីគណនីដោយសុវត្ថិភាព។ អ្នកនឹងត្រូវបញ្ចូលលេខកូដម្តងទៀតនៅពេលក្រោយ។",
        nav_home: "ទំព័រដើម",
        nav_settings: "ការកំណត់",
        notif_title: "ការជូនដំណឹង",
        notif_subtitle: "សារពីសាលារៀន",
        notif_dismiss_all: "លុបទាំងអស់",
        notif_empty: "មិនមានការជូនដំណឹងថ្មីទេ",
        qr_title: "ស្កេន QR Code",
        qr_desc: "សូមដាក់កាមេរ៉ារបស់អ្នកឱ្យចំ QR Code របស់គ្រូ។",
        qr_opening: "កំពុងបើកកាមេរ៉ា...",
        
        track_attendance: 'តាមដានវត្តមាន',
        track_grades: 'តាមដានពិន្ទុ',
        track_homework: 'តាមដានកិច្ចការផ្ទះ',
        track_health: 'តាមដានសុខភាព',
        track_library: 'សៀវភៅ',
        track_card: 'កាតសិស្ស',
        info_profile: 'ប្រវត្តិរូប',
        info_family: 'គ្រួសារ',
        toast_not_avail: 'មុខងារ "{0}" មិនទាន់មានដំណើរការនៅឡើយទេ',
        toast_logged_out: 'បានចាកចេញដោយជោគជ័យ',
        toast_qr_success: 'ស្កេន QR ជោគជ័យ',
        toast_dismissed_all: 'បានលុបការជូនដំណឹងទាំងអស់',
        confirm_logout: 'តើអ្នកពិតជាចង់ចាកចេញពីគណនីមែនទេ?',
        err_enter_class: 'សូមបញ្ចូលលេខកូដថ្នាក់',
        err_enter_student: 'សូមបញ្ចូលអត្តលេខសិស្ស',
        err_not_found: 'រកមិនឃើញសិស្សនេះទេ។ លេខកូដថ្នាក់ ឬអត្តលេខអាចខុស។',
        err_connection: 'មានបញ្ហាភ្ជាប់ទៅកាន់ប្រព័ន្ធ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។',
        err_fetching_data: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ',
        qr_scanning: 'កំពុងស្កេន... (ដាក់កាមេរ៉ាឱ្យចំ QR)',
        qr_error_camera: 'មិនអាចបើកកាមេរ៉ាបានទេ! សូមពិនិត្យសិទ្ធិអនុញ្ញាត (Camera Permissions) របស់អ្នក។',
        qr_success: 'ស្កេនបានជោគជ័យ! កំពុងចូល...',
        qr_error_invalid: 'QR Code មិនត្រឹមត្រូវ! សូមស្កេន QR របស់ Parent Portal វិញ។',
        btn_logging_in: 'កំពុងចូល...'
    },
    en: {
        loading_data: "Preparing data...",
        auth_subtitle: "For Parents & Guardians",
        class_code_label: "Class Code",
        placeholder_teacher: "e.g., KS9lut...",
        class_code_helper: "Ask your teacher for this code",
        student_id_label: "Student ID",
        placeholder_student: "e.g., STU001",
        student_id_helper: "Your child's identification number",
        login_error_default: "Invalid credentials.",
        scan_qr_btn: "Scan QR",
        login_btn: "Login",
        login_footer: "Scan the QR Code from school for quick access.",
        school_name_default: "Primary School",
        academic_year_default: "Academic Year 2025-2026",
        student_info_label: "Student Information:",
        loading: "Loading...",
        unknown_name: "Unknown Name",
        tracking_features: "Tracking Features",
        student_info_heading: "Student Info",
        settings_title: "Settings",
        preferences: "Preferences",
        theme: "Appearance (Theme)",
        dark_mode_active: "Dark Mode Active",
        light_mode_active: "Light Mode Active",
        language_label: "Language",
        lang_name: "English",
        account_info: "Account Information",
        logout_btn: "Logout",
        logout_desc: "Securely sign out. You will need your code to sign back in.",
        nav_home: "Home",
        nav_settings: "Settings",
        notif_title: "Notifications",
        notif_subtitle: "Messages from school",
        notif_dismiss_all: "Dismiss All",
        notif_empty: "No new notifications",
        qr_title: "Scan QR Code",
        qr_desc: "Point your camera at the QR Code provided by the teacher.",
        qr_opening: "Opening camera...",

        track_attendance: 'Attendance',
        track_grades: 'Grades',
        track_homework: 'Homework',
        track_health: 'Health',
        track_library: 'Library',
        track_card: 'ID Card',
        info_profile: 'Profile',
        info_family: 'Family',
        toast_not_avail: 'Feature "{0}" is not available yet',
        toast_logged_out: 'Successfully logged out',
        toast_qr_success: 'QR Scan successful',
        toast_dismissed_all: 'All notifications dismissed',
        confirm_logout: 'Are you sure you want to log out?',
        err_enter_class: 'Please enter class code',
        err_enter_student: 'Please enter student ID',
        err_not_found: 'Student not found. Incorrect class code or ID.',
        err_connection: 'Connection problem. Please check your internet.',
        err_fetching_data: 'Error fetching data',
        qr_scanning: 'Scanning... (Point camera at QR)',
        qr_error_camera: 'Cannot open camera! Please check your permissions.',
        qr_success: 'Scan successful! Logging in...',
        qr_error_invalid: 'Invalid QR Code! Please scan a valid Parent Portal QR.',
        btn_logging_in: 'Logging in...'
    }
};

const trackingFeatures = [
    { id: 'track_attendance', icon: 'calendar-check', url: 'attendance-tracking.html', color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
    { id: 'track_grades', icon: 'bar-chart-3', url: 'grade-tracking.html', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { id: 'track_homework', icon: 'book-open-check', url: 'homework-tracking.html', color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
    { id: 'track_health', icon: 'heart-pulse', url: 'health-tracking.html', color: 'text-rose-400', bgColor: 'bg-rose-400/10' },
    { id: 'track_library', icon: 'book-user', url: 'library-tracking.html', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
    { id: 'track_card', icon: 'contact-2', url: 'student-card.html', color: 'text-amber-400', bgColor: 'bg-amber-400/10' }
];

const infoFeatures = [
    { id: 'info_profile', icon: 'user', url: 'profile.html', color: 'text-indigo-400', bgColor: 'bg-indigo-400/10' },
    { id: 'info_family', icon: 'users', url: 'family.html', color: 'text-pink-400', bgColor: 'bg-pink-400/10' }
];

window.renderGrids = function() {
    const generateGridCards = (features, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        features.forEach(feature => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'feature-card bg-card-dark p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-700/50 shadow-sm gap-3 w-full';
            
            const featureName = translations[currentLang][feature.id];
            
            card.onclick = () => {
                if (feature.url) {
                    window.location.href = feature.url;
                } else {
                    window.showToast(translations[currentLang].toast_not_avail.replace('{0}', featureName), 'info');
                }
            };
            
            card.innerHTML = `<div class="${feature.bgColor} p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center pointer-events-none" aria-hidden="true"><i data-lucide="${feature.icon}" class="w-7 h-7 ${feature.color}"></i></div><h3 class="text-gray-200 text-xs font-semibold leading-tight pointer-events-none">${featureName}</h3>`;
            container.appendChild(card);
        });
    };

    generateGridCards(trackingFeatures, 'tracking-grid');
    generateGridCards(infoFeatures, 'info-grid');
    if (window.lucide) lucide.createIcons();
};

window.showToast = function(message, type = 'info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.setAttribute('role', 'alert');
        toast.className = 'fixed left-1/2 bottom-20 -translate-x-1/2 px-4 py-3 rounded-xl z-[100] text-sm font-medium shadow-2xl transition-all duration-300 flex items-center gap-2 max-w-[90%] w-max opacity-0';
        document.body.appendChild(toast);
    }
    
    toast.className = toast.className.replace(/bg-\w+-600/g, '').replace('bg-gray-800', '').replace('text-white', '');
    
    if (type === 'error') toast.className += ' bg-red-600 text-white';
    else if (type === 'success') toast.className += ' bg-emerald-600 text-white';
    else toast.className += ' bg-gray-800 text-white border border-gray-700';
    
    toast.innerHTML = `<i data-lucide="${type === 'error' ? 'alert-circle' : type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5 shrink-0"></i><span class="leading-snug">${message}</span>`;
    if (window.lucide) lucide.createIcons();
    
    toast.classList.remove('hidden', 'toast-leave');
    toast.classList.add('toast-enter');
    
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-leave');
    }, 3000);
};

function createFocusTrap(modalEl) {
    const focusableStr = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(modalEl.querySelectorAll(focusableStr)).filter(n => n.offsetParent !== null);
    if (!focusable.length) return () => {};
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    const handleKeydown = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        } else if (e.key === 'Escape') {
            if(modalEl.id === 'notification-modal') window.toggleNotifications();
            else if(modalEl.id === 'qr-scanner-modal') window.closeQRScanner();
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
    first.focus();
    return () => document.removeEventListener('keydown', handleKeydown);
}

function updateDarkModeUI() {
    const toggleBtn = document.getElementById('btn-dark-mode');
    const toggleUI = document.getElementById('dark-mode-toggle');
    const circle = document.getElementById('dark-mode-circle');
    const text = document.getElementById('dark-mode-text');
    const icon = document.getElementById('dark-mode-icon');
    
    if (toggleBtn) toggleBtn.setAttribute('aria-checked', isDarkMode.toString());

    if (isDarkMode) {
        toggleUI.classList.remove('bg-gray-400');
        toggleUI.classList.add('bg-emerald-500');
        circle.classList.remove('-translate-x-4');
        if(text) text.textContent = translations[currentLang].dark_mode_active;
        if(icon) icon.setAttribute('data-lucide', 'moon');
    } else {
        toggleUI.classList.remove('bg-emerald-500');
        toggleUI.classList.add('bg-gray-400');
        circle.classList.add('-translate-x-4');
        if(text) text.textContent = translations[currentLang].light_mode_active;
        if(icon) icon.setAttribute('data-lucide', 'sun');
    }
    if (window.lucide) lucide.createIcons();
}

window.toggleDarkMode = function() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
    updateDarkModeUI();
};

if (!isDarkMode) document.body.classList.add('light-mode');

window.applyTranslations = function() {
    document.documentElement.lang = currentLang;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    document.getElementById('lang-flag').textContent = currentLang === 'km' ? '🇰🇭' : '🇬🇧';
    
    if (!window.loggedInStudent) {
        document.getElementById('header-school-name').textContent = translations[currentLang].school_name_default;
        document.getElementById('header-academic-year').textContent = translations[currentLang].academic_year_default;
        document.getElementById('display-name').textContent = translations[currentLang].loading;
    } else {
        document.getElementById('display-name').textContent = window.loggedInStudent.name || translations[currentLang].unknown_name;
    }

    updateDarkModeUI();
    window.renderGrids();
    
    if (window.currentNotifs.length === 0 && document.getElementById('notification-list').innerHTML.includes('bell-off')) {
        window.renderNotifications();
    }
};

window.toggleLanguage = function() {
    currentLang = currentLang === 'km' ? 'en' : 'km';
    localStorage.setItem('app_lang', currentLang);
    window.applyTranslations();
};

window.setLoginLoading = function(isLoading) {
    const btnLogin = document.getElementById('btn-login');
    const tCode = document.getElementById('teacher-code');
    const sCode = document.getElementById('student-code');
    
    if (isLoading) {
        btnLogin.disabled = true;
        btnLogin.innerHTML = `<span class="spinner w-5 h-5 border-t-white inline-block"></span><span class="font-bold">${translations[currentLang].btn_logging_in}</span>`;
        tCode.disabled = true; sCode.disabled = true;
        tCode.classList.add('opacity-50'); sCode.classList.add('opacity-50');
    } else {
        btnLogin.disabled = false;
        btnLogin.innerHTML = `<span data-i18n="login_btn">${translations[currentLang].login_btn}</span><i data-lucide="log-in" class="w-5 h-5"></i>`;
        tCode.disabled = false; sCode.disabled = false;
        tCode.classList.remove('opacity-50'); sCode.classList.remove('opacity-50');
        if (window.lucide) lucide.createIcons();
    }
};

window.updateDashboardUI = function(student, tid, sid) {
    document.getElementById('display-name').textContent = student.name || translations[currentLang].unknown_name;
    document.getElementById('display-gender').textContent = student.gender || '-';
    
    const photoEl = document.getElementById('display-photo');
    if (student.photo) photoEl.src = student.photo;
    else photoEl.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student.id}`;

    isIdVisible = false;
    document.getElementById('display-id').textContent = "***";
    document.getElementById('eye-icon').setAttribute('data-lucide', 'eye');
    
    if (document.getElementById('setting-tid')) document.getElementById('setting-tid').textContent = tid || '***';
    if (document.getElementById('setting-sid')) document.getElementById('setting-sid').textContent = sid || '***';

    if (window.lucide) lucide.createIcons();
};

window.showLogin = function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const authSection = document.getElementById('auth-section');
    loadingOverlay.classList.add('opacity-0');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        loadingOverlay.setAttribute('aria-hidden', 'true');
        authSection.classList.remove('hidden');
        authSection.removeAttribute('aria-hidden');
        setTimeout(() => {
            authSection.classList.remove('opacity-0');
            document.getElementById('teacher-code').focus();
        }, 50);
    }, 300);
};

window.hideLoginShowDashboard = function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const authSection = document.getElementById('auth-section');
    const mainContent = document.getElementById('main-content');
    loadingOverlay.classList.add('opacity-0');
    authSection.classList.add('opacity-0');
    authSection.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        authSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainContent.removeAttribute('aria-hidden');
        window.switchTab('dashboard'); 
        
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            document.getElementById('dashboard-view').focus();
        }, 50);
    }, 300);
};

window.switchTab = function(tabName) {
    const views = {
        dashboard: document.getElementById('dashboard-view'),
        settings: document.getElementById('settings-view')
    };
    const btns = {
        dashboard: document.getElementById('tab-btn-dashboard'),
        settings: document.getElementById('tab-btn-settings')
    };

    Object.keys(views).forEach(key => {
        if(key === tabName) {
            views[key].classList.remove('hidden'); views[key].classList.add('flex');
            btns[key].classList.add('text-emerald-500'); btns[key].classList.remove('text-gray-500');
            btns[key].setAttribute('aria-selected', 'true');
        } else {
            views[key].classList.add('hidden'); views[key].classList.remove('flex');
            btns[key].classList.remove('text-emerald-500'); btns[key].classList.add('text-gray-500');
            btns[key].setAttribute('aria-selected', 'false');
        }
    });
};

window.logout = function() {
    if(confirm(translations[currentLang].confirm_logout)) {
        localStorage.removeItem('savedTid');
        localStorage.removeItem('savedSid');
        
        if (window.unsubNotifications) { window.unsubNotifications(); window.unsubNotifications = null; }
        window.history.replaceState({}, document.title, window.location.pathname);
        
        document.getElementById('teacher-code').value = ''; 
        document.getElementById('student-code').value = '';
        document.getElementById('setting-tid').textContent = '***';
        document.getElementById('setting-sid').textContent = '***';
        document.getElementById('header-school-name').textContent = translations[currentLang].school_name_default;
        document.getElementById('header-academic-year').textContent = translations[currentLang].academic_year_default;
        document.getElementById('display-name').textContent = translations[currentLang].loading;
        
        window.loggedInStudent = null;
        window.switchTab('dashboard');

        const mainContent = document.getElementById('main-content');
        const authSection = document.getElementById('auth-section');

        mainContent.classList.add('opacity-0');
        mainContent.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
            mainContent.classList.add('hidden');
            authSection.classList.remove('hidden');
            authSection.removeAttribute('aria-hidden');
            setTimeout(() => {
                authSection.classList.remove('opacity-0');
                document.getElementById('teacher-code').focus();
            }, 50);
        }, 500);
        
        window.showToast(translations[currentLang].toast_logged_out, 'success');
    }
};

window.toggleID = function() {
    if(!window.realId) return;
    isIdVisible = !isIdVisible;
    document.getElementById('display-id').textContent = isIdVisible ? window.realId : "***";
    const eyeIcon = document.getElementById('eye-icon');
    if(isIdVisible) eyeIcon.setAttribute('data-lucide', 'eye-off');
    else eyeIcon.setAttribute('data-lucide', 'eye');
    if (window.lucide) lucide.createIcons();
};

window.renderNotifications = function() {
    const listEl = document.getElementById('notification-list');
    const badge = document.getElementById('notif-badge');
    const dismissAllBtn = document.getElementById('btn-dismiss-all');

    let dismissedNotifs = JSON.parse(localStorage.getItem('dismissedNotifs_' + window.realId) || '[]');
    let visibleNotifs = window.currentNotifs.filter(n => !dismissedNotifs.includes(n.id));

    if (visibleNotifs.length === 0) {
        listEl.innerHTML = `<div class="text-center py-12 text-gray-500"><i data-lucide="bell-off" class="w-12 h-12 mx-auto mb-3 opacity-30"></i><p class="text-sm">${translations[currentLang].notif_empty}</p></div>`;
        if (badge) badge.classList.add('hidden');
        if (dismissAllBtn) dismissAllBtn.classList.add('hidden');
        if (window.lucide) lucide.createIcons();
        return;
    }

    if (badge) badge.classList.remove('hidden');
    if (dismissAllBtn) dismissAllBtn.classList.remove('hidden');

    let html = '';
    visibleNotifs.forEach((n, index) => {
        let icon = 'info', colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        let cardBorder = 'border-gray-700/50';

        if (n.type === 'alert') { icon = 'alert-triangle'; colorClass = 'text-red-400 bg-red-500/10 border-red-500/20'; cardBorder = 'border-red-900/30'; }
        if (n.type === 'success') { icon = 'check-circle'; colorClass = 'text-green-400 bg-green-500/10 border-green-500/20'; }
        if (n.type === 'congrats') { icon = 'award'; colorClass = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'; cardBorder = 'border-yellow-900/30'; }

        const d = new Date(n.createdAt);
        const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        const delay = index * 0.05;

        html += `
            <article id="notif-${n.id}" class="notif-card-enter bg-gray-800/40 p-4 rounded-2xl border ${cardBorder} hover:bg-gray-800/60 transition relative group shadow-sm focus-within:ring-2 focus-within:ring-emerald-500" style="animation-delay: ${delay}s">
                <button onclick="dismissNotification('${n.id}')" aria-label="Dismiss this notification" class="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 outline-none">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
                <div class="flex gap-4 pr-6">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass} shadow-inner" aria-hidden="true">
                        <i data-lucide="${icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-200 text-sm mb-1">${n.title}</h4>
                        <p class="text-[13px] text-gray-400 leading-relaxed mb-2">${n.message}</p>
                        <time class="text-[10px] text-gray-500 font-mono flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${dateStr}</time>
                    </div>
                </div>
            </article>
        `;
    });
    listEl.innerHTML = html;
    if (window.lucide) lucide.createIcons();
};

window.dismissNotification = function(notifId) {
    let dismissedNotifs = JSON.parse(localStorage.getItem('dismissedNotifs_' + window.realId) || '[]');
    if (!dismissedNotifs.includes(notifId)) {
        dismissedNotifs.push(notifId);
        localStorage.setItem('dismissedNotifs_' + window.realId, JSON.stringify(dismissedNotifs));
    }
    window.renderNotifications();
};

window.dismissAllNotifications = function() {
    if(!window.realId) return;
    const ids = window.currentNotifs.map(n => n.id);
    const key = 'dismissedNotifs_' + window.realId;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const merged = Array.from(new Set([...existing, ...ids]));
    localStorage.setItem(key, JSON.stringify(merged));
    window.renderNotifications();
    window.showToast(translations[currentLang].toast_dismissed_all, 'success');
};

let previousActiveElement;
window.toggleNotifications = function() {
    const notifModal = document.getElementById('notification-modal');
    const notifContent = document.getElementById('notification-content');
    
    if(notifModal.classList.contains('hidden')) {
        previousActiveElement = document.activeElement;
        notifModal.classList.remove('hidden');
        notifModal.classList.add('flex');
        notifModal.removeAttribute('aria-hidden');
        
        setTimeout(() => {
            notifModal.classList.remove('opacity-0');
            notifContent.classList.remove('translate-y-full');
        }, 10);
        
        activeFocusTrap = createFocusTrap(notifModal);
    } else {
        notifModal.classList.add('opacity-0');
        notifContent.classList.add('translate-y-full');
        notifModal.setAttribute('aria-hidden', 'true');
        
        if (activeFocusTrap) { activeFocusTrap(); activeFocusTrap = null; }
        if (previousActiveElement) previousActiveElement.focus();
        
        setTimeout(() => {
            notifModal.classList.add('hidden');
            notifModal.classList.remove('flex');
        }, 300);
    }
};

window.scanQR = function() {
    const modal = document.getElementById('qr-scanner-modal');
    const content = document.getElementById('qr-scanner-content');
    const statusText = document.getElementById('qr-status');
    
    qrPreviousFocus = document.activeElement;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.removeAttribute('aria-hidden');
    
    statusText.textContent = translations[currentLang].qr_opening;
    statusText.className = "text-emerald-500 text-xs text-center mt-4 animate-pulse";
    
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    activeFocusTrap = createFocusTrap(modal);

    if (!html5QrCode) html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, onScanSuccess)
        .then(() => { statusText.textContent = translations[currentLang].qr_scanning; })
        .catch((err) => {
            statusText.textContent = translations[currentLang].qr_error_camera;
            statusText.className = "text-red-500 text-xs text-center mt-4";
        });
};

function onScanSuccess(decodedText) {
    try {
        const url = new URL(decodedText);
        const tid = url.searchParams.get('tid');
        const sid = url.searchParams.get('sid');
        
        if (tid && sid) {
            const statusText = document.getElementById('qr-status');
            statusText.textContent = translations[currentLang].qr_success;
            statusText.className = "text-emerald-500 text-xs text-center mt-4 font-bold";
            
            document.getElementById('teacher-code').value = tid;
            document.getElementById('student-code').value = sid;

            window.closeQRScanner().then(() => {
                window.showToast(translations[currentLang].toast_qr_success, 'success');
                if (window.attemptLogin) {
                    window.attemptLogin(tid, sid);
                } else {
                    window.showToast(translations[currentLang].err_connection, 'error');
                }
            });
        } else throw new Error("Invalid format");
    } catch (e) {
        const statusText = document.getElementById('qr-status');
        statusText.textContent = translations[currentLang].qr_error_invalid;
        statusText.className = "text-red-500 text-xs text-center mt-4 animate-bounce";
    }
}

window.closeQRScanner = function() {
    return new Promise((resolve) => {
        const modal = document.getElementById('qr-scanner-modal');
        const content = document.getElementById('qr-scanner-content');
        
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        modal.setAttribute('aria-hidden', 'true');
        
        if (activeFocusTrap) { activeFocusTrap(); activeFocusTrap = null; }
        if (qrPreviousFocus) qrPreviousFocus.focus();
        
        const stopScanner = () => {
            if (html5QrCode && html5QrCode.getState() === 2) {
                html5QrCode.stop().then(() => { html5QrCode.clear(); finishClose(); }).catch(finishClose);
            } else finishClose();
        };

        const finishClose = () => {
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                resolve();
            }, 300);
        };

        stopScanner();
    });
};

// Form Submission Logic
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tInput = document.getElementById('teacher-code');
    const sInput = document.getElementById('student-code');
    const tErr = document.getElementById('teacher-error');
    const sErr = document.getElementById('student-error');
    const errBox = document.getElementById('login-error');
    
    tErr.classList.add('hidden');
    sErr.classList.add('hidden');
    errBox.classList.add('hidden');
    
    tInput.classList.remove('border-red-500', 'ring-red-500');
    sInput.classList.remove('border-red-500', 'ring-red-500');

    const tCode = tInput.value.trim();
    const sCode = sInput.value.trim();
    let isValid = true;

    if(!tCode) {
        tErr.textContent = translations[currentLang].err_enter_class; 
        tErr.classList.remove('hidden'); 
        tInput.classList.add('border-red-500');
        isValid = false; 
    }
    if(!sCode) {
        sErr.textContent = translations[currentLang].err_enter_student; 
        sErr.classList.remove('hidden'); 
        sInput.classList.add('border-red-500');
        isValid = false; 
    }

    if(isValid) {
        if (window.attemptLogin) {
            window.attemptLogin(tCode, sCode);
        } else {
            window.showToast(translations[currentLang].err_connection, 'error');
        }
    }
    else if(!tCode) tInput.focus();
    else sInput.focus();
});

// Initialize immediately
window.applyTranslations();