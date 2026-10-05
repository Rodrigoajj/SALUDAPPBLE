const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

const files = [
    'icon.png',
    'splash.png',
    'adaptive-icon.png',
    'favicon.png'
];

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

files.forEach(file => {
    fs.writeFileSync(path.join(assetsDir, file), buffer);
    console.log(`Created ${file}`);
});
