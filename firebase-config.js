// នាំចូល (Import) មុខងារចាំបាច់ពី Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// [បានកែប្រែ] បន្ថែម initializeFirestore, persistentLocalCache និង persistentMultipleTabManager
import { 
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    doc, 
    getDoc, 
    collection, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// បន្ថែម Import សម្រាប់ App Check (reCAPTCHA)
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-check.js";

// ព័ត៌មាន (Credentials) សម្រាប់ភ្ជាប់ទៅគម្រោង Firebase របស់អ្នក
const firebaseConfig = {
    apiKey: "AIzaSyBU50HJrekgHWwwyLq5CTRwhjHkGJAAAfs",
    authDomain: "classroom-management-82382.firebaseapp.com",
    projectId: "classroom-management-82382",
    storageBucket: "classroom-management-82382.firebasestorage.app",
    messagingSenderId: "146641865620",
    appId: "1:146641865620:web:ce693b7b064afd5d1bdd81"
};

// ចាប់ផ្តើមដំណើរការ Firebase
const app = initializeApp(firebaseConfig);

// បន្ថែមការកំណត់ App Check (reCAPTCHA) មុនពេលហៅ Auth និង Firestore
let appCheck;
try {
    appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6LcGhdMsAAAAAL-KFlF4hUE9XZSDmGmFNz3tQ5Xc'),
        isTokenAutoRefreshEnabled: true // អនុញ្ញាតឱ្យ refresh token ដោយស្វ័យប្រវត្តិ
    });
} catch (error) {
    console.warn("App Check failed:", error);
}

const auth = getAuth(app);

// [បានកែប្រែ]៖ ចាប់ផ្តើម Firestore ដោយបើកដំណើរការ Offline Caching 
// វានឹងរក្សាទុកទិន្នន័យក្នុងឧបករណ៍សិស្ស/អាណាព្យាបាល ធ្វើឱ្យការចូលមើលលើកក្រោយលឿនជាងមុន
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager() // អនុញ្ញាតឱ្យប្រើប្រាស់ Caching បានទោះបើកច្រើន Tab ក៏ដោយ
    })
});

// App ID របស់អ្នក
const PTEC_APP_ID = "ptec-app";

// Export មុខងារទាំងអស់នេះចេញ ដើម្បីឱ្យឯកសារ HTML ផ្សេងៗអាចហៅយកទៅប្រើបាន
export { 
    app, 
    auth, 
    db, 
    appCheck,
    PTEC_APP_ID, 
    signInAnonymously, 
    onAuthStateChanged, 
    doc, 
    getDoc, 
    collection, 
    onSnapshot 
};