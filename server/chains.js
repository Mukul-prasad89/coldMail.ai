require('dotenv').config();
const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');

function truncate(text, maxLen = 3000) {
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

class Chain {
  constructor() {
    this.llm = new ChatGroq({
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
      model: 'qwen/qwen3.6-27b',
    });
  }

  async extractJobs(cleanedText) {
    const prompt = PromptTemplate.fromTemplate(`
### SCRAPED TEXT FROM WEBSITE:
{page_data}
### INSTRUCTION:
The scraped text is from the career's page of a website.
Your job is to extract the job postings and return them in JSON format containing the following keys: \`role\`, \`experience\`, \`skills\` and \`description\`.
Only return the valid JSON array. NO markdown, NO code fences, NO commentary.
### VALID JSON:
`);
    const chain = prompt.pipe(this.llm);
    const res = await chain.invoke({ page_data: truncate(cleanedText, 3000) });
    let jsonStr = res.content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\n([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const arrayMatches = jsonStr.match(/\[[\s\S]*?\]/g);
    if (arrayMatches && arrayMatches.length > 0) {
      jsonStr = arrayMatches[arrayMatches.length - 1].trim();
    }
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  async writeMail(job, links) {
    const prompt = PromptTemplate.fromTemplate(`
### JOB DESCRIPTION:
{job_description}

### INSTRUCTION:
You are Mohan, a business development executive at AtliQ. AtliQ is an AI & Software Consulting company dedicated to facilitating
the seamless integration of business processes through automated tools. 
Over our experience, we have empowered numerous enterprises with tailored solutions, fostering scalability, 
process optimization, cost reduction, and heightened overall efficiency. 
Your job is to write a cold email to the client regarding the job mentioned above describing the capability of AtliQ 
in fulfilling their needs.
Also add the most relevant ones from the following links to showcase Atliq's portfolio: {link_list}
Remember you are Mohan, BDE at AtliQ. 
Do not provide a preamble.
### EMAIL (NO PREAMBLE):
`);
    const chain = prompt.pipe(this.llm);
    const res = await chain.invoke({ job_description: JSON.stringify(job), link_list: links });
    let content = res.content.trim();
    const subjectIdx = content.search(/^Subject:/im);
    if (subjectIdx >= 0) return content.slice(subjectIdx).trim();
    const dearIdx = content.search(/^Dear\s/i);
    if (dearIdx >= 0) return content.slice(dearIdx).trim();
    const hiIdx = content.search(/^Hi\s/i);
    if (hiIdx >= 0) return content.slice(hiIdx).trim();
    return content;
  }
}

module.exports = { Chain };