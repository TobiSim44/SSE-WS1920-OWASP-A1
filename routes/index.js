var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "192.168.99.100",
    user: "root",
    password: "password123",
    database: "my-db",
    multipleStatements: true
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// try {
//     //warning Tabelle löschen
//     con.query("DROP TABLE Safe;", function (err, rows, fields) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('The solution is: ', rows);
//     });
// } catch (e) {
//
// }

try {
    // Tabelle neu erstellen
    con.query("CREATE TABLE Safe (personalKey int NOT NULL, title varchar(100), secret varchar(100), PRIMARY KEY(personalKey));", function (err, rows, fields) {
        if (err) {
            return;
        }
        console.log('_________________ TABLE Safe CREATED _________________');
    });
} catch (e) {

}

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hallo, speichere deine geheime Nachricht mit deinem eigenen Schlüssel'});
});

/* GET home page. */
router.get('/secretMessage', function (req, res, next) {
    res.render('index', {title: 'Hallo, speichere deine geheime Nachricht mit deinem eigenen Schlüssel'});
});

/**
 * Speichere eine geheime Nachricht
 */
router.get('/secretMessage/save', function (req, res, next) {
    var personalKey = req.query.personalKey;
    var title = req.query.title;
    var secret = req.query.secret;

    con.query("INSERT INTO Safe (personalKey, title, secret) VALUES (" + personalKey + ", '" + title + "', '" + secret + "');", function (err, rows, fields) {
        if (err){
            console.log('Something went wrong during insert');
            console.log(err)
        }
    });
    console.log(`NEW ROW ${personalKey} | ${title} | ${secret}`);
    res.render('index', {title: 'Geheime Nachricht gespeichert'});
});

/**
 * lese die Geheime Nachricht aus dem Tresor aus
 */
router.get('/secretMessage/read', function (req, res, next) {
    var personalKey = req.query.key;

    //todo prevent SQL-Injections

    con.query("SELECT * FROM Safe WHERE personalKey=" + personalKey + ";", function (err, rows, fields) {
        if (err) console.log('Something went wrong during select');
        console.log(`SHOW ${personalKey}`);
        res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
    });
});

module.exports = router;
