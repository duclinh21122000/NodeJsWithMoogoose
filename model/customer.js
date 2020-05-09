const mongoose = require('mongoose');

const Customer = mongoose.Schema({
    idAdmin: {type: String},
    fullnameCus: {type: String},
    phoneCus: {type: String},
    addressCus: {type: String},
    emailCus: {type: String, require: true},
    passwordCus: {type: String},
    imageCus: {type: String},
});

module.exports = mongoose.model('Customer', Customer);