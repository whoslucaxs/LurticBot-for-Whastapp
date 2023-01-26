
const fs = require('fs');

let dataFolder = './database/data/';
let files = [];

const RandomName = () => {

    fs.readdir(dataFolder, (err, fileNames) => {
        if (err) {
            console.log(err);
            return;
        }
        files = fileNames.map(fileName => fileName.replace('.png',''));
    
    });

    
    random = files[Math.floor(Math.random() * files.length)]

    return random;

}

module.exports = { RandomName }