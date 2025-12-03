// firebase_init.js  (FULLY WORKING V8 STYLE)
// ------------------------------------------

var firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.appspot.com",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND"
};

// Always load compat FIRST
firebase.initializeApp(firebaseConfig);

window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
window.firebaseStorage = firebase.storage();

console.log("Firebase (V8 compat) initialized ✓");
