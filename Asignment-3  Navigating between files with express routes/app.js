/* 1. OPEN TERMINAL AND TYPE 'npm init' to install node package manager, This will create package.json */

/* 2. INSTALL NODEMON - type 'npm install --save-dev nodemon' in terminal */
/* Open package.json and add start in scripts 
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
*/

/* 3. Now install express in your folder using 'npm install --save express' */

// TYPE NPM START TO START THE NODEMON AUTORUN

// 4. import express package
const express=require('express');

// 5. use express function, create const app which will be the object or reference to the express()
const app = express();

// 9. SERVE CSS FILES STATICALLY
const path =require('path');
app.use(express.static(path.join(__dirname,'public')));


// 7. IMPORT EXTERNAL ROUTES FROM JS FILES IN A CONST
const userRoutes = require('./routes/users');
const emptyRoutes = require('./routes/empty');

// 8. USE EXTERNAL ROUTES USING APP.USE();
app.use(userRoutes);
app.use(emptyRoutes);

const rootDir =require('./util/path')
app.use((req,res,next)=>{
  res.sendFile(path.join(rootDir,'views','error.html'));
  });
// 6. START SERVER
app.listen(3000);
