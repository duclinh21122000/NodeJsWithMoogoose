const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');

const signIn = (passport) => {
    passport.use(
        "signin",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                // Tìm dữ liệu theo email trong mongo
                User.findOne({ username: username }, (err, user) => {
                    // Nếu có lỗi thì bỏ qua không đăng nhập
                    if (err) return done(err);
                    // Nếu người dùng không tồn tại thì bỏ qua không đăng nhập và trả về thông tin
                    if(!user){
                        return done(
                            null,
                            false,
                            req.flash("message", "Không có tài khoản này!!!")
                        );
                    }
                    // Trả về thông báo nếu kiểm tra sai mật khẩu người dùng
                    if(password != user.password){
                        return done(
                            null,
                            false,
                            req.flash(
                                "message",
                                "Tài khoản hoặc mật khẩu đăng nhập không chính xác."
                            )
                        );
                    }
                    return done(null, user);
                });
            }
        )
    );
};

module.exports = signIn;