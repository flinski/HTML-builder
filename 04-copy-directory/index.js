const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function copyDir() {
  try {
    const dirPath = path.join(__dirname, 'files');
    const copiedDirPath = path.join(__dirname, 'files-copy');

    await rm(copiedDirPath, {
      force: true,
      recursive: true,
    });

    await mkdir(copiedDirPath, { recursive: true });

    const files = await readdir(dirPath);
    for (const file of files) {
      const srcPath = path.join(dirPath, file);
      const destPath = path.join(copiedDirPath, file);
      await copyFile(srcPath, destPath);
    }
  } catch (error) {
    console.error(error.message);
  }
}

copyDir();
