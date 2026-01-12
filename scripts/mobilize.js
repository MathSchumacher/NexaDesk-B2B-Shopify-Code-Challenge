import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const IGNORED_FILES = ['index.css', 'App.css', 'variables.css', 'fonts.css', 'tailwind.css'];
const MARKER = '@media screen and (min-width: 769px)';

console.log('Starting Mobile CSS Separation...');
console.log('Source Directory:', SRC_DIR);

function getAllFiles(dirPath, arrayOfFiles) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory does not exist: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.css')) {
          arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function mobilize() {
    const cssFiles = getAllFiles(SRC_DIR);
    console.log(`Found ${cssFiles.length} CSS files.`);

    let processedCount = 0;
    let skippedCount = 0;

    cssFiles.forEach(filePath => {
        const fileName = path.basename(filePath);
        
        if (IGNORED_FILES.includes(fileName)) {
            console.log(`Skipping ignored file: ${fileName}`);
            skippedCount++;
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');

        // Check if already mobilized
        if (content.includes(MARKER)) {
            console.log(`Already mobilized: ${fileName}`);
            skippedCount++;
            return;
        }

        // Wrap content
        const desktopContent = content.split('\n').map(line => '  ' + line).join('\n');
        
        const newContent = `${MARKER} {\n${desktopContent}\n}\n\n/* Mobile App Version */\n@media screen and (max-width: 768px) {\n  /* Add mobile specific styles here */\n}\n`;

        fs.writeFileSync(filePath, newContent);
        console.log(`Processed: ${fileName}`);
        processedCount++;
    });

    console.log(`\nDone! Processed ${processedCount} files. Skipped ${skippedCount} files.`);
}

mobilize();
