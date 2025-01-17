const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'result.txt');
const writeStream = fs.createWriteStream(filePath);

console.log(
  'Введите текст для записи в файл result.txt\nДля выхода из программы используйте комбинацию клавиш Ctrl + C или введите в консоль команду exit',
);

const rl = readline.createInterface({ input: stdin, output: stdout });

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('close', () => {
  console.log('Программа завершена. Ваш текст добавлен в файл result.txt');
});
