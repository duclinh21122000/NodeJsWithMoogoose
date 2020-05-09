const express = require('express');
const User = require('../model/user');
const router = express.Router();
const Product = require('../model/product');

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, 'imageUser');
    } else {
      cb(new Error('not image'), null);
    }
  },
  filename: function (req, file, cb) {
    // cb(null, file.originalname);
    cb(null, 'user'+ Date.now()+'.jpg');
  },
});

var upload = multer({storage: storage});

//Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = function (req, res, next) {
  //Nếu đã đăng nhập thì tiếp tục điều hướng
  if (req.isAuthenticated()) return next();
  //Nếu chưa đăng nhập thì chuyển về trang đăng nhập
  res.redirect('/');
};

const Routes = (passport) => {
  router.get('/', (req, res) => {
    // if (req.isAuthenticated()) return res.redirect('/');
    res.render('login', {
      title: 'Đăng Nhập',
      message: req.flash('message'),
    });
  });

  router.post(
    '/signin',
    passport.authenticate('signin', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true,
    })
  );

  router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('register', {
      title: 'Đăng ký',
      message: req.flash('message'),
    });
  });

  router.post('/signup', upload.single('files'), (req, res, next) => {
    imageUser = req.file.filename;
    passport.authenticate('signup', {
      successRedirect: '/signup',
      failureRedirect: '/signup',
      failureFlash: true,
    })(req, res, next);
  });

  router.get('/dashboard', isAuthenticated, async (req, res) => {
    await Product.find({idAdmin: req.user._id}, (err, docs) => {
      res.render('dashboard', {
        title: 'Trang Chủ',
        products: docs.map((product, index) => ({
          ...product.toJSON(),
          noNum: index + 1,
        })),
        fullname: req.user.fullname,
        avartar: req.user.imageUser,
      });
    });
  });

  router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  return router;
};

module.exports = Routes;
