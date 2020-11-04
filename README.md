# Praktische opdracht 2D games maken
Een README bestand is normaal gesproken bedoeld om mensen te informeren over de repository en het project. Zie [hier](https://github.com/DylanSealy/Ganzenbord/blob/master/README.md) een voorbeeld. In eerste instantie gaan wij dit README bestand daar niet voor gebruiken. Wij gaan eerst dit bestand gebruiken als handleiding over Git en GitHub en in dit bestand kun je enkele adviezen vinden over hoe om te gaan met Git, GitHub en het samenwerken met anderen.

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
4. Plaats jouw id_ed25519 bestand in "C:\Users\dylan\\.ssh". Verander de bestandsnaam niet!
5. Creëer ergens een lokale map op je computer. Dus niet in OneDrive!
6. Open deze map in VSC.
7. Ga in VSC naar de terminal door linksonder te klikken.
8. Voer de onderstaande regels code uit in PowerShell of Opdrachtprompt.
<br>\* GitHub heeft een privacy vriendelijke email die je kunt gebruiken. Check hiervoor je [e-mail instellingen](https://github.com/settings/emails) in GitHub.

        git config --global user.name "John Doe" (Naam)
        git config --global user.email test@github.com (Email)
        git init
        git remote add origin git@github.com:DylanSealy/PO-2D-games-maken.git


### Gitpod
1. Ga naar de volgende [link](https://gitpod.io/#https://github.com/DylanSealy/PO-2D-games-maken).
2. Log in met je GitHub account.
3. Volg alle verdere stappen op.

## Samenwerken via Git
Git en GitHub zijn hele handige tools. Je moet echter wel weten hoe Git werkt en hoe je kunt samenwerken via Git. Hieronder een overzicht van alles wat je moet weten.

### Git commando's
Hieronder een overzicht van alle belangrijke Git commando's. Andere commando's zul je waarschijnlijk niet nodig hebben.
* git help: Laat een overzicht zien van alle commando's.
* git status: Geeft de status in jouw situatie en huidige branch.
* git add . : Voegt alle bestanden in de huidige en onderliggende mappen toe om gecommit te worden.
* git switch (argument): Verandert jouw huidige branch of bij welke commit je bent.
* git fetch: Downloadt alle nieuwe commits van de server.
* git pull: Voegt de gedownloade commits samen met jouw veranderingen, ongeacht of ze gecommit zijn.
* git push: Uploadt alle nieuwe commits naar de server.
* git commit: Slaat alle veranderingen op.
* git log: Laat een overzicht zien van alle commits in jouw huidige branch.
* git reset --hard: Verwijderd al jouw veranderingen die nog niet gecommit zijn. Let op nieuwe bestanden worden niet verwijderd!