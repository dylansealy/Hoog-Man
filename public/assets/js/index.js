// Creëert constante van HTML element.
const social = document.querySelector("#social");
// Functie voor het correcte copyright jaar.
const footerText = () => {
    const footer = document.querySelector("footer");
    let year = new Date;
    year = year.getFullYear();
    footer.innerText = `© ${year} HOOG-MAN`;
}
// Functie voor het bepalen van de dimensies van het main element
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
// p5 preload functie
function preload() {
    initializeVars();
    loadFont("assets/fonts/Roboto-Light.ttf");
}
// p5 setup functie
function setup() {
    canvas = createCanvas(vars.canvasDimension, vars.canvasDimension);
    colorMode(RGB, 255);
    noStroke();
    frameRate(60);
    textFont("Roboto");
    textSize(20);
    background("black");
}
// p5 draw functie
function draw() {
    noFill();
    stroke("#2121DE");
    strokeWeight(3);
    // Eerste vorm altijd buitenste.
    rect(vars.xOuter, vars.yOuter, vars.outerWidth, vars.outerHeight, 10);
    rect(vars.xInner, vars.yInner, vars.innerWidth, vars.innerHeight, 4);
    stroke("black");
    strokeWeight(4);
    rect(vars.xOuter + vars.widthUnit, vars.yOuter, vars.widthUnit, 0);
    rect(vars.xOuter + vars.widthUnit, vars.yInner, vars.widthUnit, 0);
    rect(vars.xOuter + vars.widthUnit, vars.yOuter + vars.outerHeight, vars.widthUnit, 0);
    rect(vars.xOuter + vars.widthUnit, vars.yInner + vars.innerHeight, vars.widthUnit, 0);
}
// Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de client.
// Doorsturen naar GitHub
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Pagina herladen nadat de dimensie is veranderd.
window.addEventListener("resize", () => location.reload());

footerText();