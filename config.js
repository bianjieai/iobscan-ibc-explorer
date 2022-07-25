let fs = require('fs');

console.log('process.argv:', process.argv);
let arguments = process.argv.splice(2);
let programs = (arguments[0] || '').split(',');
console.log('programs:', programs);

replaceEnv(['./.env.development', './.env.production'], {
    umeng_id: programs[0],
    umeng_web_id: programs[1]
});

function replaceEnv(files, params) {
    files.forEach(function (file) {
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = '\\${' + key + '}';
            result = result.replace(new RegExp(r, 'g'), params[key]);
        }
        fs.writeFileSync(file, result);
    });
}
