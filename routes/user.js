var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../model/User.js');

router.get('/', checkAdmin, function (req, res) {
    res.redirect('/admin/user/list.html')
});

router.get('/list.html', checkAdmin, function (req, res) {
    User.find().then(function (data) {
        res.render('admin/user/list', {user: data});
    });
});

router.get('/add.html', checkAdmin, function (req, res) {
    res.render('admin/user/add', {errors: null});
});

router.post('/add.html', checkAdmin, function (req, res) {
    bcrypt.hash('123456', 12, (err, hash) => {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash,
            role: req.body.role
        });

        user.save().then(function () {
            req.flash('success_msg', 'Đã Thêm Thành Công');
            res.redirect('/admin/user/add.html');
        });
    });
});


router.get('/:id/delete.html', checkAdmin, function (req, res) {
    User.findById(req.params.id, function (err, data) {
        data.remove(function () {
            req.flash('success_msg', 'Đã Xoá Thành Công');
            res.redirect('/admin/user/list.html');
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
