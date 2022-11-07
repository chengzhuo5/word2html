// @ts-check
const fs = require('fs-extra');
const path = require('path');
const { command } = require('execa');
const klaw = require('klaw');
const handleHtml = require('./handleHtml');

const word2html = async (/** @type {string} */ dirPath, /** @type {string} */ outputDirPath, /** @type {string} */ exePath, /** @type {boolean} */ removeOrigin) => {
  return new Promise(async (resolve) => {
    const htmlDir = path.resolve(dirPath, 'html');
    await fs.ensureDir(htmlDir);
    await command(
      exePath +
        ` -f ${dirPath}  -O ${htmlDir} -T wdFormatFilteredHTML -E 65001 -OX .html${
          removeOrigin ? ' -R true' : ''
        }`,
      {
        stdio: 'inherit',
      }
    );

    for await (const html of klaw(htmlDir, {
      depthLimit: -1,
      filter: (filePath) => {
        if (['.html'].includes(path.extname(filePath))) {
          return true;
        }
        if (fs.statSync(filePath).isDirectory()) {
          return true;
        }
        return false;
      },
    })) {
      if (html.stats.isFile()) {
        await fs.writeFile(
          path.resolve(outputDirPath, path.basename(html.path)),
          handleHtml(await fs.readFile(html.path))
        );
      }
    }
    resolve();
  });
};

module.exports = word2html;
