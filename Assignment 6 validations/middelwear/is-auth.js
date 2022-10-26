module.exports=(req,res,next)=>{
  if(!req.session.isLoggedIn){
    console.log('LOGIN TO ACCESS THIS PAGE');
    return res.redirect('/login');
  }
  next();
}