require('dotenv').config();
const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');

class Chain {
  constructor() {
    this.llm = new ChatGroq({
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
    });
  }

  async extractJobs(cleanedText) {
    const prompt = PromptTemplate.fromTemplate(`
### SCRAPED TEXT FROM WEBSITE:
{page_data}
### INSTRUCTION:
The scraped text is from the career's page of a website.
Your job is to extract the job postings and return them in JSON format containing the following keys: \`role\`, \`experience\`, \`skills\` and \`description\`.
Only return the valid JSON.
### VALID JSON (NO PREAMBLE):
`);
    const chain = prompt.pipe(this.llm).pipe(new JsonOutputParser());
    const res = await chain.invoke({ page_data: cleanedText });
    return Array.isArray(res) ? res : [res];
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
    return res.content;
  }
}

module.exports = { Chain };
