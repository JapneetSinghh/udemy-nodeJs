const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();
const flash = require('connect-flash');
// ADDING TOKEN
const csrf = require('csurf');

// ADDING SESSION
const session = require('express-session');
const MONGODB_URI = 'mongodb+srv://japneetsinghh:sidak123@cluster0.hz9yv72.mongodb.net/shop?retryWrites=true&w=majority';

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.use(
  session({
    secret: 'my secret',
    resave: 'false',
    saveUninitialized: false,
    store: store
  })
);

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.use((req, res, next) => {
//   User.findById("634939d79f398fbea2e5021d")
//     .then(user => {
//       req.user = user;
//       // console.log(req);
//       next();
//     })
//     .catch(err => console.log(err));
// });
app.use((req, res, next) => {
  console.log(req.session);
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      // console.log(user);
      req.user = user;
      // console.log(req);
      next();
    })
    .catch(err => console.log(err));
});

const csrfProtection = csrf();
app.use(flash());

app.use(csrfProtection);
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // req.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI).then(result => {
  console.log('Cnnected !');
  User.findOne() // CHECKING IF THERE IS ANY USER 
    .then(user => {
      if (!user) {
        const user = new User({
          name: 'Japneet Singh',
          email: 'Japneet8208@gmail.com',
          cart: {
            items: []
          }
        })
        user.save();
      }
    })
  app.listen(3000);
})
  .catch(err => {
    console.log(err);
  })

// .find() gets all the items from the collection
// .findById(itemToBeFound) gets the item from the collection
// .save() saves the newly created item from the schema
// .findByIdAndRemove(prodId)
// .findOne() gets the first item if no parameters are given
// .select(tile price _id)
// .populate('userId')

// npm install --save express-session
// npm install --save connect-mongodb-session
// npm install --save csurf
// npm install --save connect-flash