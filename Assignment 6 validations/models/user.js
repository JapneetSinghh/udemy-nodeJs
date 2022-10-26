const mongoose = require('mongoose');
const Product = require('./product');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        // productId:{type:Schema.Types.ObjectId,required:true},
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },// GIVING REFERENCE OF PRODUCT SCHEMA
        quantity: { type: Number, required: true }
      }
    ]
  }
})


userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let updatedCartItem = [...this.cart.items];
  // let updatedCart = {items:[{...product, quantity : 1}]};

  let newQuantity = 1;
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItem.push(
      {
        productId: product._id,
        quantity: newQuantity
      }
    )
  }
  const updatedCart =
  {
    items: updatedCartItem
  }

  this.cart = updatedCart;
  return this.save();
}
userSchema.methods.deleteFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== prodId.toString();
  });
  console.log(updatedCartItems);
  this.cart.items = updatedCartItems;
  return this.save();
}
userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items:[]}
//     this._id = id;
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let updatedCartItem = [...this.cart.items];
//     // let updatedCart = {items:[{...product, quantity : 1}]};

//     let newQuantity = 1;
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItem[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItem.push(
//         {
//           productId: new mongodb.ObjectId(product._id),
//           quantity: newQuantity
//         }
//       )
//     }
//     const updatedCart =
//     {
//       items: updatedCartItem
//     }

//     const db = getDb();
//     return db.collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('users')
//       .findOne({ _id: new mongodb.ObjectId(id) })
//       .then(user => {
//         console.log(user);
//         return user;
//       });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString();
//     });
//     console.log(updatedCartItems);
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//   addOrder() {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.username
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     })
//       .then(result => {
//         this.cart = { items: [] };
//         return db.collection('users').updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//       })
//   }
//   getOrders(){
//     const db = getDb();
//    return db
//    .collection('orders')
//    .find({'user._id':new mongodb.ObjectId(this._id)})
//    .toArray();
//   }
// }
// module.exports = User;
