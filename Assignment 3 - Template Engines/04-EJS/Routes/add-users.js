const express =require('express');
const path=require('path');

const router = express.Router();
const profiles=[];
router.get('/add-users',(req,res,next)=>{
  // res.sendFile(path.join(__dirname,'../','views','add-users.html'))
  res.render('add-users',{pageTitle:'Add User',path:'/add-users',formCss:true,activeUserPage:false,activeAddUserPage:true});
  console.log('Someone Opened Add Users');
});
var i=0;
router.post('/userAdded',(req,res,next)=>{
  i++;
  profiles.push({Username:req.body.username,Password:req.body.password,Sno:i});
  console.log(profiles);
  console.log('Redirected after submission');
  res.redirect('/add-users');
});

exports.profiles=profiles;
exports.routes=router;