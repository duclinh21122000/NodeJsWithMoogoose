const mongoose = require('mongoose');
const Product = mongoose.Schema({
    idAdmin: {type: String},
    nameProduct : {type: String},
    amount: {type: Number},
    price: {type: Number},
    description: {type: String},
    note: {type: String},
    imageProduct: {type: String},
});

module.exports = mongoose.model("Product", Product);