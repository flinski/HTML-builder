const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

async function createBundle() {
  try {
    const contents = [];
    const stylesDirPath = path.join(__dirname, 'styles');
    const files = await readdir(stylesDirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDirPath, file.name);
        const content = await readFile(filePath, { encoding: 'utf-8' });
        contents.push(content);
      }
    }

    const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
    await writeFile(bundleFilePath, contents);
  } catch (error) {
    console.error(error.message);
  }
}

createBundle();
