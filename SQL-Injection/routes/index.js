var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "192.168.99.100",
    user: "root",
    password: "password123",
    database: "ssedb",
    port:3306,
    multipleStatements: true
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



router.get('/', function (req, res, next) {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });

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
    

    // Unsichere Version
    con.query("INSERT INTO Safe (personalKey, title, secret) VALUES (" + personalKey + ", '" + title + "', '" + secret + "');", function (err, rows, fields) {
        if (err){
            console.log('Something went wrong during insert');
            console.log(err)
        }
    });


    // Prepared Statement
    /*con.query("INSERT INTO Safe (personalKey, title, secret) VALUES (?, ?, ?);",
        [personalKey, title, secret],
        function (err, rows, fields) {
        if (err){
            console.log('Something went wrong during insert');
            console.log(err)
        }
    });*/


    // WHITELIST NICHT UMSETZBAR -> OR TRUE


    // Escaping
    /*console.log("\n\nEingabe: " + personalKey + ", " + title + ", " + secret + " -> Escaped: " + con.escape(personalKey) + ", " + con.escape(title) + ", " + con.escape(secret) + "\n\n");
    con.query("INSERT INTO Safe (personalKey, title, secret) VALUES ("+con.escape(personalKey)+", "+con.escape(title)+", "+con.escape(secret)+");", function (err, rows, fields) {
        if (err){
            console.log('Something went wrong during insert');
            console.log(err)
        }
    });*/


    // STORED PROCEDURES


    console.log(`NEW ROW ${personalKey} | ${title} | ${secret}`);
    res.render('index', {title: 'Geheime Nachricht gespeichert'});
});

/**
 * lese die Geheime Nachricht aus dem Tresor aus
 */
router.get('/secretMessage/read', function (req, res, next) {
    var personalKey = req.query.key;

    
    // Unsichere Version
    con.query("SELECT * FROM Safe WHERE personalKey=" + personalKey + ";", function (err, rows, fields) {
        if (err) console.log('Something went wrong during select');
        console.log(`SHOW ${personalKey}`);
        res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
    });


    // Prepared Statement
    /*con.query("SELECT * FROM Safe WHERE personalKey=?;",
        [personalKey],
        function (err, rows, fields) {
        if (err) console.log('Something went wrong during select');
        console.log(`SHOW ${personalKey}`);
        res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
    });*/


    // Whitelist
    /*if(isNaN(personalKey)) {
        res.send('<div style="color:#FFFFFF; background-color: red; margin-top: 100px; text-align: center; line-height: 100px; height: 100px; width: 100%; font-size: 25px;">Keine Zahl eingegeben!</div>');
    } else {
        con.query("SELECT * FROM Safe WHERE personalKey=" + personalKey + ";", function (err, rows, fields) {
            if (err) console.log('Something went wrong during select');
            console.log(`SHOW ${personalKey}`);
            res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
        });
    }*/


    // Escaping
    /*console.log("\n\nEingabe: " + personalKey + " -> Escaped: " + con.escape(personalKey) + "\n\n");
    con.query("SELECT * FROM Safe WHERE personalKey=" + con.escape(personalKey) + ";", function (err, rows, fields) {
        if (err) console.log('Something went wrong during select');
        console.log(`SHOW ${personalKey}`);
        res.render('index', {title: 'Geheime Nachricht gefunden', data: rows});
    });*/


    // STORED PROCEDURES
    
    
});

module.exports = router;
