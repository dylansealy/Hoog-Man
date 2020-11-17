const core = require("@actions/core");
const glob = require("@actions/glob");
const fs = require("fs");
const changeBaseHref = async () => {
    try {
        const pattern = "**/*.html";
        const globber = await glob.create(pattern);
        const files = await globber.glob();
        if (files == "") {core.setFailed("No files found!");}
        else {
            console.log(files.length + " files found.");
            for (let i = 0; i < files.length; i++) {
                const originalBaseHref = fs.readFileSync(files[i], "utf-8");
                const updatedBaseHref = originalBaseHref.replace(/<base ([^>]*href=["'])([^'"]*)(["'][^>]*)>/, "<base href=\"https://dylansealy.github.io/PO-2D-games-maken/public/\">");
                if (originalBaseHref != updatedBaseHref) {
                    fs.writeFileSync(files[i], updatedBaseHref);
                    console.log(`${files[i]} changed.`);
                }
                else {console.warn(`No base href found in ${files[i]} or base didn't change!`);}
            }
        }
    } catch (error) {core.setFailed(error);}
}
changeBaseHref();