const path = require('path');
const fs = require('fs-extra');
const simpleGit = require('simple-git');
const git = simpleGit();

/**
 * Environment-Variables:
 * TARGET=[dev|pub|dev+pub]                 // wohin soll kopiert werden?
 * WIDGET=1                                 // irgend ein "truthy" Wert oder ganz weglassen
 * FILENAME=[filename_without_extension]    // default: index (=> index.html); für Standard- oder Widget-Build
 */

const rxIntSrc = /(int[\\/])src/;
const isEmbed = !!process.env.EMBED;
const isAssets = !!process.env.SUBDIR;
const target = process.env.TARGET;
const inputFileName = (isEmbed? (process.env.INPUTFILE || "index.embed") : (process.env.INPUTFILE || "index")) + ".html";
const outputFileName = (process.env.FILENAME || "index") + ".html";
const dirProject_src = path.resolve(__dirname, "./..");

const dirProjectBuild = path.resolve(__dirname, "../dist/");
const dirProject_dev = dirProject_src.replace(rxIntSrc, '$1dev');
const dirProject_pub = dirProject_src.replace(rxIntSrc, '$1pub');


const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());

const copyDirectories = (sourceRoot, target) => {

    const subDirList = getDirectories(sourceRoot).filter(d => d !== "assets");

    // console.log("copy subdirs from", sourceRoot, subDirList, " >> to: ", target);
    subDirList.forEach(dirName => {
        const targetDir = path.resolve(__dirname, target + "/" + dirName);
        fs.emptyDir(targetDir);
        fs.copy(path.resolve(__dirname, sourceRoot + "/" + dirName), targetDir, err => {
            if (err) {
                return console.error(err);
            }
            console.log(`> add ${targetDir} to git`);
            git.add([targetDir]);
            // console.log('success!');
        });
    });


};

const copyAppMainFile = (fileName, isNewDir) => {

    console.log("mainFile: ", fileName);

    // const appMainFile = path.resolve(__dirname, dirProjectBuild + "/" + outputFileName);
    const appMainFile = path.resolve(__dirname, dirProjectBuild + "/" + inputFileName);


    fs.readFile(appMainFile, 'utf8', (err, htmlFile) => {
        if (err) {
            return console.log(err);
        }

        fs.writeFile(fileName, htmlFile, err => {

            // falls es die datei vor dem schreiben noch nicht gibt (oder nicht mehr) => git.add

            if (err) {
                console.error(err);
                return;
            }

            // if (isNewDir) {
                //console.log(`> add ${outputFileName} to git`);
                git.add([fileName]);
            // }

            //file written successfully
            console.log("Output: ", fileName);
        });
    });

};

const copyApp = () => {

    // console.log("do copy of", "..." + htmlFile.substr(218,55) + "...");

    const targetList = [];
    let i;

    // Noch eine fertige Extra-Ausgabe im src/Projekt-Verzeichnis?
    // targetList.push(path.resolve(__dirname, dirProjectBuild + "/../build"));

    if (target === "dev" || target === "dev+pub") {
        console.log(">> copy to dev", dirProject_dev);
        targetList.push(dirProject_dev);
    }
    if (target === "pub" || target === "dev+pub") {
        console.log(">> copy to pub", dirProject_pub);
        targetList.push(dirProject_pub);
    }

    i = targetList.length;
    while (i--) {

        const folderName = targetList[i];
        const fileName = path.resolve(__dirname, folderName + "/" + outputFileName);

        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName, {recursive: true});
            }
        } catch (err) {
            console.error(err);
        }

        const isNewDir = !fs.exists(fileName);

        copyAppMainFile(fileName, isNewDir);
        if (isAssets) {
            copyDirectories(dirProjectBuild, folderName);
        }

    }

    console.log(`App verteilt => ${target}:`);

};

console.log("Copy App to ", target);
// console.log(dirProject_src);
// console.log(dirProject_dev);
// console.log(dirProject_pub);
// console.log(dirProjectBuild);
console.log("* isEmbed?", isEmbed);
// console.log("* copy subdirectories?", isAssets);

copyApp();



