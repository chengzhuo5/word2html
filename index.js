const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const klaw = require('klaw');
const { execSync } = require('child_process');
const word2html = require('./word2html');

const exePath = path.resolve(os.tmpdir(), 'docto_64.exe');
const tmpWordPath = path.resolve(os.tmpdir(), 'word2html');
const outputDirPath = path.resolve(process.cwd(), 'output');

(async function () {
  console.log('正在扫描当前文件夹下的word文档...');
  await fs.copyFile(path.resolve(__dirname, 'docto_64.exe'), exePath);
  await fs.ensureDir(outputDirPath);
  await fs.ensureDir(tmpWordPath);
  await fs.emptyDir(tmpWordPath);
  let count = 0;
  for await (const word of klaw('.', {
    depthLimit: -1,
    filter: (filePath) => {
      if (
        !path.basename(filePath).startsWith('~$') &&
        ['.doc', '.docx'].includes(path.extname(filePath))
      ) {
        return true;
      }
      if (
        fs.statSync(filePath).isDirectory() &&
        !filePath.includes('node_modules')
      ) {
        return true;
      }
      return false;
    },
  })) {
    if (word.stats.isFile()) {
      await fs.copyFile(
        word.path,
        path.resolve(tmpWordPath, path.basename(word.path))
      );
      count++;
    }
  }
  if (count === 0) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
    console.log('没有发现word文档，按任意键退出');
    return;
  }
  await word2html(tmpWordPath, outputDirPath, exePath);
  console.log('清理临时文件...');
  await fs.unlink(exePath);
  await fs.emptyDir(tmpWordPath);
  await fs.remove(tmpWordPath);
  console.log(
    `执行完成，已处理${count}个文件，结果已放在output目录下，是否打开目录？ (Y/N)`
  );
  process.stdin.setRawMode(true);
  process.stdin.resume();
  let keyLock = false;
  process.stdin.on('data', async (data) => {
    if (keyLock) {
      return;
    }
    keyLock = true;
    if (data.toString().toLocaleLowerCase() === 'y') {
      try {
        execSync(`explorer.exe ${outputDirPath}`);
      } catch (error) {
        //
      }
    }
    process.exit(0);
  });
})();
