const { profile } = require('console');
const express=require('express');
const router = express.Router();
const path=require('path');

const profiles=[];

router.get('/add-users',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'../','Views','add-users.html'));
});
router.post('/userAdded',(req,res,next)=>{
  // console.log(req.body);
  profiles.push({UserName: req.body.username,Password:req.body.password});
  console.log(profiles);
  res.redirect('/');
});

exports.profiles=profiles;
exports.routes=router;