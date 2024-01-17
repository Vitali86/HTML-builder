const path = require('node:path');
const fs = require('node:fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

async function readDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    // console.log(files);
    for (const file of files) {
      if (!(await fs.stat(path.join(dirPath, file))).isDirectory()) {
        // console.log(await fs.stat(path.join(dirPath, file)));
        const fileName = file.split('.')[0];
        const fileExt = file.split('.')[1];
        const fileSize = (await fs.stat(path.join(dirPath, file))).size;

        console.log(`${fileName} - ${fileExt} - ${fileSize}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
readDirectory(dirPath);
