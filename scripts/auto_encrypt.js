
const fs = require('fs');
const path = require('path');

const SALT = 'B2B_SAAS_2026_SECURE';
const KEY = 'AIzaSyCphDo7YiX3uU6h3BJtTsoI19j2v017rF0';
const ENV_PATH = path.join(__dirname, '../.env');

function encrypt(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return Buffer.from(result).toString('base64');
}

const encrypted = encrypt(KEY);
console.log('Encrypted Key:', encrypted);

if (fs.existsSync(ENV_PATH)) {
    let content = fs.readFileSync(ENV_PATH, 'utf8');
    if (content.includes('PASTE_YOUR_ENCRYPTED_KEY_HERE')) {
        content = content.replace('PASTE_YOUR_ENCRYPTED_KEY_HERE', encrypted);
        fs.writeFileSync(ENV_PATH, content);
        console.log('.env updated successfully.');
    } else {
        console.log('Placeholder not found in .env');
    }
} else {
    console.log('.env file not found at:', ENV_PATH);
}
