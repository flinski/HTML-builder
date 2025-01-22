const { join, extname } = require('path');
const {
  mkdir,
  readdir,
  rm,
  readFile,
  copyFile,
  writeFile,
} = require('fs/promises');

const projectDistDirPath = join(__dirname, 'project-dist');
const componentsDirPath = join(__dirname, 'components');
const stylesDirPath = join(__dirname, 'styles');
const assetsDirPath = join(__dirname, 'assets');
const copiedAssetsDirPath = join(__dirname, 'project-dist', 'assets');

const templateFilePath = join(__dirname, 'template.html');
const indexFilePath = join(__dirname, 'project-dist', 'index.html');
const styleFilePath = join(__dirname, 'project-dist', 'style.css');

function logErrorMessage(error) {
  console.error(`Error: ${error.message}`);
}

async function makeDirectory(path) {
  const directoryPath = await mkdir(path, { recursive: true });
  return directoryPath;
}

async function getFileContents(path) {
  return await readFile(path, { encoding: 'utf8' });
}

async function createCSSBundle() {
  const contents = [];
  const files = await readdir(stylesDirPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && extname(file.name) === '.css') {
      const filePath = join(stylesDirPath, file.name);
      const content = await readFile(filePath, { encoding: 'utf8' });
      contents.push(content);
    }
  }

  await writeFile(styleFilePath, contents);
}

async function copyDirectory(srcPath, destPath) {
  await mkdir(destPath, { recursive: true });

  const dirents = await readdir(srcPath, { withFileTypes: true });

  for (const dirent of dirents) {
    const srcDirentPath = join(srcPath, dirent.name);
    const destDirentPath = join(destPath, dirent.name);

    if (dirent.isDirectory()) {
      await copyDirectory(srcDirentPath, destDirentPath);
    } else if (dirent.isFile()) {
      await copyFile(srcDirentPath, destDirentPath);
    }
  }
}

async function buildHTMLPage() {
  try {
    await rm(projectDistDirPath, {
      force: true,
      recursive: true,
    });

    await makeDirectory(projectDistDirPath);

    let templateFileContents = await getFileContents(templateFilePath);

    const componentFiles = await readdir(componentsDirPath, {
      withFileTypes: true,
    });

    for (const componentFile of componentFiles) {
      if (componentFile.isFile()) {
        const componentFilePath = join(componentsDirPath, componentFile.name);
        const componentFileContents = await getFileContents(componentFilePath);
        const template = `{{${componentFile.name.replace(
          extname(componentFile.name),
          '',
        )}}}`;

        templateFileContents = templateFileContents.replace(
          template,
          componentFileContents,
        );
      }
    }

    await writeFile(indexFilePath, templateFileContents, { encoding: 'utf8' });
    await createCSSBundle();
    await copyDirectory(assetsDirPath, copiedAssetsDirPath);
  } catch (error) {
    logErrorMessage(error);
  }
}

buildHTMLPage();
