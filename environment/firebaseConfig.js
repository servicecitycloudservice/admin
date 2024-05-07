import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAczBzL80MoEe8qm91CCHHxX-_8iAla-S8",
  authDomain: "service-city-app.firebaseapp.com",
  projectId: "service-city-app",
  storageBucket: "service-city-app.appspot.com",
  messagingSenderId: "1068099519430",
  appId: "1:1068099519430:web:a896e65c893c36d833a8c7",
  databaseURL: "https://service-city-app-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { firebaseConfig, app, auth, database };