import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBU50HJrekgHWwwyLq5CTRwhjHkGJAAAfs",
    authDomain: "classroom-management-82382.firebaseapp.com",
    projectId: "classroom-management-82382",
    storageBucket: "classroom-management-82382.firebasestorage.app",
    messagingSenderId: "146641865620",
    appId: "1:146641865620:web:ce693b7b064afd5d1bdd81"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const PTEC_APP_ID = "ptec-app";