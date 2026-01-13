
import { decryptKey } from '../src/utils/security'; // This might not work in node unless compiled or simple file... 
// Actually security.ts is TS. I can't import TS in Node JS directly without ts-node.
// I'll inline the decryption logic since I know it's the same simple XOR.

const SALT = 'B2B_SAAS_2026_SECURE';
const ENCRYPTED_KEY = process.env.VITE_GEMINI_API_KEY_ENCRYPTED || 'A3s4PgA4AiM3dl8FbzYLdjYAZC1xcAgrBzIuGm4LWgBAb2JyMRNi'; // Hardcoded fallback for test if env missing

function decrypt(encryptedText) {
    if (!encryptedText) return '';
    try {
        const text = Buffer.from(encryptedText, 'base64').toString('binary');
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
        }
        return result;
    } catch (e) {
        console.error('Decryption failed', e);
        return '';
    }
}

const API_KEY = decrypt(ENCRYPTED_KEY);
const MODELS_TO_TEST = ['gemini-2.5-flash'];

async function testGemini() {
    console.log(`Testing Gemini API with Key: ${API_KEY.substring(0, 8)}...`);

    for (const model of MODELS_TO_TEST) {
        console.log(`--- Testing Model: ${model} ---`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }]
                })
            });

            if (!response.ok) {
                console.error(`FAILED (${model}): ${response.status} ${response.statusText}`);
                // console.error(await response.text());
            } else {
                const data = await response.json();
                console.log(`SUCCESS (${model})!`);
                // console.log('Response:', JSON.stringify(data, null, 2));
                return; // Stop after first success
            }
        } catch (e) {
            console.error(`Network Error (${model}):`, e.message);
        }
    }
}

testGemini();
