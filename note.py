print('Adi')

#for Shutdown

import os
os.system("shutdown /s /t 0");




'''


<!-- Footer placeholder (injected by footer.js)   
    ye mera abhi ka advisory page hai hu isko thoda aur modifi karu like if user clik in adivsiry section 4 section open ho 1. soil selection 2. related crops 3. fertilizer 4. equipment
how it working together aftter user rech at adivvisory page 4 section is show ho. iske niche india me corrent kis state me kitna kon crop jayda profitable huaa haua other crop relate new like kisi state baadh yaya to crop ka nuksaan huaa ye sab ho side me ek graph bhi 5 yr ka jisme show ho statewise kis state me kitna kis crops ka production badha ki ghata.(by defaust ye open hi rahega aur news card 7-8 hoge oo rotete krne hi rahege.)

ab next kaam advisory page ka when user clik on soil selection open all type of soil name in horizantaly section use soil name ke niche ek(!) simbol ho jisme clik ya cursour le jane par show ho ye soil kis kis state me paya jata hai ek pop up ke help se. if user clik on select soil type.

than uske relate crop show hone lage jaise abhi hota hai but in 1 row show only 4 crop card than niche show ho simalarly .baaki same rahega usme uska full procced rahega jaise abhi hai 

ek name fertilizer.js banana hoga jisme sare tyes fertilizeer avilavle ho dap jo crop kr detail name oo sab fertilizer ka name card hoga.

similsrly ek new equpmwent.js file sare equpment choti se choti bae se bade jo kissan workme use hoti like sikale kudal se leke tractor , compaonei tak sab kuch

-->

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional




const firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.firebasestorage.app",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


'''



'''
check first -  

git remote -v

if changes need :-(
git remote remove origin
git remote add origin https://github.com/Aditya-9998/Kisan-Saathiii.git )

git status

git add .
git commit -m "Your message"  :- e.g >> git commit -m "Updated project files and structure - Navbar and UI fixes"

git remote remove origin
git remote add origin https://github.com/Aditya-9998/-Saathiii-.git
git push origin main


'''