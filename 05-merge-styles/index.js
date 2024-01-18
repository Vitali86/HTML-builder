// Possible steps to complete the task:

const { readdir, readFile, createWriteStream } = require('fs');
const { join, parse } = require('path');

// 1. Import all required modules.
// 2. Read the contents of the `styles` folder.
// 3. Check if an object in the folder is a file and has the correct file extension.
// 4. Read the style file.
// 5. Write the read data to an array.
// 6. Write the array of styles to the `bundle.css` file.

const stylesDir = join(__dirname, 'styles');

const singleFile = join(__dirname, 'project-dist', 'bundle.css');

readdir(stylesDir, (err, files) => {
    if (err) throw err;

    console.log(files);

  for (const file of files) {
    if (parse(file).ext === '.css') {
      readFile(join(stylesDir, file), (err, data) => {
        if (err) throw err;
        console.log(data);
        createWriteStream(singleFile).write(data);
      });
    }
  }
  
  });

