const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const multer = require('multer');

const signup = (passport) => {
   
    passport.use(
        "signup",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                const createAccount = () => {
                    // Kiểm tra xem email đã có trong db hay chưa
                    User.findOne({username: username}, (err, user) =>{
                        // Nếu có lỗi xảy ra thì không tiến hành đăng ký
                        if (err) return done(err);
                        // Nếu email đã có trong db thì gửi về thông báo cho người dùng
                        if(user){
                            return done(
                                null,
                                false,
                                req.flash("message", "Tên đăng nhập đã tồn tại!!!")
                            );
                        }else{
                            //Nếu không có email nào thì tiến hành tạo tài khoản mới
                            let userInfo = new User();
                            userInfo.username = username;
                            userInfo.fullname = req.body.fullname;
                            userInfo.password = password;
                            userInfo.imageUser = imageUser;
                            // Cập nhật tải khoản lên mongoDB
                            userInfo.save((err) => {
                                if(err){
                                    console.log(err.message);
                                    throw err;
                                }
                                //Trả về thông tin sau khi hoàn tất
                                return done(null, userInfo, req.flash("message", "Đăng ký thành công"));
                            });
                        }
                    });
                };
                process.nextTick(createAccount);
            }
        )
    );
};

module.exports = signup;