

const SALT = 'B2B_SAAS_2026_SECURE';

function decrypt(encryptedText: string) {
  try {
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return result;
  } catch (e) {
    console.error('Failed to decrypt API key');
    return '';
  }
}

// Prefer encrypted key, fallback to plain for dev convenience/testing
const ENCRYPTED_KEY = import.meta.env.VITE_DEEPL_API_KEY_ENCRYPTED;
const PLAIN_KEY = import.meta.env.VITE_DEEPL_API_KEY;

const API_KEY = ENCRYPTED_KEY ? decrypt(ENCRYPTED_KEY) : PLAIN_KEY;

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export const translateText = async (
  text: string, 
  targetLang: string
): Promise<TranslationResult> => {
  if (!text) return { translatedText: '' };
  
  if (!API_KEY) {
    console.warn('DeepL API Key is missing. Check .env for VITE_DEEPL_API_KEY');
    return { translatedText: `[NO_KEY] ${text}` };
  }

  // DeepL Language Code Normalization
  // 'pt' should ensure 'PT-BR' for target, but generic 'PT' is fine for source
  let deepLTarget = targetLang.toUpperCase();
  if (deepLTarget === 'PT') deepLTarget = 'PT-PT'; // Default to PT-PT if just 'PT' or let api decide? 
  // actually DeepL supports PT-BR and PT-PT. Let's force PT-BR if intent is Portuguese
  if (deepLTarget === 'PT' || deepLTarget === 'PT-PT') deepLTarget = 'PT-BR';
  if (deepLTarget === 'EN') deepLTarget = 'EN-US';

  try {
    const params = new URLSearchParams();
    params.append('auth_key', API_KEY);
    params.append('text', text);
    params.append('target_lang', deepLTarget);

    const response = await fetch('/api/deepl/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const data = await response.json();

    if (!response.ok) {
       console.error('DeepL API Error:', data);
       throw new Error(data.message || 'DeepL Translation Failed');
    }

    if (data.translations && data.translations.length > 0) {
      return {
        translatedText: data.translations[0].text,
        detectedSourceLanguage: data.translations[0].detected_source_language
      };
    }
    
    return { translatedText: text };

  } catch (error) {
    console.error('DeepL Translation failed:', error);
    return { translatedText: text }; // Fallback to original
  }
};
