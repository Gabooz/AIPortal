require("dotenv").config();

const OpenAIConfiguration = require("openai");
const OpenAI = require("openai");

class ChatGPTController {
	constructor() {
		console.log("New ChatGPT Controller")
		this.configuration = new OpenAIConfiguration({ apiKey: process.env.OPENAI_SECRET_KEY });
		this.openAI = new OpenAI(this.configuration);
	}

	prompt(prompt, model) {
		console.log("Prompting ChatGPT: " + prompt);
		console.log("Using Model: " + model);

		var parentObject = this;

		return(new Promise(async function(resolve, reject){
			var completion = await parentObject.openAI.chat.completions.create({
		        model: model,
		        messages: [{ role: "user", content: prompt}],
		    });

		    var output = completion.choices[0]["message"]["content"];

		    console.log("Prompt Completed: ");
		    console.log(output);

		    resolve(output);
		}));	
	}
}

module.exports = ChatGPTController;