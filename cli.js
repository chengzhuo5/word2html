// @ts-check
const path = require('path');
const fs = require('fs-extra');
const klaw = require('klaw');
const { execSync } = require('child_process');
const { convertFiles } = require('./index');

const scanDir = async (
  /** @type {string} */ dirPath,
  options = {
    depthLimit: -1,
  }
) => {
  const fileList = [];
  console.log('正在扫描当前文件夹下的word文档...');
  for await (const word of klaw(dirPath, {
    filter: (/** @type {string} */ filePath) => {
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
    ...options,
  })) {
    if (word.stats.isFile()) {
      fileList.push(word.path);
    }
  }
  return fileList;
};

(async ({ outputDirPath = path.resolve(process.cwd(), 'output') } = {}) => {
  const fileList = await scanDir('.');
  if (fileList.length === 0) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
    console.log('没有发现word文档，按任意键退出');
    return;
  }
  await convertFiles(fileList, outputDirPath);
  console.log(
    `执行完成，已处理${fileList.length}个文件，结果已放在${outputDirPath}目录下，是否打开目录？ (Y/N)`
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
      console.log(`正在打开${outputDirPath}`);
      try {
        execSync(`explorer.exe ${outputDirPath}`);
      } catch (error) {
        //
      }
    }
    process.exit(0);
  });
})();
