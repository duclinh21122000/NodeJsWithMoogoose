const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"){
                cb(null, 'imageProduct');
        }else{
            cb(new Error("not image"), null);
        }
    },
    filename: function(req, file, cb){
        // cb(null, file.originalname);
        cb(null, 'product'+Date.now()+'.jpg');
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

const productRoutes = (passport) => {
    router.get('/createproduct', isAuthenticated, (req, res) => {
        res.render('createproduct',{
            title: "Thêm sản phẩm",
            fullname: req.user.fullname,
            avartar: req.user.imageUser,
            nameButton: "THÊM SẢN PHẨM",
        });
    });

    router.post('/createproduct', isAuthenticated, upload.single('files'), async(req, res) => {

        if(req.body.id == ''){ //addProduct
            try{
                const product = Product({
                    idAdmin: req.user._id,
                    nameProduct: req.body.nameProduct,
                    amount: req.body.amount,
                    price: req.body.price,
                    description: req.body.description,
                    note: req.body.note,
                    imageProduct: req.file.filename,
                });
                await product.save();
                res.render('createproduct',{
                    title: "Thêm sản phẩm",
                    message: "Thêm sản phẩm thành công",
                    nameButton: "THÊM SẢN PHẨM",
                    fullname: req.user.fullname,
                    avartar: req.user.imageUser,
                });
            }catch(error){
                res.render('createproduct',{
                    title: "Thêm sản phẩm",
                    message: "Thêm sản phẩm thất bại",
                    nameButton: "THÊM SẢN PHẨM",
                    fullname: req.user.fullname,
                    avartar: req.user.imageUser,
                });
                console.log(error);
            }
        }else{ //editProduct
            await Product.findOneAndUpdate(
                {_id:req.body.id}, {
                    nameProduct: req.body.nameProduct,
                    amount: req.body.amount,
                    price: req.body.price,
                    description: req.body.description,
                    note: req.body.note,
                    imageProduct: req.file.filename,
                },{new:true}, (err, doc) =>{
                    if(!err){
                        res.redirect('/product');
                    }else{
                        console.log(err);
                        res.render('createproduct',{
                            message: "Chỉnh sửa thất bại",
                            nameButton: "CHỈNH SỬA SẢN PHẨM",
                            title: "Chỉnh sửa sản phẩm",
                            fullname: req.user.fullname,
                            avartar: req.user.imageUser,
                        });
                    }
                });
        }
    });

    router.get("/", isAuthenticated, async(req, res) => {
        await Product.find({idAdmin: req.user._id}, (err, docs) =>{
            res.render("listproduct",{
                title: "Danh sách sản phẩm",
                products: docs.map((product, index) =>({
                    ...product.toJSON(),
                    noNum: index + 1,
                })),
                fullname: req.user.fullname,
                avartar: req.user.imageUser,
            });
        });
    });

    router.get("/dashboard", isAuthenticated, async(req, res) => {
        await Product.find({idAdmin: req.user._id}, (err, docs) =>{
            res.render("dashboard",{
                title: "Trang Chủ",
                products: docs.map((product, index) =>({
                    ...product.toJSON(),
                    noNum: index + 1,
                })),
                fullname: req.user.fullname,
                avartar: req.user.imageUser,
            });
        });
    });

    router.get('/editproduct/:id', isAuthenticated, (req, res) => {
        Product.findById(req.params.id, (err, product)=>{
            if(!err){
                res.render('createproduct',{
                    title: "Chỉnh sửa sản phẩm",
                    nameButton: "CHỈNH SỬA SẢN PHẨM",
                    product: product.toJSON()
                });
            }
        });
    });

    router.get('/deleteproduct/:id', isAuthenticated, async(req, res) => {
        try{
            const product = await Product.findByIdAndDelete(req.params.id, req.body);
                if(!product){res.status(404).send("No item found");} 
                else{
                    res.redirect('/product');
                }
                // res.status(200).send();
        }catch(error){
            res.status(500).send(error);
        }
    });

    return router;
};

module.exports = productRoutes;