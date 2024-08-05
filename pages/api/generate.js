import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Write me a detailed table of contents for a detailed report with the title below.

Title:
`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Take the table of contents and the title of the report below and generate a report written in the style of highly technical hackers or investment reports written by investment institutions. Make it feel like a detailed industry report.Don't just list the points.Go deep into each one. Explain why and give examples.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Report:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    
    temperature: 0.85,
		
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;

