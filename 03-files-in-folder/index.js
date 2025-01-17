const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.error(error.message);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const extName = path.extname(file.name);
      const baseName = path.basename(file.name, extName);
      const filePath = path.join(file.path, file.name);

      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error(error.message);
          return;
        }

        const size = stats.size / 1000;

        console.log(`${baseName} - ${extName.slice(1)} - ${size}kb`);
      });
    }
  });
});
