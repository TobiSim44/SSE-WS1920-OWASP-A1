var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const cp = require('child_process');




  router.post("/loadFileLvl3", (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
  
    if(!(username || filename)){
      res.send('sorry das geht so nicht. So kann ich nicht arbeiten :~(');
      return;
    }
  
    const fpath = path.join(__dirname, 'level3', username, filename);
    fs.readFile(fpath, (err, data) => {
      if(err) {
        const response = {"info": "Datei konnte nicht geladen werden!", "filename": filename, "data": null};
        res.send(JSON.stringify(response));
      } else {
        const response = {"info": 'Datei erfolgreich geladen!', "filename": filename, "data": data.toString('utf8')}
        res.send(JSON.stringify(response));
      }
      
    })
  })

  router.post('/saveFileLvl3', function (req, res) {
    const username = req.body.username.trim();
    const filename = req.body.filename.trim();
    const filecontent = req.body.filecontent.replace(/\n/gi, " ");
    const regexpNoCheat = /server/gi;
    const regexBanRm = /\s+rm\s+/gi;

    if(!username) {
      res.send(JSON.stringify({err: true, data: "Du musst erst einen Usernamen eingeben!"}));
      return;
    }
  
    if(!filename) {
      res.send(JSON.stringify({err: true, data: "Du musst einen Dateinamen eingeben!"}));
      return;
    }
  
    if(!filename.match(/^[\w\-. ]+$/)){
      res.send(JSON.stringify({err: true, data: 'Der Dateiname ist leider ungueltig!'}));
      return;
    }
    
    const folder = path.join(__dirname, 'level3', username)
    const fpath = path.join(folder, filename);
  
    if(!fs.existsSync(folder)) {
      res.send(JSON.stringify({err: true, data: 'Datei konnte nicht geispeichert werden!\nHast du vorher auf Login geklickt?'}));
      return;
    }

    //no cheat
    if(filecontent.match(regexpNoCheat) || filecontent.match(regexBanRm))
      res.send(JSON.stringify({err: true, data: 'You should not Cheat!'}));
    else {
      const command = 'echo ' + filecontent + ' > ' + fpath;
      cp.exec(command, {cwd: __dirname},(err, _stdout, _stderr) => {
        console.log(err, _stdout, _stderr);
        
        if (err) res.send(JSON.stringify({err: true, data: 'mmhh shit irgendwas ist schief gegangen'}));
        else res.send(JSON.stringify({err: false, data: "Datei gespeichert"}));
      })
    }
  });

  router.post("/loginLvl3", (req, res) => {
    const username = req.body.username.trim();
    const regexUsername = /\w+/
    const fpath = path.join(__dirname, "level3", username);

    if(!username && !username.match(regexUsername)) {
      res.send(JSON.stringify({err: true, data: "Du musst erst einen Usernamen eingeben oder er enhtält ungeültige Zeichen"}));
      return;
    }

    fs.exists(fpath, (exists) => {
      if(exists){
        fs.readdir(fpath, (_err, data) => {
          res.send(JSON.stringify({err: false, data: data}));
        })
  
        return;
      }
  
      fs.mkdir(fpath, null, (err) => {
        res.send(JSON.stringify({err: true, data: 'Du hast noch keine Dateien'}));
      })
    })
  });

  module.exports = router;