const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const expressSession = require('express-session');
//web
const Routes = require('./routes/user');
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');

//app
const customerAppRoutes = require('./routesApp/customerApp');
//
var initPassport = require('./passport/initSetup');

//Cấu hình cảnh báo hiển thị cho người dùng
const flash = require('connect-flash');
app.use(flash());
//Cấu hình thư mục public
app.use(express.static(__dirname + '/public'));
//Cấu hình passport
app.use(
  expressSession({
    secret: 'meo store',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);
//
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const rootDir = path.dirname(process.mainModule.filename);
app.use(express.static(path.join(rootDir, 'imageUser')));
app.use(express.static(path.join(rootDir, 'imageProduct')));
app.use(express.static(path.join(rootDir, 'imageCustomer')));
//Kết nối Mongo DB
const connectDB = require('./config/db');
connectDB();

//Cấu hình form gửi đi
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Cấu hình express handlebars
app.engine('.hbs', exphbs());
app.set('view engine', '.hbs');

//Điều hướng trong trang
app.use('/', Routes(passport));
app.use('/product', productRoutes(passport));
app.use('/customer', customerRoutes(passport));
app.use('/api', customerAppRoutes);
app.get('*', (req, res) => {
  res.render('404', {title: '404 - Page not found'});
});
//Điều hướng trong app

//Khởi chạy server
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
