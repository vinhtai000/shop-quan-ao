var express = require('express');
var router = express.Router();

var Customer = require('../model/Customer.js');

/* GET home page. */
router.get('/', checkAdmin, function (req, res) {
  res.redirect('/admin/customer/list.html')
});

router.get('/list.html', checkAdmin, function (req, res) {

  Customer.find().then(function (customer) {
    res.render('admin/customer/list', {customer: customer});
  });
});

router.get('/add.html', checkAdmin, function (req, res) {
  res.render('admin/customer/add', {errors: null});
});


router.post('/add.html', checkAdmin, function (req, res) {
  var customer = new Customer({
    customerId: req.body.customerId,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    customerType: req.body.customerType,
  });

  customer.save().then(function () {
    req.flash('success_msg', 'Đã Thêm Thành Công');
    res.redirect('/admin/customer/add.html');
  });
});

router.get('/:id/edit.html', function (req, res) {
  Customer.findById(req.params.id).then(function (data) {
    res.render('admin/customer/edit', {errors: null, customer: data});
  });

});

router.post('/:id/edit.html', function (req, res) {
  Customer.findOne({_id: req.params.id}, function (err, data) {
    data.customerId = req.body.customerId;
    data.name = req.body.name;
    data.address = req.body.address;
    data.phone = req.body.phone;
    data.customerType = req.body.customerType;

    data.save();
    req.flash('success_msg', 'Đã Sửa Thành Công');
    res.redirect('/admin/customer/' + req.params.id + '/edit.html');
  });
});

router.get('/:id/delete.html', checkAdmin, function (req, res) {
  Customer.findById(req.params.id, function (err, data) {
    data.remove(function () {
      req.flash('success_msg', 'Đã Xoá Thành Công');
      res.redirect('/admin/customer/list.html');
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
