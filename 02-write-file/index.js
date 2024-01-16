// The steps to complete the task are as follows:

// 1. Import all required modules.
// 2. Create a writable stream to a text file.
// 3. Display a welcome message in the console.
// 4. Wait for user input, with subsequent checking for the presence of the keyword `exit`.
// 5. Write the entered text to the file.
// 6. Wait for further input.
// 7. Implement a farewell message when the process is stopped.

const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const file = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(file);

console.log('Hi! Write your text:');

const rl = readline.createInterface({ input, output });

rl.on('line', (line) => {
  if (line === 'exit') {
    closeAll();
  } else {
    writeStream.write(line + '\n');
  }
});

rl.on('SIGINT', () => {
  closeAll();
});
writeStream.on('finish', () => {
  console.log('Good Bye!');
});

function closeAll() {
  rl.close();
  writeStream.end();
}
