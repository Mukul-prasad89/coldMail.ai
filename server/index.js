require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Chain } = require('./chains');
const { Portfolio } = require('./portfolio');
const { cleanText } = require('./utils');

const app = express();
app.use(cors());
app.use(express.json());

const llm = new Chain();
const portfolio = new Portfolio();

app.post('/api/generate-email', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ColdEmailBot/1.0)' },
      timeout: 15000,
    });
    const data = cleanText(response.data);

    if (data.length < 100) {
      return res.status(200).json({ emails: [], message: 'No job openings found on this page.' });
    }

    const jobs = await llm.extractJobs(data);

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ emails: [], message: 'No job openings found on this page.' });
    }

    const results = [];
    for (const job of jobs) {
      const skills = job.skills || [];
      const links = await portfolio.queryLinks(skills);
      const email = await llm.writeMail(job, links);
      results.push({ role: job.role || 'Unknown', email });
    }

    res.json({ emails: results });
  } catch (err) {
    console.error(err);
    const msg = err.message || '';
    if (msg.includes('rate') || msg.includes('limit') || msg.includes('429') || msg.includes('quota')) {
      return res.status(200).json({ emails: [], message: 'No job openings found on this page.' });
    }
    res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
