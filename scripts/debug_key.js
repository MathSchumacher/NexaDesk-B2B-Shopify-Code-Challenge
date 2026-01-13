
const SALT = 'B2B_SAAS_2026_SECURE';
const encrypted = 'dQF6bWRyd2VyVAcEUnJncSdkf31zAXRyMiAlYzoKAQtTbWRyeTMq';

function decrypt(encryptedText) {
    // Node.js equivalent of browser atob() is Buffer.from(str, 'base64').toString('binary')
    const text = Buffer.from(encryptedText, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return result;
}

const decrypted = decrypt(encrypted);
console.log('Decrypted:', decrypted);
console.log('Valid format?', /^[a-f0-9\-]+:fx$/.test(decrypted) ? 'YES' : 'NO');
