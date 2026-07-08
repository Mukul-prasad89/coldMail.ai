const fs = require('fs');
const { parse } = require('csv-parse/sync');

const CSV_PATH = './my_portfolio.csv';

class Portfolio {
  constructor() {
    const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
    this.data = parse(csvText, { columns: true, skip_empty_lines: true });
  }

  queryLinks(skills) {
    const skillSet = (Array.isArray(skills) ? skills.join(' ') : skills).toLowerCase();
    const matches = this.data
      .filter((row) =>
        row.Techstack.toLowerCase().split(',').some((tech) => skillSet.includes(tech.trim()))
      )
      .slice(0, 2)
      .map((row) => row.Links);
    return matches.length ? matches : this.data.slice(0, 2).map((row) => row.Links);
  }
}

module.exports = { Portfolio };
