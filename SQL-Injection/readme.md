Dies ist eine Übungsaufgabe für den SSE Kurs im Wintersemester 2019/20 an der Hochschule Mannheim. 

# Injection

Eine Code injection ist ein generisches Problem (nicht beschränkt auf SQL). Es tritt auf, wenn Benutzereingaben in ein Statement integriert und ungeprüft ausgeführt werden. 

Beispiel:
```
txtUserId = getRequestString("UserId");
txtSQL = "SELECT * FROM Users WHERE UserId = " + txtUserId;
```

In diesem Beispiel soll der User eine ID eingeben. Diese wird dann ohne Umwege mit einem SQL-Query-String konkateniert. Wenn niemand prüft, dass wirklich nur eine Zahl eingegeben wurde, so kann das SQL-Statement nach Belieben von einem Angreifer verändert werden.

UserId: 105 OR 1=1

Der String sähe nun wie folgt aus: 
```
SELECT UserId, Name, Password FROM Users WHERE UserId = 105 or 1=1;
```

Anstatt nur den User mit der Id 105 auszugeben würde die Datenbank einfach alle User ausgeben.

## Ausführen des Programmes

Bei diesem Programm handelt es sich um einen Node Express Server mit einer MySQL Datenbank. Das System erlaubt das speichern geheimer Nachrichtichten mit einem Key.
Wenn der Key erneut eingegen wird, kann der Nutzer die geheime Nachricht lesen.

Das System sollte nicht produktiv eingesetzt werden, sondern dient der Übung SQL-Injections auszutesten.
Sowohl beim erstellen und beim lesen geheimer Nachrichrichten sind verschiedene Injections möglich.

### Mit Docker

Wenn Docker auf dem Zielsystem installiert ist, dann lassen sich der Node Server und eine SQL Datenbank mit nur einem Befehl starten:
``docker-compose up``

In der docker-compose.yml stehen die Initialisierungsdaten der MySQL Datenbank.

In der routes/index.js stehen die Verbindungsdaten zur Datenbank. Als Host ist die ``docker-machine ip`` anzugeben. Der default Port ist 3306, sollte dieser abweichen muss auch der Port mit angegeben werden.

Die Webseite ist dann unter ``docker-machine ip`` mit Port 3000 zu ereichen.

### Ohne Docker

Der Node Server kann alternativ auch mit dem Befehl: ``node start`` gestartet werden. Eine MySQL Datenbank muss selber installiert und aufgesetzt werden.


## Lösungen

| Zweck der Injection | Eingabefeld | Eingbe |
| -- | -- | -- |
| Tabelle oder Datenbank löschen | speichern - Geheime Nachricht |  this is my secret'); DROP TABLE Safe; |
| alle Zeilen vom Safe lesen | Query |  /secretMessage/read?key=1 OR 1=1 |

