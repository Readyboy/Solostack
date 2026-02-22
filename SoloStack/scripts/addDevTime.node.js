import fs from 'fs';

let code = fs.readFileSync('./src/simulation/components.js', 'utf8');

const regex = /{ id: '[^']+'.*?cost: (\d+).*?(description: '[^']+)' \},/g;

code = code.replace(regex, (match, costStr, descStr) => {
    const cost = parseInt(costStr, 10);
    let devTime = 0.5;
    if (cost > 50000) devTime = 8.0;
    else if (cost >= 20000) devTime = 5.0;
    else if (cost >= 8000) devTime = 3.0;
    else if (cost >= 3000) devTime = 2.0;
    else if (cost >= 1000) devTime = 1.0;

    // insert devTime before description if not present
    if (!match.includes('devTime:')) {
        return match.replace(descStr, `devTime: ${devTime}, ${descStr}`);
    }
    return match;
});

fs.writeFileSync('./src/simulation/components.js', code);
console.log('Successfully injected devTime into components.js');
