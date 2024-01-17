const { copyFile, readdir, stat, mkdir, rm } = require('fs/promises');
const { join } = require('path');

const fromDirectory = join(__dirname, 'files');
const toDirectory = join(__dirname, 'files-copy');

makeDirectory(toDirectory).catch(console.error);
readDirAndUpdate(fromDirectory, toDirectory);


async function makeDirectory(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

async function readDirAndUpdate(from, to) {
  try {
    const filesFrom = await readdir(from);
    for (const file of filesFrom) {
      if (!(await stat(join(from, file))).isDirectory()) {
        cp(join(from, file), join(to, file));
      }
    }
    const filesTo = await readdir(to);
    for (const file of filesTo) {
      if (!filesFrom.includes(file)) {
        rm(join(to, file)).catch(console.error);
        console.log(`${file} was deleted from ${to}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function cp(source, destination) {
  try {
    await copyFile(source, destination);
    console.log(`${source} was copied to ${destination}`);
  } catch {
    console.error('The file could not be copied');
  }
}


