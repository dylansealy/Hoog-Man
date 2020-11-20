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
    // Hoogtes en breedtes van het spelbord.
    vars.outerHeight = vars.canvasDimension - 40;
    vars.outerWidth = vars.canvasDimension - 10;
    vars.innerHeight = vars.canvasDimension - 50;
    vars.innerWidth = vars.canvasDimension - 20;
    // Dimensie eenheden van het spelbord.
    vars.heightUnit = vars.innerHeight / 14;
    vars.widthUnit = vars.innerWidth / 17;
    // Startpunten van de buitenlijnen van het bord.
    vars.xOuter = 5;
    vars.yOuter = 5;
    vars.xInner = 10;
    vars.yInner = 10;
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
    noFill();
    strokeWeight(3);
}
// p5 draw functie
function draw() {
    stroke("#2121DE");
    // Eerste vorm altijd buitenste.
    rect(vars.xOuter, vars.yOuter, canvas.width - 10, canvas.height - 40, 10);
    rect(vars.xInner, vars.yInner, canvas.width - 20, canvas.height - 50, 6.5);
    stroke("black");
    line(vars.widthUnit, vars.xOuter, vars.widthUnit * 2, vars.yOuter);
    line(vars.widthUnit, vars.xInner, vars.widthUnit * 2, vars.yInner);
    line(vars.widthUnit, vars.xOuter + vars.outerHeight, vars.widthUnit * 2, vars.yOuter + vars.outerHeight);
    line(vars.widthUnit, vars.xInner + vars.innerHeight, vars.widthUnit * 2, vars.yInner + vars.innerHeight);
}
// Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de client.
// Doorsturen naar GitHub
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Pagina herladen nadat de dimensie is veranderd.
window.addEventListener("resize", () => location.reload());

footerText();