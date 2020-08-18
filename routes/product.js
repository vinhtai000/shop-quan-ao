var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file) {
            cb(null, true);
        }
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        cb(null, true);
    }
});


function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    return str;
}

var Product = require('../model/Product.js');

/* GET home page. */
router.get('/', checkAdmin, function (req, res) {
    res.redirect('/admin/product/list.html')
});

router.get('/list.html', checkAdmin, function (req, res) {

    Product.find().then(function (pro) {
        res.render('admin/product/list', {product: pro});
    });
});

router.get('/add.html', checkAdmin, function (req, res) {
    res.render('admin/product/add', {errors: null});
});


router.post('/add.html', checkAdmin, upload.single('hinh'), function (req, res) {
    let filename;
    console.log("test: " + req.file);
    if (req.file) {
        filename: req.file.filename
    }
    var pro = new Product({
        productId: req.body.productId,
        name: req.body.name,
        search: bodauTiengViet(req.body.name),
        cate: req.body.cate,
        img: filename,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
    });

    pro.save().then(function () {
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('/admin/product/add.html');
    });
});

router.get('/:id/edit.html', function (req, res) {
    Product.findById(req.params.id).then(function (data) {
        res.render('admin/product/edit', {errors: null, product: data});
    });

});

router.post('/:id/edit.html', upload.single('hinh'), function (req, res) {
    Product.findOne({_id: req.params.id}, function (err, data) {
        var file = './public/upload/' + data.img;
        var fs = require('fs');
        if (fs.existsSync(file) && req.file) {
            fs.unlink(file, function (e) {
                if (e) throw e;
            });
        }
        data.productId = req.body.productId;
        data.name = req.body.name;
        data.search = bodauTiengViet(req.body.name);
        if (req.file) {
            data.img = req.file.filename;
        }
        data.cate = req.body.cate;
        data.description = req.body.description;
        data.price = req.body.price;
        data.quantity = req.body.quantity;

        data.save();
        req.flash('success_msg', 'Đã Sửa Thành Công');
        res.redirect('/admin/product/' + req.params.id + '/edit.html');
    });
});

router.get('/:id/delete.html', checkAdmin, function (req, res) {
    Product.findById(req.params.id, function (err, data) {
        var file = './public/upload/' + data.img;
        var fs = require('fs');
        if (fs.existsSync(file)) {
            fs.unlink(file, function (e) {
                if (e) throw e;
            });
        }
        data.remove(function () {
            req.flash('success_msg', 'Đã Xoá Thành Công');
            res.redirect('/admin/product/list.html');
        })
    });
});

function checkAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/admin/login.html');
    }
}

module.exports = router;
