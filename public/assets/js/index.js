// Creëert constanten van HTML elementen.
const footer = document.querySelector("footer");
const social = document.querySelector("#social");
// Zorgt ervoor dat de gebruiker wordt doorgestuurd naar de nieuwe website wanneer op het element wordt geklikt.
social.addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken");
// Functie voor het correcte copyright jaar.
const footerText = () => {
    let year = new Date;
    year = year.getFullYear();
    footer.innerText = `© ${year} Nynke van der Eems, Martijn Huls, Jitse Ritskes, Dylan Sealy, Alida Terwisscha van Scheltinga, Jelte Venema`;
}
// p5 setup functie
function setup() {
    createCanvas(400, 400);
}
// p5 draw functie
function draw() {
    background(1);
}

footerText();