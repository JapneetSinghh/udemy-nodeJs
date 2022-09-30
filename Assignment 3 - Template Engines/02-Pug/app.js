// Import Express
const express =require('express');
const app = express();
const path =require('path');

// // Test Middlewear Routes
// app.use('/',(req,res,next)=>{
//   console.log('Test');
// });

// MAKE CSS FOLDER AVAILABLE TO PUBLIC
app.use(express.static(path.join(__dirname,'public')));

// SETTING THE TEMPLATE ENGINE
app.set('view engine','pug');
app.set('views','views');

// -- IMP --
// IMPORTING THE PACKAGE BODY-PARSER INORDER TO GET THE CONTENT FROM FORM 
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

// IMPORT ROUTES
const userRoutes=require('./Routes/users.js');
const AddNewUserRoutes=require('./Routes/add-users.js');

app.use(userRoutes.routes);
app.use(AddNewUserRoutes.routes);

app.use((req,res,next)=>{
  console.log('error 404')

  // res.sendFile(path.join(__dirname,'views','Error.html'));
  res.render('Error',{pageTitle:'Error 404'});
});

// Start Server
app.listen(3000);
