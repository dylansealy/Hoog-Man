# Praktische opdracht 2D games maken
Een README-bestand is normaal gesproken bedoeld om mensen te informeren over de repository en het project. Zie [hier](https://github.com/DylanSealy/Ganzenbord/blob/master/README.md) voor een voorbeeld. In eerste instantie gaan wij dit README-bestand daar niet voor gebruiken. Wij gaan eerst dit bestand gebruiken als handleiding over Git en GitHub en in dit bestand kun je enkele adviezen vinden over hoe om te gaan met Git, GitHub en het samenwerken met anderen.

## Inhoud
* [Installatie en set-up](#Installatie-en-set-up)
    * [Git met VSC](#Git-met-VSC)
    * [Gitpod](#Gitpod)
* [Samenwerken via Git](#Samenwerken-via-git)
    * [Git commando's](#Git-commandos)
    * [Werken met branches](#Werken-met-branches)
        * [Master branch](#master)
        * [Ontwikkeling branch](#ontwikkeling)
        * [Opruim branch](#opruiming)
* [Git en codeer adviezen en fouten](#Git-en-codeer-adviezen-en-fouten)
    * [Git](#Git)
    * [JavaScript](#JavaScript)
* [Handige links en bronnen](#Handige-links-en-bronnen)
* [Bekende problemen](#Bekende-problemen)

## Installatie en set-up
Ik raad zeer sterk aan om thuis gebruik te maken van [Git met Visual Studio Code](#Git-met-VSC) (VSC) en op school van [Gitpod](#Gitpod).

### Git met VSC
1. Download [VSC](https://code.visualstudio.com/) en [Git](https://git-scm.com/downloads).
2. Installeer VSC. De instellingen van het installatieprogramma kun je naar wens aanpassen.
3. Installeer Git met respectievelijk de onderstaande instellingen. De rest kun je naar wens aanpassen.
    * Git LFS aan
    * Associate .git files uit
    * Associate .sh files uit
    * Use a TrueType font uit
    * Stel VSC in als standaard editor
    * Let Git decide
    * Git from command line
    * Use OpenSSL
    * Checkout Windows-style
    * Use Windows' default console
    * Default
    * None
4. Plaats jouw id_ed25519 bestand in jouw vergelijkbare "C:\Users\dylan\\.ssh" pad. Verander de bestandsnaam niet!
5. Creëer ergens een lokale map op je computer. Doe dit niet in OneDrive!
6. Open deze map in VSC.
7. Ga in VSC naar de terminal door linksonder te klikken.
8. Voer de onderstaande regels code uit in PowerShell of Opdrachtprompt.
<br>\* GitHub heeft een privacy vriendelijke email die je kunt gebruiken. Check hiervoor je [e-mailinstellingen](https://github.com/settings/emails) in GitHub.

        git config --global user.name "John Doe" (Naam)
        git config --global user.email test@github.com (Email)
        git init
        git remote add origin git@github.com:DylanSealy/PO-2D-games-maken.git

9. [Fetch](#Git-commandos) alles van de server en Git is klaar voor gebruik.

### Gitpod
1. Ga naar de volgende [link](https://gitpod.io/#https://github.com/DylanSealy/PO-2D-games-maken).
2. Log in met je GitHub account.
3. Volg alle verdere stappen op.

## Samenwerken via Git
Git en GitHub zijn hele handige tools. Je moet echter wel weten hoe Git werkt en hoe je kunt samenwerken via Git en GitHub. Hieronder een overzicht van alles wat je moet weten.

### Git commando's
Hieronder een overzicht van alle belangrijke Git commando's. Andere commando's zul je waarschijnlijk niet nodig hebben.
* git help: Laat een overzicht zien van alle commando's.
* git status: Geeft de status in jouw huidige situatie en branch.
* git log: Laat een overzicht zien van alle commits in jouw huidige branch.
* git switch (branch): Verandert jouw huidige branch. Let op, de naam van de branch is hoofdlettergevoelig! 
* git fetch: Downloadt alle nieuwe commits van de server.
* git pull: Voegt de gedownloade commits samen met jouw veranderingen, ongeacht of ze gecommit zijn.
* git add . : Voegt alle bestanden in de huidige en onderliggende mappen toe om gecommit te worden.
* git commit: Slaat alle veranderingen op.
* git push: Uploadt alle nieuwe commits naar de server.
* git reset --hard: Verwijdert al jouw veranderingen die nog niet gecommit zijn. Let op, nieuwe bestanden worden niet verwijderd!

### Werken met branches
In Git kun je werken met verschillende branches. Dit is handige om code overzichtelijker te maken. Mijn idee is om met de 3 onderstaande branches te gaan werken. Het is soms lastig om te bepalen in welke branch je moet zitten. Daarom zijn het ook richtlijnen. Bij eventuele twijfel ga naar de opruim branch.

#### master
Dit is de hoofdbranch. Hierin komt de code waarvan we zeker weten dat het werkt. Je moet dit zien als de branch voor de stabiele versie van het project. De code uit deze branch wordt dus gebruikt voor het programma die de eindgebruiker gaat gebruiken. Je zult daarom eigenlijk nooit in deze branch werken.

#### ontwikkeling
Dit is de branch waarin wordt gewerkt aan nieuwe functies. Het is belangrijk dat je code commit die werkt, maar in deze branch heb je daarin meer vrijheid. Je zult daarom het meeste van de tijd in deze branch werken.

#### opruiming
Dit is de branch waarin er fouten in de code worden verbeterd en waarin de code wordt aangepast om het netter te maken. Dus als er een fout in de code zit die je gecommit hebt dan moet je dat in deze branch aanpassen. Daarnaast zullen dus de andere branches vanuit deze branch geüpdatet worden met verbeterde code.

## Git en codeer adviezen en fouten
Hieronder kun je adviezen vinden en oplossingen vinden voor fouten in Git of in je code.

### Git
1. In VSC kun je je wijzigingen bijhouden die nog niet gecommit zijn. Een M betekent dat het bestand is aangepast en een U betekent dat het bestand nog niet wordt gevolgd door Git. Je moet hiervoor het git add commando gebruiken. Zie [Git commando's](#Git-commandos). Een gele/groene kleur naast een regelnummer geeft aan dat het een nieuwe regel is. Een blauwe kleur geeft aan dat de regel is aangepast en een klein rood driehoekje geeft aan dat er een regel is verwijderd. Let op, het draait hier om de inhoud van de regel en niet om het regelnummer. Dus als alleen het regelnummer verandert en de inhoud van de regel niet dan is dat geen verandering.
2. Als er iets misgaat in Git dan kun je de inhoud van de map waarin je het project hebt opgeslagen verwijderen, inclusief de map .git. Met de commando's bij [Git met VSC](#Git-met-VSC) kun je dan Git weer instellen. Je gaat dan naar de situatie van de laatst gepubliceerde commit. Let op, alles wat nog niet gecommit en gepubliceerd is, gaat verloren. Dus commit dat en push dat naar de server of sla dit tijdelijk op in een andere locatie.
3. Je kan in een situatie terechtkomen waarin meerdere mensen werken aan dezelfde code. Wanneer je dan een commit fetched en pulled van de server dan krijg je te maken met een merge conflict. Dit conflict moet zo snel mogelijk worden opgelost. Ga in VSC naar het bestand of de bestanden waar een C bij staat. VSC laat dan op de plaats waar het conflict is zien wat de huidige code is en wat de inkomende veranderingen zijn. Bepaal zelf welke verandering er behouden moet worden of overleg dit met degene die dat stukje code heeft geschreven. Na het oplossen van een merge conflict moet je deze meteen committen. Vaak is het commit bericht al ingevuld. Deze hoef je niet te veranderen, want er staat dan al iets in over een merge. Als dit echter er niet staat, benoem dan een merge conflict met de commit id in het commit bericht.
4. Om het probleem in het bovenstaande punt te minimaliseren raad ik sterk aan om altijd als eerste te fetchen en dan te pullen, voordat je gaat coderen. Je beperkt dan de impact en daarmee de fouten die een merge conflict kan veroorzaken door jouw code up-to-date te houden met de server.
5. Ik raad je aan om altijd code te committen en te pushen wanneer je die geschreven hebt. Ongeacht of dit stukje code doet wat je wilt. Zet dit dan in je commit bericht of maak een [issue](#Bekende-problemen). Dat hangt van de situatie af. Maar houd dus altijd code up to date voor jezelf en anderen. Dus wanneer je 's avonds een stukje gecodeerd hebt, maar dit nog niet klaar is, commit dit dan gewoon. Houd de code niet op je computer.
6. Een commit bericht is nog niet zo makkelijk om op te stellen, daarom heb ik enkele regels die je kunnen helpen. Zie [hier](https://github.com/DylanSealy/Ganzenbord/commits/master) en [hier](https://github.com/pi-hole/pi-hole/commits/master) voor respectievelijk redelijke en goede voorbeelden van commit berichten.
    1. Houd een commit bericht kort. Je moet het zien als een titel waaraan anderen kunnen zien wat je hebt gedaan.
    2. Gebruik duidelijke taal in je commit bericht en refereer altijd naar een andere commit als die wat te maken heeft met deze verandering. Hierbij kun je denken aan een fout die je hebt opgelost die nadrukkelijk is veroorzaakt of ingevoerd in een andere commit.
    3. Probeer niet te veel code te committen in één keer. Hierdoor kun je minder makkelijk aangeven in het commit bericht wat je hebt gedaan. Dus houd de commit klein en zorg ervoor dat je dingen commit die met elkaar te maken hebben.
7. Tijdens het coderen is het handig om GitHub erbij te hebben. In GitHub kun je namelijk veel dingen snel opzoeken zoals: [issues](#Bekende-problemen), commit id's en veranderingen die gemaakt zijn. Git log en de timeline drawer in VSC kun je hier ook voor gebruiken. Dat hangt van jouw voorkeur af. Voor [issues](#Bekende-problemen) moet je wel bij GitHub zijn.

### JavaScript
Jullie hebben genoeg ervaring met JavaScript. Toch zijn hier enkele adviezen:
1. Voor het declareren van variabelen gebruik let en const in plaats van var. Het verschil tussen let en const houdt in dat de waarde van een const variabele constant is en die van een let variabele niet. Bij voorkeur gebruik const. Hiermee zorg je er namelijk voor dat de waarde van een variabele niet wordt veranderd door een ander stukje code. Daarnaast is er met let en const nog een verandering in de scope. Zie [hier](https://www.w3schools.com/js/js_let.asp) voor een uitleg daarvan.
2. Voor het naamgeven van variabelen en functies gebruik Camel case. Dit houdt in dat elk nieuw woord begint met een hoofdletter, zoals aantalBommen en xHoogte.
3. Zet een ; neer. In JavaScript is het niet vereist om een ; neer te zetten alleen het maakt je code overzichtelijker en makkelijker te lezen.
4. In JavaScript wordt een punt gebruikt om een decimaal getal aan te geven en een , om dingen van elkaar te onderscheiden. Dus 0.5 en functie test(argument1, argument2).

# Handige links en bronnen
In het bestand [Bronnen.md](/Bronnen.md) kun je handige links en gebruikte bronnen terug vinden. Vul deze aan met alle bronnen die je gebruikt hebt!

# Bekende problemen
GitHub heeft een functie waarbij je bekende problemen in de code kunt aangeven. Dit is de [issues sectie](https://github.com/DylanSealy/PO-2D-games-maken/issues) in GitHub. Ik ben van plan om dit ook te gaan gebruiken, want hiermee kun je gemakkelijk bijhouden welke problemen er zijn en welke er zijn opgelost. Daarnaast kun je het oplossen van issues aan mensen toekennen. Dus als je een bekend probleem hebt in je code, maak hier dan een issue van.