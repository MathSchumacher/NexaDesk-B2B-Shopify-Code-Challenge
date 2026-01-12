export const decryptKey = (encryptedKey: string): string => {
  const SALT = 'B2B_SAAS_2026_SECURE';
  try {
    const decoded = atob(encryptedKey);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }
    return result;
  } catch (e) {
    console.error('Failed to decrypt key', e);
    return '';
  }
};
