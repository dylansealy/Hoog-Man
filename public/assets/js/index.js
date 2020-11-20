// Creëert constante van HTML element.
const social = document.querySelector("#social");
// Functie voor het correcte copyright jaar.
const footerText = () => {
    const footer = document.querySelector("footer");
    let year = new Date;
    year = year.getFullYear();
    footer.innerText = `© ${year} HOOG-MAN`;
}
// Functie voor het bepalen van de dimensies van het main element.
const getMainDimensions = () => {
    const main = document.querySelector("main");
    const height = main.offsetHeight;
    const width = main.offsetWidth;
    if (width > height) {return height;}
    else {return width;}
}
// Declareert benodigde variabelen voor de game.
// vars is een object. Binnen een object hebben je key/value pairs.
const vars = {}
const initializeVars = () => {
    // - 1 om ervoor te zorgen dat er geen scrollbars komen.
    vars.canvasDimension = getMainDimensions() - 1;
    // Startpunten van de buitenlijnen van het bord.
    vars.xOuter = vars.canvasDimension / 60;
    vars.yOuter = vars.xOuter;
    vars.xInner = vars.xOuter * 2;
    vars.yInner = vars.xInner;
    // Hoogtes en breedtes van het spelbord.
    vars.outerHeight = vars.canvasDimension - vars.yOuter * 6;
    vars.outerWidth = vars.canvasDimension - vars.xOuter * 2;
    vars.innerHeight = vars.canvasDimension - vars.yInner * 4;
    vars.innerWidth = vars.canvasDimension - vars.yInner * 2;
    // Dimensie eenheden van het spelbord.
    vars.heightUnit = vars.innerHeight / 14;
    vars.widthUnit = vars.innerWidth / 17;
}
// functie voor het tekenen van de buitenlijnen.
const outerLines = () => {
    // Eerste vorm altijd buitenste.
    push()
    strokeWeight(3);
    rect(vars.xOuter, vars.yOuter, vars.outerWidth, vars.outerHeight, 10);
    rect(vars.xInner, vars.yInner, vars.innerWidth, vars.innerHeight, 4);
    pop();
}
// Functie voor het tekenen van de buitenlijn doorgangen.
const outerLinesPassage = () => {
    push();
    stroke("black");
    strokeWeight(4);
    rect(vars.xInner + vars.widthUnit, vars.yOuter, vars.widthUnit, 0);
    rect(vars.xInner + vars.widthUnit, vars.yInner, vars.widthUnit, 0);
    rect(vars.xInner + vars.widthUnit, vars.yOuter + vars.outerHeight, vars.widthUnit, 0);
    rect(vars.xInner + vars.widthUnit, vars.yInner + vars.innerHeight, vars.widthUnit, 0);
    pop();
}
// Functie voor het tekenen van de gele bolletjes.
const candy = () => {
    push();
    stroke("yellow");
    fill("yellow");
    for (let i = 0; i < 14; i++) {
        circle(vars.xInner + vars.widthUnit * 0.5, vars.yInner + vars.heightUnit * (0.5 + i), vars.widthUnit * 0.25);
        for (let j = 0; j < 17; j++) {
            circle(vars.xInner + vars.widthUnit * (0.5 + j), vars.yInner + vars.heightUnit * (0.5 + i), vars.widthUnit * 0.25);
        }
    }
    pop();
}
// Functie voor het tekenen van alle barrières.
const obstacles = () => {
    push();
    fill("black");
    // Voor de volgorde zie bij maps 1.jpg.
    // 1
    rect(vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 2
    rect(vars.xInner + vars.widthUnit * 4, vars.yInner, vars.widthUnit, vars.heightUnit * 4, 4);
    // 3
    rect(vars.xInner + vars.widthUnit * 6, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 4
    rect(vars.xInner + vars.widthUnit * 9, vars.yInner, vars.widthUnit, vars.heightUnit * 3, 4);
    // 5
    rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit, vars.widthUnit * 2, vars.heightUnit * 2, 4);
    // 6
    rect(vars.xInner + vars.widthUnit * 14, vars.yInner, vars.widthUnit * 3, vars.heightUnit * 2, 4);
    // 7
    rect(vars.xInner, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit * 3, 4);
    // 8
    rect(vars.xInner + vars.widthUnit * 2, vars.yInner + vars.heightUnit * 5, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 9
    rect(vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 5, vars.widthUnit * 2, vars.heightUnit, 4);
    // 10
    rect(vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit, 4);
    // 11
    rect(vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 4, vars.widthUnit, vars.heightUnit * 3, 4);
    // 12
    rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 5, vars.widthUnit, vars.heightUnit, 4);
    // 13
    rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 4, vars.widthUnit * 5, vars.heightUnit, 4);
    // 14
    rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 3, vars.widthUnit * 2, vars.heightUnit, 4);
    // 15
    rect(vars.xInner + vars.widthUnit * 5, vars.yInner + vars.heightUnit * 7, vars.widthUnit, vars.heightUnit, 4);
    // 16
    rect(vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 7, vars.widthUnit, vars.heightUnit * 3, 4);
    // 17
    rect(vars.xInner + vars.widthUnit * 9, vars.yInner + vars.heightUnit * 8, vars.widthUnit, vars.heightUnit * 2, 4);
    // 18
    rect(vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 9, vars.widthUnit, vars.heightUnit * 2, 4);
    // 19
    rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 7, vars.widthUnit * 3, vars.heightUnit, 4);
    // 20
    rect(vars.xInner + vars.widthUnit * 13, vars.yInner + vars.heightUnit * 6, vars.widthUnit, vars.heightUnit, 4);
    // 21
    rect(vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 6, vars.widthUnit, vars.heightUnit * 2, 4);
    // 22
    rect(vars.xInner + vars.widthUnit, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 2, vars.heightUnit * 4, 4);
    // 23
    rect(vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 2, vars.heightUnit * 3, 4);
    // 24
    rect(vars.xInner + vars.widthUnit * 7, vars.yInner + vars.heightUnit * 11, vars.widthUnit * 2, vars.heightUnit, 4);
    // 25
    rect(vars.xInner + vars.widthUnit * 8, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit, 4);
    // 26
    rect(vars.xInner + vars.widthUnit * 12, vars.yInner + vars.heightUnit * 9, vars.widthUnit, vars.heightUnit * 3, 4);
    // 27
    rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 9, vars.widthUnit * 3, vars.heightUnit, 4);
    // 28
    rect(vars.xInner + vars.widthUnit * 4, vars.yInner + vars.heightUnit * 13, vars.widthUnit * 3, vars.heightUnit, 4);
    // 29
    rect(vars.xInner + vars.widthUnit * 10, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit * 2, 4);
    // 30
    rect(vars.xInner + vars.widthUnit * 11, vars.yInner + vars.heightUnit * 13, vars.widthUnit * 3, vars.heightUnit, 4);
    // 31
    rect(vars.xInner + vars.widthUnit * 14, vars.yInner + vars.heightUnit * 11, vars.widthUnit * 2, vars.heightUnit, 4);
    // 32
    rect(vars.xInner + vars.widthUnit * 15, vars.yInner + vars.heightUnit * 12, vars.widthUnit, vars.heightUnit, 4);
    pop();
}
// p5 preload functie
function preload() {
    initializeVars();
    loadFont("assets/fonts/Roboto-Light.ttf");
    loadSound();
}
// p5 setup functie
function setup() {
    canvas = createCanvas(vars.canvasDimension, vars.canvasDimension);
    colorMode(RGB, 255);
    frameRate(60);
    textFont("Roboto");
    textSize(20);
    background("black");
}
// p5 draw functie
function draw() {
    noFill();
    strokeWeight(2)
    stroke("#2121DE");
    outerLines();
    outerLinesPassage();
    candy();
    obstacles();
}
// Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de client.
// Doorsturen naar GitHub
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Pagina herladen nadat de dimensie is veranderd.
window.addEventListener("resize", () => location.reload());

footerText();