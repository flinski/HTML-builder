const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'result.txt');
const writeStream = fs.createWriteStream(filePath);
const rl = readline.createInterface({ input: stdin, output: stdout });

console.log(
  'Введите текст для записи в файл result.txt\nДля выхода из программы используйте комбинацию клавиш Ctrl + C или введите в консоль команду exit',
);

function exit() {
  console.log('Программа завершена. Ваш текст добавлен в файл result.txt');
  rl.close();
  writeStream.end();
  process.exit();
}

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    exit();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', exit);
