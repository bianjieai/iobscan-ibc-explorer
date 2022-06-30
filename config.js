let fs = require('fs');

let arguments = process.argv.splice(2);
let programs = (arguments[0] || '').split(',');
console.log('programs:',programs);

replaceEnv([
        "./.env.production",
    ],
    {
        "umeng_id": programs[0] ,
        "umeng_web_id": programs[1],
    }
);


function replaceEnv(files, params) {
    files.forEach(function(file,index){
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = "\\${"+key+"}";
            result = result.replace(new RegExp(r,"g"), params[key]);
        }
        fs.writeFileSync(file, result)
    });
}