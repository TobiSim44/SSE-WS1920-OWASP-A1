Dies ist eine Übungsaufgabe für den SSE Kurs im Wintersemester 2019/20 an der Hochschule Mannheim. 

# Starten der Programme
Dieses System kann nur mit Docker gestartet werden. Mit dem Befehl ``docker-compose up`` werden die Images gebaut und die Container gestatet.

Die Seiten laufen dann unter der IP ``docker-machine ip``

Die SQL-Injections unter Port 3000.

Die OS-Injections unter Port 3001.

## Mögliche Fehlerbehebungen

SQL-Injections stürtzt immer wieder ab; "The server closed the connection."

In dem Fall einfach den SQL-Injections Container löschen und erneut ``docker-comnpose up`` ausführen.

