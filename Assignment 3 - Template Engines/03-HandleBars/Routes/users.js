const express =require('express');
const path=require('path');

const router = express.Router();
const profiles=require('./add-users')
router.get('/',(req,res,next)=>{
  // res.sendFile(path.join(__dirname,'../','views','users.html'));
  console.log(profiles.profiles);
  res.render('users',{pageTitle:'Users',path:'/',profiles:profiles.profiles,formCss:false,activeUserPage:true,activeAddUserPage:false});
});

exports.routes=router;