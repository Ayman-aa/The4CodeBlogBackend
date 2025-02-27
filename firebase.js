import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtEZgArHJEXWX_KjVmyBnukoWtztRZXw4",
  authDomain: "the4codedb.firebaseapp.com",
  projectId: "the4codedb",
  storageBucket: "the4codedb.firebasestorage.app",
  messagingSenderId: "78455067544",
  appId: "1:78455067544:web:e038331ce7491aaf8751ed",
  measurementId: "G-MHYPLZZ07K",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
