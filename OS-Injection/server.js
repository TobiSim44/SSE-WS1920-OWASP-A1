const cp = require('child_process');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");11
const app = express();
const fs = require('fs');
const lvl3Routes = require('./routeLevel3/routesLvl3.js');
let cntTimesFlagLvl1Sub = 0;
let cntTimesFlagLvl2Sub = 0;
let cntTimesFlagLvl3Sub = 0;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use("/", lvl3Routes);

app.get('/evalInputLvl1', function (req, res) {
	const command = 'host ';
	const regexpFromatHTML = /\n/gi;
	const regexpNoCheat = /server/gi;
	const regexBanRm = /\s+rm\s+/gi;
	const regexFilterLevel3 =  /\n.*?routeLevel3/
	const regexFilterLevel2 = /\n.*?thisIsTheFlag/
	const queryParam = req.query.userIp;

	//no cheat
		if(queryParam.match(regexpNoCheat) || queryParam.match(regexBanRm))
			res.send('You should not Cheat!');
		else
			cp.exec(command + queryParam, (_err, stdout, _stderr) => {
				let response = stdout.replace(regexFilterLevel3, "").replace(regexFilterLevel2, "").replace(regexpFromatHTML, "<br>");
				res.send(response);
			});   
});

/*Variante 1: Blacklist
 Es werden bestimmte Zeichen, wie das &-Zeichen, verboten */
function blacklist(input) {
	const substrings = ["|",";","&","$","<",">","'","\\","!",">>","#"];
	const str = input;
	if (substrings.some(function(v) { return str.indexOf(v) >= 0; })) {
    	return false;
	}
	return true;
}

/*Variante 2: Whitelist
Es werden nur bestimmte Zeichen erlaubt, in diesem Fall sind das Zahlen und Punkte. */
function whitelist(input) {
	var reg=/^([0-9]|\.)+$/;
	if(reg.test(input)) {
		return true;
	}
	return false;
}

app.get('/evalInput', function (req, res) {
		const command = 'ping -c 4 ';
		const regexpFromatHTML = /\n/gi;
		const regexpNoCheat = /server/gi;
		const regexFilterLevel3 =  /\n.*?routeLevel3/
		const regexBanRm = /\s+rm\s+/gi;
		const queryParam = req.query.userIp;

		//console.log(queryParam);

		//if(whitelist(queryParam)) {
		//if(blacklist(queryParam)) {
		//no cheat
			if(queryParam.match(regexpNoCheat) || queryParam.match(regexBanRm))
				res.send('You should not Cheat!');
			else
				cp.exec(command + queryParam, (_err, stdout, _stderr) => {
					//console.log(stdout)
					let response = stdout.replace(regexFilterLevel3, "").replace(regexpFromatHTML, "<br>");
					res.send(response);
				});   

		// } else {
		// 	res.send('Du hast unerlaubte Zeichen eingegeben!');
		// }
});

//submit flag for level 1
app.get('/flagLvl1', function (req, res) {
	//console.log(req.query.flag)
	if(req.query.flag === '21c03acad5a7e68094b680725be8137a480a783564308d00612f9e301de9e3a2') {
		console.log("Flagge 1 eingereicht: ", ++cntTimesFlagLvl1Sub);
		res.send('Yeahh geschafft. Du hast die erste Flagge gefunden. <br><a href=10391f993067d8ecf3c2681bcc762734e953711d4d0532c1feb9f7c0fa812e55> Hier gehts zur zweiten Aufgabe </a>"');
	} else
		res.send('Sorry das war wohl nicht die richtige Flagge');
});


//submit flag for level 2
app.get('/flagLvl2', function (req, res) {
	if(req.query.flag === '10391f993067d8ecf3c2681bcc762734e953711d4d0532c1feb9f7c0fa812e55') {
		console.log("Flagge 2 eingereicht: ", ++cntTimesFlagLvl2Sub);
		res.send('Yeahh geschafft. Du hast die zweite Flagge gefunden. <br><a href=981a6b2fe171aa8eb53b6d76f7976063c88ef63cb588dbece8a543e1c95e2145> Hier gehts zur dritten Aufgabe </a>"');
	}else
		res.send('Sorry das war wohl nicht die richtige Flagge');
});


//submit flag for level 3
app.get('/flagLvl3', function (req, res) {
	if(req.query.flag === '03b927fbad1a7f14ec5ef8325998f4f412ec28ccc704a060986c46ed60889457') {
		console.log("Flagge 3 eingereicht: ", ++cntTimesFlagLvl3Sub);
		res.send("<h1>Herzlichen Glückwunsch du hast alle Level erfolgreich geloesst!");
	}else
		res.send('Sorry das war wohl nicht die richtige Flagge');
});



// goto level 2
app.get('/10391f993067d8ecf3c2681bcc762734e953711d4d0532c1feb9f7c0fa812e55', function (_req, res) {
	const fpath = path.join(__dirname, 'level2.html');
  res.sendFile(fpath)
});


// goto level 3
app.get('/981a6b2fe171aa8eb53b6d76f7976063c88ef63cb588dbece8a543e1c95e2145', function (_req, res) {
	const fpath = path.join(__dirname, 'level3.html');
  res.sendFile(fpath)
});


app.get('/', (req, res) => {
	const fpath = path.join(__dirname, 'index.html');
	res.sendFile(fpath)
});

app.get('*', (req, res) => {
	if (req.params[0] === '/style.css')  {
		
		const fpath = path.join(__dirname, req.params[0]);
		res.sendFile(fpath)
	} else {
		res.send();
	}
});


app.listen(3000, () => {
  console.log('server listening on port 3000!');
});







