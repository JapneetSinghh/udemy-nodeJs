//npm install --save express-handlebars@3.0
const express =require('express');
const app = express();
const path=require('path');

// ADD A DECODER TO READ THE INPUTS
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

// Making the public folder static
app.use(express.static(path.join(__dirname,'public')));

// USING TEMPLATE ENGINE HANDLEBARS
app.set('view engine','ejs');
app.set('views','views');

const UserRoutes=require('./Routes/users');
const AddUserRoutes=require('./Routes/add-users');
app.use(AddUserRoutes.routes);
app.use(UserRoutes.routes);

app.use((req,res,next)=>{
  // res.sendFile(path.join(__dirname,'views','Error.html'));
  res.render('Error',{pageTitle:'Error 404'});
});

app.listen(3000);