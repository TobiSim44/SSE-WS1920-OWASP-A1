Dies ist eine Übungsaufgabe für den SSE Kurs im Wintersemester 2019/20 an der Hochschule Mannheim. 

# Injection
Die OS-Injections sind ganz ähnlich zu den SQL-Injections, nur das es hierbei um Betriebssystembefehle geht. Der Angreifer versucht seine eigenen Befehle an ordnungsgemäße Nutzereingabe anzuhängen, um so Schadcode auszuführen. Mit diesem Schadcode kann er Informationen über das System erlangen und hat sämtliche Rechte, die auch der Server besitzt!

Beispiel:
```
ipToPing = getRequestString("ip");
cmdOS = "ping -c 4 " + ipToPing;
```

In diesem Beispiel soll eine IP-Adresse angepingt werden. Dabei wird  die IP, die der Nutzer eingeben hat, direkt mit dem ping-Befehl konkateniert. Wenn die Eingabe des Nutzers aber nicht ausschließlich eine IP-Adresse enthält, sondern auch noch einen weiteren Befehl, so wird dieser ebenfalls ausgeführt.

Nutzereingabe:
```
ipToPing: 127.0.0.1 & ls
```

Der übermittelte Befehl sieht nun wie folgt aus:
```
ping -c 4 127.0.0.1 & ls
```

Nun wird der ping-Befehl ausgeführt und durch das "&" danach auch noch der ls-Befehl. Durch diese Sicherheitslücke würden alle Dateien der Aufsührungsumgebung des Servers mit ausgeben werden.

Schwachstellen zum Ausnutzen von OS-Injections treten typischerweise auf, wenn Benutzereingaben ungeprüft (oder schlecht geprüft) in einem Betriebssystembefehl verwendet werden. 

# Setup vollständig mit docker
Wenn ihr sowohl die SQL-Injection als auch die OS-Injeciton üben wollt,
so wechselt in in das Verzeichnis SSE-WS1920-OWASP-A1 und und lest euch bitte
die readme.md dort durch.

# Setup OS-Injeciton mit docker
--- Voraussetzung ---
eine Lauffähige Docker installation

Wenn ihr nur die OS-Injeciton noch einmal üben wollt, so wechselt einfach in das 
Verzeichnis OS-Injection und führt den Befehl: 

docker build -t os-injection .

Dann könnt ihr den Container auch schon starten mit

docker run -p 3001:3000 --name os-inj os-injection

Erreichen solltet ihr den Server nun unter:

localhost:3001
  
  
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

https://www.owasp.org/index.php/Testing_for_Command_Injection_(OTG-INPVAL-013)#Code_Review_Dangerous_API

Weiterhin sollte der Webanwendung der Zugriff verwehrt werden, um Code überhaupt auf Betriebssystemebene ausführen zu können. Dafür müssen die Permissions der Webanwendung und ihrer Komponenten kontrolliert werden.

Sollte eine Verwendung der von OWASP genannten Funktionen unumgänglich sein, ist eine gute Methode, Eingaben nur über Whitelists entgegenzunehmen. Weitere Informationen dazu sind in der Sektion "Whitelist" zu finden. Eine Lösungsmöglichkeit für die Übung in der Vorlesung wäre zum Beispiel, wenn man als Eingabe der IP-Adresse nur Zahlen und Punkte erlauben würde.
