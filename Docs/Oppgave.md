# Prosjektoppgave for Webapplikasjoner i .NET Del 1.

## Oppgave

Det skal implementeres en nettbank.

## Grupper

Oppgaven skal løses i grupper med maks 5 studenter i hver gruppe.

## Mål

* Lage en komplett løsning med mulighet for å foreta bankgjøremål på nett.
* Løsningen skal lages i .NET MVC.
* Sikre enkelte sider med innloggingsfunksjon
* Vise forståelse for MVC arkitekturen og Entity Framework.

## Funksjonalitet:

Løsningen bør blant annet inneholde:

* Applikasjonen skal ha en forside som i en vanlig nettbank
* Applikasjonen skal kreve autentisering via egendefinert sikkerhetsløsning for å komme inn på din bank.
* Pålogging med personnummer, bankId (dummy) og eget passord
* Etter innlogging skal det vises oversikter over saldo på de ulike konti du har.
* Det skal være mulig å registrere betalinger frem i tid og det skal være mulig å vise en oversiktover disse. Det skal videre være mulig å endre og slette disse betalingene.
* Det skal også ha funksjonalitet for å vise utførte banktransaksjoner, altså utførte betalinger, evt.Via en kontoutskrift.

### Ting til Oppgave 2

* Det er ikke nødvendig å lage funksjonalitet for å utføre betalingene. Dette er funksjonalitet somskal lages i oppgave 2.
* Videre er det heller ikke nødvendig å lage «backend» funksjonalitet for å kunne opprette kunderog konti. Det vil også være en del av oppgave 2.

## Ved evaluering av oppgaven vil det bla. bli vektlagt:

* Design / layout
* Funksjonalitet
* Struktur på kode
* Databasestruktur bruk av Entity Framework code forst
* Validering
* Ryddig og forståelig kode (CSHTML og c#)
* dynamisk henting/oppdatering av data via AJAX og Javascript (JQuery)