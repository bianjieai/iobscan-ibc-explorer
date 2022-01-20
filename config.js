let fs = require('fs');
let program = require('commander');

function list (val) {
    return val.split(',')
}
program.option("-p, <items>","config list" ,list).parse(process.argv);

replaceEnv([
        "./config/config.json",
    ],
    {
        "umeng_id": program.P[0],
        "umeng_web_id": program.P[1],
        "date_picker_start_time": program.P[2],
        "irishub_iobcan_link": program.P[3],
        "cosmoshub_iobcan_link": program.P[4],
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
