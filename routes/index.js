var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "192.168.99.100",
    user: "root",
    password: "password123",
    database: "my-db"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// Tabelle löschen
// con.query("DROP TABLE Safe;", function (err, rows, fields) {
//     if (err) throw err;
//     console.log('The solution is: ', rows);
// });

// Tabelle neu erstellen
// con.query("CREATE TABLE Safe (personalKey int NOT NULL, title varchar(100), secret varchar(100), PRIMARY KEY(personalKey));", function (err, rows, fields) {
//     if (err) throw err;
//     console.log('The solution is: ', rows);
// });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hallo, speichere deine geheime Nachricht mit deinem eigenen Schlüssel'});
});

/**
 * Speichere eine geheime Nachricht
 */
router.get('/save', function (req, res, next) {
    var personalKey = req.query.personalKey;
    var title = req.query.title;
    var secret = req.query.secret;

    con.query("INSERT INTO Safe (personalKey, title, secret) VALUES (" + personalKey + ", '" + title + "', '" + secret + "') ", function (err, rows, fields) {
        if (err) throw err;
    });

    res.render('index', {title: 'Geheime Nachricht gespeichert'});
});

/**
 * lese die Geheime Nachricht aus dem Tresor aus
 */
router.get('/read', function (req, res, next) {
    var personalKey = req.query.key;

    //todo prevent SQL-Injections

    con.query("SELECT * FROM Safe WHERE personalKey=" + personalKey + ";", function (err, rows, fields) {
        if (err) throw err;
        res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
    });
});

module.exports = router;
