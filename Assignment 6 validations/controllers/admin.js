const Product = require('../models/product');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
  // console.log(req.user);
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;


  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    // userId: req.user._id
    userId: req.user // MONGOOSE WILL PICK THE USER ID ITSELF
  }
  );
  product.save()  // .save() is a function by mongoose
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log('EDIT MODE');
  console.log(req.user);

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)  // .findById is a function by mongoose we just have to send a string to it 
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, new ObjectId(prodId));
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      console.log('PRODUCT TO BE UPDATED');
      console.log(product);
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.save()
        .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        })
    })

    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')  // select helps in selecting some specific fields of data we want like title and ptice, -_id will not return id in the console

    // .populate('userId')  // FUNCTION BY MONGOOSE TO GET THE DATA FROM REFERENCE COLLECTION
    .then(products => {
      console.log(products);

      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  console.log(prodId);
  // findByIdAndRemove() is a mongoose function
  // Product.findByIdAndRemove(prodId) 
  Product.deleteOne({ id: prodId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
