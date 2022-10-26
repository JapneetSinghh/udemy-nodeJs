// crypto is a library in node js which generates random unique values
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');


const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const mailtrap = require('mailtrap');
const user = require('../models/user');
const { reset } = require('nodemon');

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a873fef7180cb4",
    pass: "9bdf5079579d29"
  }
});
let mailOption = {
  from: "bookShopUdemy@gmail.com",
  to: "japneet8208@gmail.com",
  subject: "Book Shop Project",
  html: "<h1 style='color:red'>Hey<h1/>"
}



exports.getLogin = (req, res, next) => {
  // console.log(req.get('Cookie').split(';')[0].trim().split('=')[1]); 
  // const isLoggedIn= req.get('Cookie').split(';')[0].trim().split('=')[1]; 
  // isLoggedIn = req.session.isLoggedIn;
  // console.log(req.session.isLoggedIn);
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    // isAuthenticated: false,
    // csrfToken:req.csrfToken(),
    errorMessage: message
  })
  // console.log(req.session);
}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
   return res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg
    })
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email Or Password');
        console.log('EMAIL DOSENT EXIST IN DATABASE');
        return res.redirect('/login');
      }
      bcryptjs.compare(password, user.password)
        .then(domatch => {
          if (domatch) {
            console.log('VALID EMAIL AND PASS');
            req.session.isLoggedIn = true;
            req.session.user = user;
            // console.log(req.session);
            res.redirect('/');
            return transporter.sendMail(mailOption, (err, success) => {
              if (err) {
                console.log(err);
              } else {
                console.log('EMAIL SENT SUCCESSFULLY');
              }
            })
          }
          console.log('INVALID  PASS');
          req.flash('error', 'Invalid Email Or Password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log('INCORRECT PASSWORD');
          console.log(err);
          return res.redirect('/login');
        })

    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect('/');
  })
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Create Account',
    isAuthenticated: false,
    errorMessage: message
  })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/signup', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: errors.array()[0].msg       
      });
  }
  console.log('POST SIGNUP');
  const confirmPassword = req.body.confirmPassword;
  console.log(email, password);
  User.findOne({ email: email })
    .then(userDoc => {
      console.log(userDoc)
      if (userDoc) {
        req.flash('error', 'Email already exists, please pick a different one');
        console.log('ACCOUNT EXISTS WITH EMAIL')
        res.redirect('/signup');
        return;
      } else {
        return bcryptjs.hash(password, 12).then(hashedPassword => {
          console.log('NEW ACCOUNT')
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        }).then(result => {
          console.log(result);
          res.redirect('/login');
        })
      }
    })

}
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No Account With That Email Found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          from: "bookShopUdemy@gmail.com",
          to: req.body.email,
          subject: "Password Reset",
          html: `
      <p>You requested a password reset</p>
      <p><a href="http://localhost:3000/reset/${token}">Click To Reset</a></p>
      `
        })
      })

      .catch(err => {
        console.log(err);
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });

}
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcryptjs.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .catch(err => {
      console.log(err);
    })
}

// npm install --save bcryptjs