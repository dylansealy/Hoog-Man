# Hoog-Man referenties
Dit document is ter ondersteuning van de inline comments. Hierin kun je een algemene uitleg vinden van een referentie.
## Afkortingen
* TS: TypeScript
* TSC: TypeScript compiler
## TypeScript referenties
Een referentie geformatteerd als "TS(n)" is een Hoog-Man referentie. Deze zijn in dit document te vinden. Een referentie geformatteerd als "ts(n)" is een TS referentie. Deze zijn te vinden in de TS docs.
1. TS(1): Zorgt ervoor dat de TSC geen "unnamed ts(2304)" error geeft. Hierdoor weet de TSC wat het object/methode is. Deze code is niet nodig voor het functioneren van het programma.
1. TS(2): Een interface definieert aan welke vorm een object of class minimaal moet voldoen, oftewel welke properties en methoden moet het minimaal hebben. In een interface definieer je de properties en methoden en de bijbehorende typen. Dit zorgt ervoor dat de TSC weet van welk datatype het moet zijn. De interface wordt geëxporteerd zodat deze overal in de code te gebruiken is.
1. TS(3): Dit koppelt een interface aan een property. Dit betekent dat de property dezelfde vorm heeft als de interface. De property wordt een directe of indirecte child van de interface.
1. TS(4): Het type geeft aan dat de property alleen gelijk mag zijn aan de gedefinieerde waarden. Het kan ook zijn dat het type een zelfgedefinieerde type is. Deze worden onderaan de code gedeifinieerd, maar werken hetzelfde. Ze zijn alleen wat makkelijker te hergebruiken.
1. TS(5): Een functie van het type void is klaar wanneer deze het einde bereikt. Er wordts niets gereturned of de return waarde is leeg.
1. TS(6): Deze properties horen bij elke child van de interface. Ze worden alleen niet gedefinieerd in de constructor van de bijbehorende class die gebruik maakt van deze interface, maar in de constructor van een directe of indirecte child van deze class. Dit komt doordat de waarden van deze properties uniek zijn voor elke child.
1. TS(7): Het uitbreiden (extends) van een object, class of interface houdt in dat het alles overneemt van de uitgebreide object, class of interface en deze uitbreidt met andere properties en methods die alleen bij childs van deze object, class of interface horen.
## HoogMan referenties
1. HG(1): Met een sketch zorg je ervoor dat je in de instance mode van p5 komt. Deze modus heeft voor deze game als belangrijkste voordeel dat de game gestart kan worden via een JavaScript functie in plaats van dat p5 automatisch start. Het argument p van de sketch functie is er om de functies en variabelen te koppelen aan p5.
1. HG(2): Een anonieme functie is een functie die niet wordt gekoppeld aan naam en dus ook niet aanroepbaar is. Deze wordt daardoor meteen uitgevoerd na het delcareren. In dit project worden anonieme functies gebruikt om te laten zien dat regels code bij elkaar horen.
