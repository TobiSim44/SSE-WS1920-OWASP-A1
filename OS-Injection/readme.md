Dies ist eine Übungsaufgabe für den SSE Kurs im Wintersemester 2019/20 an der Hochschule Mannheim. 

# Injection
Bei der OS-Injection werden Betriebssystem befehle ausgeführt.
Dabei ist es das Ziel dem Server seine eigenen Befehle "Unterzujubeln"

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
