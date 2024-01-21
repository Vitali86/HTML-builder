const {
  access,
  readFile,
  copyFile,
  mkdir,
  stat,
  writeFile,
  readdir,
} = require('fs/promises');
const { join, parse } = require('path');

// Possible steps to complete the task:

// 1. Import all required modules.
// 2. Read and save the template file in a variable.
// 3. Find all tag names in the template file.
// 4. Replace template tags with the content of component files.
// 5. Write the modified template to the `index.html` file in the `project-dist` folder.
// 6. Use the script written in task **05-merge-styles** to create the `style.css` file.
// 7. Use the script from task **04-copy-directory** to move the `assets` folder into the `project-dist` folder.

// Note that you can optimize and modify this algorithm according to your preferences.

const buildDir = join(__dirname, 'project-dist');
const buildHTMLPath = join(buildDir, 'index.html');
const buildCssPath = join(buildDir, 'style.css');
const stylesDir = join(__dirname, 'styles');
const htmlTemplate = join(__dirname, 'template.html');
const componentsDir = join(__dirname, 'components');
const assetsDir = join(__dirname, 'assets');
const newAssetsDir = join(buildDir, 'assets');

const buildPage = async () => {
  try {
    // await mkdir(buildDir).catch(() => console.log('Dir exist'));
    await createDirectory(buildDir);

    let newIndexHTML = await readFile(htmlTemplate, 'utf8');
    const components = await readdir(componentsDir);

    for (const file of components) {
      if (!(await stat(join(componentsDir, file))).isDirectory() && parse(file).ext === '.html') {
        const fileName = parse(file).name;
        const data = await readFile(join(componentsDir, file));
        newIndexHTML = newIndexHTML.replace(`{{${fileName}}}`, data);
      }
    }

    await writeFile(buildHTMLPath, newIndexHTML);

    const styles = await readdir(stylesDir);

    let newStyleCss = '';
    for (const file of styles) {
      if (parse(file).ext === '.css' && !(await stat(join(stylesDir, file))).isDirectory()) {
        newStyleCss += await readFile(join(stylesDir, file), 'utf8');
      }
    }

    await writeFile(buildCssPath, newStyleCss);

    await createDirectory(newAssetsDir);

    await readDirAndUpdate(assetsDir, newAssetsDir);
  } catch (err) {
    console.error(err);
  }
};

async function createDirectory(dir) {
  try {
    await access(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      try {
        await mkdir(dir);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  }
}

async function readDirAndUpdate(from, to) {
  try {
    const filesFrom = await readdir(from);
    for (const file of filesFrom) {
      if (!(await stat(join(from, file))).isDirectory()) {
        await cpFile(join(from, file), join(to, file));
      } else if ((await stat(join(from, file))).isDirectory()) {
        await createDirectory(join(to, file));
        await readDirAndUpdate(join(from, file), join(to, file));
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

async function cpFile(source, destination) {
  try {
    await copyFile(source, destination);
    // console.log(`${source} was copied to ${destination}`);
  } catch (err) {
    console.error('The file could not be copied: ' + err);
  }
}

buildPage();
