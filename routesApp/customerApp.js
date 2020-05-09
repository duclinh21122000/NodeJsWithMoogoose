const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const Product = require('../model/product');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, 'imageCustomer');
    } else {
      cb(new Error('not image'), null);
    }
  },
  filename: function (req, file, cb) {
    // cb(null, `${file.originalname}.jpeg`);
    cb(null, 'customer'+Date.now()+'.jpg');
  },
});

var upload = multer({storage: storage});

router.post('/registerCustomer', upload.single('images'), (req, res) => {
  try {
    Customer.findOne({emailCus: req.body.emailCus}, (err, cus) => {
      if (cus) {
        res.json(false);
      } else {
        const customer = Customer({
          fullnameCus: req.body.fullnameCus,
          phoneCus: req.body.phoneCus,
          addressCus: req.body.addressCus,
          emailCus: req.body.emailCus,
          passwordCus: req.body.passwordCus,
          imageCus: req.file.filename,
        });
        customer.save();
        res.json(customer);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/loginCustomer', upload.single('images'), (req, res) => {
  Customer.findOne({emailCus: req.body.emailCus}, (err, cus) => {
    if (!cus) {
      res.json('tài khoản không tồn tại');
    } else if (req.body.passwordCus != cus.passwordCus) {
      res.json('email hoặc mật khẩu không đúng');
    } else {
      res.json(cus);
    }
  });
});

router.get('/getCustomer', async(req, res) => {
    Customer.find({emailCus: req.query.emailCus}, (err, cus) => {
      if(cus){
        res.json(cus)
      }else{
        console.log(err);
        res.json(false);
      }
    });
});

router.get('/getAllProduct', async(req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
