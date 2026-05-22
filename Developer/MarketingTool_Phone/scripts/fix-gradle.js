const fs = require('fs');
const path = require('path');

const wrapperPath = path.join(process.cwd(), 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');

if (fs.existsSync(wrapperPath)) {
  console.log('Patching Gradle wrapper to 8.13...');
  let content = fs.readFileSync(wrapperPath, 'utf8');
  content = content.replace(/gradle-.*-bin\.zip/g, 'gradle-8.13-bin.zip');
  fs.writeFileSync(wrapperPath, content);
  console.log('Successfully patched gradle-wrapper.properties');
} else {
  console.log('gradle-wrapper.properties not found, skipping patch.');
}
