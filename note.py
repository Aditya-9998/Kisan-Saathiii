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







check first -  

git remote -v

if changes need :-(
git remote remove origin
git remote add origin https://github.com/Aditya-9998/Kisan-Saathiii.git )

git status

git add .
git commit -m "Your message"  :- e.g >> git commit -m "Updated project files and structure - Navbar and UI fixes"

git push origin main




dir:_




PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii> dir


    Directory: C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/13/2025   7:37 PM                css
d-----         9/27/2025  12:33 PM                data
d-----        10/12/2025   7:37 PM                images
d-----         11/7/2025  11:28 AM                Js
d-----        11/12/2025  10:41 AM                KisaanSathiiiTranslate
-a----        11/11/2025   8:59 AM           2344 .gitignore
-a----        11/12/2025  10:58 AM           6160 about.html
-a----         11/8/2025   2:43 PM           4832 advisory.html
-a----         11/8/2025   2:31 PM           4631 index.html
-a----         11/8/2025   2:44 PM           3192 insurance.html
-a----         11/4/2025  10:05 AM           3772 login.html
-a----         11/4/2025   9:10 AM           3487 mrp.html
-a----         11/4/2025   9:10 AM           5382 news.html
-a----         11/4/2025   6:18 PM           8312 note.py
-a----         11/9/2025   4:56 PM          55578 package-lock.json
-a----         11/4/2025   4:26 PM             68 package.json
-a----         11/4/2025   9:11 AM           4338 profile.html
-a----        10/11/2025   9:50 PM             38 README.md
-a----         11/4/2025   9:11 AM           6116 signup.html
-a----         10/3/2025  10:26 PM            122 vercel.json
-a----         11/4/2025   9:11 AM           1735 weather.html


PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii> cd 'C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\Js'
PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\Js> dir


    Directory: C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\Js


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        10/15/2025   9:23 PM          26078 advisory.js
-a----        10/12/2025   3:53 PM           1494 firebase_init.js
-a----        10/12/2025   4:14 PM           2712 footer.js
-a----         11/9/2025   4:03 PM           3544 language.js
-a----        10/12/2025   9:46 PM           5239 login_auth.js
-a----         11/8/2025   2:39 PM           4166 navbar.js
-a----         9/27/2025   3:01 PM           4055 news_dashboard.js
-a----        10/13/2025   9:51 AM           6166 profile.js
-a----        10/11/2025   5:34 PM           5098 schemes.js
-a----        10/12/2025   4:25 PM           5048 signup_auth.js
-a----        11/11/2025  11:34 AM            660 translate.js
-a----         11/9/2025   4:03 PM           5798 translations.js
-a----        10/16/2025  12:03 PM           6239 user_status.js
-a----         11/1/2025   5:12 PM           1263 utility.js


PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\Js> cd 'C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\KisaanSathiiiTranslate'
PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\KisaanSathiiiTranslate> dir


    Directory: C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\KisaanSathiiiTranslate


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         11/7/2025  11:30 AM                node_modules
d-----         11/4/2025   6:19 PM                Public
-a----         11/7/2025  11:30 AM         111467 package-lock.json
-a----         11/8/2025   2:14 PM            352 package.json
-a----        11/11/2025  11:04 AM           1503 Server.js


PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\KisaanSathiiiTranslate> cd 'C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\css'
PS C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\css> dir


    Directory: C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\css


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         11/1/2025  10:55 AM           5538 about.css
-a----         11/2/2025   1:41 AM          11971 advisory.css
-a----         9/18/2025   7:07 PM           1488 footer.css
-a----         11/1/2025   8:10 PM           4973 navbar.css
-a----        10/13/2025   7:55 PM           3833 profile.css
-a----        10/13/2025   8:07 PM          14204 style.css


'''