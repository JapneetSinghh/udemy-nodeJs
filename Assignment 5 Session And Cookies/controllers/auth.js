const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // console.log(req.get('Cookie').split(';')[0].trim().split('=')[1]); 
  // const isLoggedIn= req.get('Cookie').split(';')[0].trim().split('=')[1]; 
  // isLoggedIn = req.session.isLoggedIn;
  // console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  })
  console.log(req.session);
}
// exports.postLogin = (req, res, next) => {
//   // req.isLoggedIn=true;
//   // res.setHeader('Set-Cookie','loggedIn=true')
//   User.findById("634939d79f398fbea2e5021d")
//     .then(user => {
//       req.session.user = user;
//       console.log(req.session);
//       console.log(user);
//       req.session.isLoggedIn = true;
//       req.session.save();
//       res.redirect('/');
//     })
//     .catch(err => console.log(err));
// }

exports.postLogin = (req, res, next) => {
  User.findById('634939d79f398fbea2e5021d')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

