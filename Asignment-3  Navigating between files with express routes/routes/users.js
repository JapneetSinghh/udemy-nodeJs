const express = require('express');
const routes = express.Router();
const path=require('path');
const rootDir= require('../util/path');
routes.get('/users',(req,res,next)=>{
res.sendFile(path.join(rootDir,'views','users.html'));
});

module.exports=routes;