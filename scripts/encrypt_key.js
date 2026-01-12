
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT = 'B2B_SAAS_2026_SECURE';
const keyToEncrypt = process.argv[2];

if (!keyToEncrypt) {
  console.log('Usage: node scripts/encrypt_key.js <YOUR_API_KEY>');
  console.log('Error: No key provided.');
  process.exit(1);
}

function encrypt(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return Buffer.from(result).toString('base64');
}

const encrypted = encrypt(keyToEncrypt);
console.log('ENCRYPTED KEY GENERATED_SUCCESSFULLY');
console.log('------------------------------------------------');
console.log(encrypted);
console.log('------------------------------------------------');
console.log('Please copy the string above and paste it into your .env file as VITE_GEMINI_API_KEY_ENCRYPTED');

try {
    fs.writeFileSync(path.join(__dirname, '../key_gen.txt'), encrypted);
    console.log('Also saved to key_gen.txt');
} catch (e) {
    console.log('Could not write to file, please use console output.');
}

