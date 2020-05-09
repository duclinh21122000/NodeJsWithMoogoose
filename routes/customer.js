const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"){
                cb(null, 'imageCustomer');
        }else{
            cb(new Error("not image"), null);
        }
    },
    filename: function(req, file, cb){
        // cb(null, file.originalname);
        cb(null, 'customer'+Date.now()+'.jpg');
    }
});

var upload = multer({storage: storage});

//Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = function(req, res, next){
    //Nếu đã đăng nhập thì tiếp tục điều hướng
    if (req.isAuthenticated()) return next();
    //Nếu chưa đăng nhập thì chuyển về trang đăng nhập
    res.redirect("/");
};

const customerRoutes = (passport) => {
    router.get('/createcustomer', isAuthenticated, (req, res) => {
        res.render('createcustomer',{
            title: "Thêm khách hàng",
            fullname: req.user.fullname,
            avartar: req.user.imageUser,
            nameBtnCus: "THÊM KHÁCH HÀNG",
        });
    });

    router.post('/createcustomer', isAuthenticated, upload.single('fileCus'), async(req, res) => {

        if(req.body.id == ''){ //addCustomer
            try{
                const customer = Customer({
                    idAdmin: req.user._id,
                    fullnameCus: req.body.fullnameCus,
                    phoneCus: req.body.phoneCus,
                    addressCus: req.body.addressCus,
                    emailCus: req.body.emailCus,
                    passwordCus: req.body.passwordCus,
                    imageCus: req.file.filename,
                });
                await customer.save();
                res.render('createcustomer',{
                    title: "Thêm khách hàng",
                    message: "Thêm khách hàng thành công",
                    nameBtnCus: "THÊM KHÁCH HÀNG",
                    fullname: req.user.fullname,
                    avartar: req.user.imageUser,
                });
            }catch(error){
                res.render('createcustomer',{
                    title: "Thêm khách hàng",
                    message: "Thêm khách hàng thất bại",
                    nameBtnCus: "THÊM KHÁCH HÀNG",
                    fullname: req.user.fullname,
                    avartar: req.user.imageUser,
                });
                console.log(error);
            }
        }else{ //editProduct
            await Customer.findOneAndUpdate(
                {_id:req.body.id}, {
                    fullnameCus: req.body.fullnameCus,
                    phoneCus: req.body.phoneCus,
                    addressCus: req.body.addressCus,
                    emailCus: req.body.emailCus,
                    passwordCus: req.body.passwordCus,
                    imageCus: req.file.filename,
                },{new:true}, (err, doc) =>{
                    if(!err){
                        res.redirect('/customer');
                    }else{
                        console.log(err);
                        res.render('createcustomer',{
                            message: "Chỉnh sửa thất bại",
                            nameBtnCus: "CHỈNH SỬA KHÁCH HÀNG",
                            title: "Chỉnh sửa khách hàng",
                            fullname: req.user.fullname,
                            avartar: req.user.imageUser,
                        });
                    }
                });
        }
    });

    router.get("/", isAuthenticated, async(req, res) => {
        await Customer.find({}, (err, docs) =>{
            res.render("listcustomer",{
                title: "Danh sách khách hàng",
                customers: docs.map((customer, index) =>({
                    ...customer.toJSON(),
                    noNum: index + 1,
                })),
                fullname: req.user.fullname,
                avartar: req.user.imageUser,
            });
        });
    });

    router.get('/editcustomer/:id', isAuthenticated, (req, res) => {
        Customer.findById(req.params.id, (err, customer)=>{
            if(!err){
                res.render('createcustomer',{
                    title: "Chỉnh sửa khách hàng",
                    nameBtnCus: "CHỈNH SỬA KHÁCH HÀNG",
                    customer: customer.toJSON()
                });
            }
        });
    });

    router.get('/deletecustomer/:id', isAuthenticated, async(req, res) => {
        try{
            const customer = await Customer.findByIdAndDelete(req.params.id, req.body);
                if(!customer){res.status(404).send("No item found");} 
                else{
                    res.redirect('/customer');
                }
                // res.status(200).send();
        }catch(error){
            res.status(500).send(error);
        }
    });

    return router;
};

module.exports = customerRoutes;