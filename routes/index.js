var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.99.100",
  user: "root",
  password: "password123",
  database: "my-db"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    var user = req.query.user;


    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });

    res.render('index', {title: 'Express'});
});

module.exports = router;
