// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVc8MY_NSYBG7v8eUCHNkk5b2_o0-AFYA",
    authDomain: "taxxapplication.firebaseapp.com",
    projectId: "taxxapplication",
    storageBucket: "taxxapplication.appspot.com",
    messagingSenderId: "592807726884",
    appId: "1:592807726884:web:0877106923254d9bfd6db1",
    measurementId: "G-8737XR87LW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
