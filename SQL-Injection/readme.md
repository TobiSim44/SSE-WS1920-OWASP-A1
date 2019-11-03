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


# Injections effektiv verhindern

Injections sind ein generisches Problem und beschränken sich nicht ausschließlich auf SQL- und OS-Injections. Anwendungen, die effektiv vor Injections geschützt werden sollen, dürfen keinesfalls Eingaben von Benutzern ungeprüft verarbeiten. Das oberste Ziel des Programmierers muss sein, alle Eingaben kritisch zu validieren und sie niemals ungeprüft als Teil von Befehlen auszuführen.

In diesem Dokument liegt der Fokus auf der Verhinderung von SQL- und OS-Injections, da diese in der Vorlesung behandelt wurden. Diese exemplarischen Lösungen sollen generell zeigen, wie Angriffe effektiv verhindert werden können. Das Wissen kann anschließend auf andere Projekte und insbesondere auf nicht-SQL- / OS-Szenarien projiziert werden.

## Prepared Statements

Sie sorgen dafür, dass die SQL-Query und die Benutzereingaben getrennt voneinander an den Datenbank-Server gesendet werden. Dadurch ist ein Vermischen zwischen SQL-Anweisung und Benutzereingaben nicht mehr möglich, da zudem die Benutzereingabe escaped wird.

Beispiel (mit nicht benannten Parametern):
```
var input = "vom Benutzer";
con.query("SELECT * FROM table WHERE id=?;",
   [input],
   function (err, rows, fields) {
        ...
   }
);

```

## Whitelist

Die strikte Vorgabe, welche Benutzereingaben erlaubt sind, ist ein effektiver Schutz. Leider ist dies nicht immer umsetzbar. Ein Anwendungsszenario wäre zum Beispiel, wenn bei der Eingabe von Schlüsseln (siehe Beispiel in der Vorlesung) geprüft wird, ob es sich wirklich nur um eine Zahl handelt. Alle Anderen Eingaben werden abgelehnt.

Beispiel:
```
var input = "vom Benutzer";
if(isNaN(input)) {
    // Fehler: keine Zahl eingegeben!
} else {
    // Ok: suche in der Datenbank
    ...
}

```

## Stored Procedures

Über gespeicherte Abläufe innerhalb des Datenbanksystems lassen sich Abfolgen von SQL-Befehlen einfach von außerhalb anstoßen. Dies verhindert, dass Benutzereingaben direkt Teil der SQL-Query werden. Wird ein entsprechender Befehl an die Datenbank gesendet, werden die SQL-Befehle innerhalb der Datenbank ausgeführt. Stored Procedures können selbstverständlich auch mit Benutzereingaben kombiniert werden, diese dürfen aber genau wie bei der Sektion "Prepared Statements" nicht als konkatenierter String versendet werden.

## Escaping

Diese Methode sollte nur angewendet werden, wenn alle anderen Lösungsmöglichkeiten nicht umsetzbar sind. Bei der Umsetzung werden alle Benutzereingaben escaped und erst danach in die SQL-Query eingefügt. Die Implementierung hängt stark von der verwendeten Datenbank ab. 

Beispiel:
```
var input = "vom Benutzer";
con.query("SELECT * FROM table WHERE id=" + con.escape(input) + ";", 
    function (err, rows, fields) {
        ...
   }
);

```

## Zusammenfassung für OS-Injections

Das Einschleusen von OS-Befehlen kann effektiv verhindert werden, indem alle Funktionen, die das Ausführen von Code auf Betriebssystemebene ermöglichen, nicht verwendet werden. In fast allen Fällen gibt es alternative Möglichkeiten, mit denen eine Ausführung von Code auf Betriebssystemebene nicht mehr nötig ist. OWASP gibt eine Übersicht über gefährliche Funktionen verschiedener Programmiersprachen:

[https://www.owasp.org/index.php/Testing_for_Command_Injection_(OTG-INPVAL-013)#Code_Review_Dangerous_API](Gefährliche API's)

Weiterhin sollte der Webanwendung der Zugriff verwehrt werden, um Code überhaupt auf Betriebssystemebene ausführen zu können. Dafür müssen die Permissions der Webanwendung und ihrer Komponenten kontrolliert werden.

Sollte eine Verwendung der von OWASP genannten Funktionen unumgänglich sein, ist eine gute Methode, Eingaben nur über Whitelists entgegenzunehmen. Weitere Informationen dazu sind in der Sektion "Whitelist" zu finden. Eine Lösungsmöglichkeit für die Übung in der Vorlesung wäre zum Beispiel, wenn man als Eingabe der IP-Adresse nur Zahlen und Punkte erlauben würde.
