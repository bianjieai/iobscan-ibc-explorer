let fs = require('fs');

let arguments = process.argv.splice(2);
let programs = (arguments[0] || '').split(',');
console.log('programsprogramsprograms:',programs);

replaceEnv([
        "./config/config.json",
    ],
    {
        "umeng_id": programs[0] ,
        "umeng_web_id": programs[1],
        "date_picker_start_time": programs[2],
        "irishub_iobcan_link": programs[3] || 'https://irishub.iobscan.io/#/address/',
        "cosmoshub_iobcan_link": programs[4] || 'https://cosmoshub.iobscan.io/#/address/',
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
