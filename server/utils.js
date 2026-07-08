function cleanText(text) {
  return text
    .replace(/<[^>]*?>/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

module.exports = { cleanText };
