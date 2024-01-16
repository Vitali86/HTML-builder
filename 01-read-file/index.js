const path = require('node:path');
const fs = require('node:fs');

// fs.readFile(path.join(__dirname, 'text.txt'), (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.on('data', (data) => {
  console.log(data.toString());
});

// console.log(stream);