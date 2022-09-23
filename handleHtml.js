const jsdom = require('jsdom');

module.exports = (html) => {
  const document = jsdom.jsdom(html);
  document.head.innerHTML += `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0 24px;
        line-height: 1.8 !important;
      }
      body p {
        line-height: 1.8 !important;
      }
      a:-webkit-any-link {
        color: #228AE5;
        text-decoration: none;
      }
    </style>`;
  if (!document.head.querySelector('title')) {
    document.head.innerHTML += `<title>${(() => {
      for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']) {
        const el = document.body.querySelector(tag);
        if (el && el.textContent) {
          return el.textContent;
        }
      }
      return '';
    })()}</title>`;
  }
  return jsdom.serializeDocument(document);
  //   .replace(/(\d)pt/g, ($0, $1) => {
  //   return `${$1}px`;
  // })
};
