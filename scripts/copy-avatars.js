const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\mathe\\.gemini\\antigravity\\brain\\99235fec-c9bc-4f51-9e4e-c53935d5d60a';
const destDir = 'd:\\Codes\\B2B-SAAS-CODE-CHALLENGE\\public';

const files = [
  { src: 'avatar_support_1768020066194.png', dest: 'avatar-support.png' },
  { src: 'avatar_emily_1768020080350.png', dest: 'avatar-emily.png' },
  { src: 'avatar_john_1768020092430.png', dest: 'avatar-john.png' },
  { src: 'avatar_michael_1768020104647.png', dest: 'avatar-michael.png' },
  { src: 'avatar_sarah_1768020116305.png', dest: 'avatar-sarah.png' },
  { src: 'avatar_david_1768020129352.png', dest: 'avatar-david.png' }
];

console.log('Starting copy operation...');

files.forEach(file => {
  try {
    const srcPath = path.join(sourceDir, file.src);
    const destPath = path.join(destDir, file.dest);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`SUCCESS: ${file.dest}`);
    } else {
      console.error(`MISSING: ${file.src}`);
    }
  } catch (err) {
    console.error(`ERROR copying ${file.dest}:`, err.message);
  }
});

console.log('Copy operation complete.');
