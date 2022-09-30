const express=require('express');
const router = express.Router();
const path=require('path');
const profile = require('./add-users');
const profiles = profile.profiles;
var sno =0;
router.get('/',(req,res,next)=>{
  // res.sendFile(path.join(__dirname,'../','Views','users.html'));
  res.render('users',{pageTitle:'Users', profile:profiles,Sno:sno});
});

exports.routes=router;