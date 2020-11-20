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
    stroke("#2121DE");
    strokeWeight(3);
}
// p5 draw functie
function draw() {
    rect(5, 5, canvas.height - 10, canvas.width - 40, 10);
    rect(10, 10, canvas.height - 20, canvas.width - 50, 6.5);
}
// Eventlisteners zorgen ervoor dat er iets gebeurd na een actie van de client.
// Doorsturen naar GitHub
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Pagina herladen nadat de dimensie is veranderd.
window.addEventListener("resize", () => location.reload());

footerText();