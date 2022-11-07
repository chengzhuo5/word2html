// @ts-check
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const word2html = require('./word2html');

const exePath = path.resolve(os.tmpdir(), 'docto_64.exe');
const tmpWordPath = path.resolve(os.tmpdir(), 'word2html');

const convertFiles = async (
  /** @type {string[]} */ fileList,
  /** @type {string} */ outputDirPath = path.resolve(process.cwd(), 'output')
) => {
  await fs.copyFile(path.resolve(__dirname, 'docto_64.exe'), exePath);
  await fs.ensureDir(outputDirPath);
  await fs.ensureDir(tmpWordPath);
  await fs.emptyDir(tmpWordPath);
  await Promise.all(
    fileList.map((filePath) =>
      fs.copyFile(filePath, path.resolve(tmpWordPath, path.basename(filePath)))
    )
  );
  await word2html(tmpWordPath, outputDirPath, exePath, true);
  await fs.unlink(exePath);
  await fs.emptyDir(tmpWordPath);
  await fs.remove(tmpWordPath);
};

const convertDir = async (
  /** @type {string} */ dirPath,
  /** @type {string} */ outputDirPath = path.resolve(process.cwd(), 'output')
) => {
  await fs.copyFile(path.resolve(__dirname, 'docto_64.exe'), exePath);
  await fs.ensureDir(outputDirPath);
  await word2html(dirPath, outputDirPath, exePath, false);
  await fs.unlink(exePath);
};

module.exports = {
  convertFiles,
  convertDir
};
