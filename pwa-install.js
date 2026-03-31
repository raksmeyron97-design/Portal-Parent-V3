// ឯកសារ: pwa-install.js

(function() {
    // ១. ចុះឈ្មោះ Service Worker ដោយស្វ័យប្រវត្តិ
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('✅ Service Worker Registered!'))
                .catch(err => console.error('❌ Service Worker Failed', err));
        });
    }

    // ២. បង្កើត CSS សម្រាប់ផ្ទាំង Install Banner
    const style = document.createElement('style');
    style.innerHTML = `
        #ptec-pwa-banner {
            display: none; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: #1e293b; color: white; padding: 12px 20px; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 99998; border: 1px solid #10b981;
            font-family: 'Kantumruy Pro', sans-serif; align-items: center; gap: 15px; width: max-content; max-width: 95%;
        }
        #ptec-pwa-banner.show { display: flex; animation: ptecSlideUp 0.4s ease-out; }
        .ptec-pwa-text { flex-grow: 1; text-align: left; }
        .ptec-pwa-title { font-size: 14px; font-weight: bold; color: #34d399; margin: 0; }
        .ptec-pwa-desc { font-size: 11px; color: #cbd5e1; margin: 4px 0 0 0; line-height: 1.4; }
        .ptec-pwa-btn {
            background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px;
            font-weight: bold; font-size: 12px; cursor: pointer; transition: 0.2s; white-space: nowrap;
        }
        .ptec-pwa-btn:hover { background: #059669; transform: scale(1.05); }
        .ptec-pwa-close { background: none; border: none; color: #64748b; font-size: 20px; cursor: pointer; padding: 0; line-height: 1; }
        .ptec-pwa-close:hover { color: #ef4444; }
        @keyframes ptecSlideUp { from { bottom: -60px; opacity: 0; } to { bottom: 20px; opacity: 1; } }
    `;
    document.head.appendChild(style);

    // ៣. បង្កើត HTML Banner ចូលទៅក្នុង Body
    const banner = document.createElement('div');
    banner.id = 'ptec-pwa-banner';
    banner.innerHTML = `
        <div class="ptec-pwa-text">
            <p class="ptec-pwa-title">📥 ដំឡើងកម្មវិធី (Install App)</p>
            <p class="ptec-pwa-desc">ដំឡើងចូលទូរស័ព្ទ ឬកុំព្យូទ័រ ដើម្បីប្រើប្រាស់ងាយស្រួល និងលឿនជាងមុន</p>
        </div>
        <button id="ptec-pwa-install-btn" class="ptec-pwa-btn">ដំឡើងឥឡូវនេះ</button>
        <button id="ptec-pwa-close-btn" class="ptec-pwa-close">&times;</button>
    `;
    document.body.appendChild(banner);

    // ៤. មុខងារបញ្ជា PWA
    let deferredPrompt;
    const installBtn = document.getElementById('ptec-pwa-install-btn');
    const closeBtn = document.getElementById('ptec-pwa-close-btn');

    // លោតពេល Browser ពិនិត្យឃើញថា App អាច Install បាន
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // ការពារកុំឱ្យលោតផ្ទាំង default របស់ Chrome
        deferredPrompt = e;
        banner.classList.add('show'); // បង្ហាញ Banner របស់យើង
    });

    // ពេលចុចប៊ូតុងដំឡើង
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                banner.classList.remove('show');
            }
            deferredPrompt = null;
        }
    });

    // ពេលចុចបិទ x
    closeBtn.addEventListener('click', () => {
        banner.classList.remove('show');
    });

    // លាក់ Banner ពេលដំឡើងជោគជ័យ
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        banner.classList.remove('show');
    });
})();