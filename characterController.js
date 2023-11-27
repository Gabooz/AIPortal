const ChatGPTController = require("./chatGPTController");
const chatGPTController = new ChatGPTController();

class CharacterController {
	constructor() {
		this.Characters = [
			{
				id:0,
				displayName: "Bob",
				fullName: "Bob the average American",
				personality: "You are Bob, you are an average american with a boring office job who lives in Seattle, you are 30 years old and don't have a girlfriend.",
				day: "Bob lives in Seattle, he just had breakfast and is driving to his office job.",
				busyness: 0
			},
			{
				id:1,
				displayName: "Younha",
				fullName: "Younha the Korean Singer",
				personality: "You are Younha the Korean Singer",
				day: "Younha is writing a new song for her album.",
				busyness: 0
			},
			{
				id:2,
				displayName: "Gandalf",
				fullName: "Gandalf the Grey",
				personality: "You are Gandalf the Grey",
				day: "Gandalf is making fireworks for Bilbos Birthday Party.",
				busyness: 0
			},
			{
				id:3,
				displayName: "Batman",
				fullName: "Catholic Batman",
				personality: "You are Catholic Batman. You believe that the last true pope was Pius the Twelth, you believe the vatican council was a corrupt council. You believe you must be catholic to be saved, and that we are in the great apostasy.",
				day: "Batman is protecting Gotham City from the Free Masons.",
				busyness: 0
			},
			{
				id:4,
				displayName: "Snoopy",
				fullName: "Snoopy the Dog",
				personality: "You are Snoopy, Charlie Browns dog.",
				day: "Snoopy is sleeping on his dog house.",
				busyness: 0
			},
			{
				id:5,
				displayName: "Shrek",
				fullName: "Shrek the Ogre",
				personality: "You are Shrek. The Ogre.",
				day: "Shrek is taking a mudbath.",
				busyness: 0
			},
			{
				id:6,
				displayName: "Faramir",
				fullName: "Faramir son of Denethor",
				personality: "You are Faramir son of Denethor, you are open-minded and fair. But grounded in the moral values passed down to you from the elves. This being basic Catholic theology, though this is never said.",
				day: "Faramir is travelling through Ithilian to the Waterfall hide-out.",
				busyness: 0
			},
			{
				id:7,
				displayName: "Boromir",
				fullName: "Boromir don of Denethor",
				personality: "You are Boromir son of Denethor, you are devoted to your realm. The realm of Gondor. And to your father, the Steward of Gondor, Denethor son of Ecthelion. You are strong, brave, and bold.",
				day: "Boromir is pondering his mysterious dream.",
				busyness: 0
			},
			{
				id:8,
				displayName: "Beregond",
				fullName: "Beregond Captain of the Guard",
				personality: "You are Beregond Captain of the Guard, you live in Minas Tirith and guard it. You are an ordinary person, but solid in heart. Loyal to your lords and steward.",
				day: "Beregond is eating lunch.",
				busyness: 0
			},
			{
				id:9,
				displayName: "Sam",
				fullName: "Sam Gamgee",
				personality: "You are Sam Gamgee, Frodo's loyal servant and gardner. You care mostly about a simple gardners life in hobbiton.",
				day: "Sam is drinking ale and chatting with his hobbit friends in the green dragon.",
				busyness: 0
			},
			{
				id:10,
				displayName: "Frodo",
				fullName: "Frodo Baggins",
				personality: "You are Frodo Baggins, the ring-bearer. Educated by your beloved uncle, Bilbo Baggins, you know elvish and much lore and history.",
				day: "Frodo is reading a book.",
				busyness: 0
			}
		];

		this.LinkedCharacters = [];

		this.Context = "";

		this.MessageHistory = [];
	}

	linkCharacter(id, user) {
		var parentObject = this;

		return(new Promise(function(resolve, reject){
			var character = parentObject.getCharacterById(id);
			var result;

			console.log("Linking character: " + character["displayName"]);

			if(parentObject.LinkedCharacters.includes(character)) {
				console.log(character["displayName"] + " already linked");

				result = ["Character does not exist, " + user, false, {}];

				resolve(result[0]);
			}else{
				parentObject.characterGreets(character, user, parentObject.MessageHistory, parentObject.Context).then(function(value) {
					result = [value, true, character];
					parentObject.LinkedCharacters.push(character);
					parentObject.addToMessageHistory(user + " added " + character["displayName"] + ".", "System");

					resolve(value);
				});
			}

			
		}));

		
	}

	unlinkCharacter(id, user) {
		var character = this.getCharacterById(id);

		console.log("Uninking character: " + character["displayName"]);

		if(this.LinkedCharacters.includes(character)) {
			var count = 0;

			this.LinkedCharacters.forEach(character => {
				if (character["id"] == id) {
					this.LinkedCharacters.splice(count, 1);
				}
				count++;
			});

			addToMessageHistory(user + " removed " + character["displayName"] + ".", "System")
			
			return(character["displayName"] + " removed. monster");
		}else{
			console.log(character["displayName"] + " not linked already");

			return(character["displayName"] + " not linked already");
		}
	}

	getCharacterById(id) {
		console.log("id: " + id);
		var output = {};
		var found = false;

		this.Characters.forEach(character => {
			if(character["id"] == id) {
				found = true;
				output = character;
			}
		})

		if(found) {
			return(output);
		} else {
			console.log("Could not find character with id: " + id);
			return(false)
		}
	}

	addToMessageHistory(message, sender) {
		this.MessageHistory.push(sender + " says " + message);

		if(this.MessageHistory.length >= 17){
			this.createContext(this.MessageHistory).then((value) => {
				this.MessageHistory = [];
				this.Context = value;
			});
		}
	}

	messagesToText(messages) {
		var output = "";

		messages.forEach(message => {
			output += "|" + message;
		})

		return(output);
	}

	listCharactersForPrompt(characters) {
		var output = "{";
		var counter = 0;

		characters.forEach(character => {
			output += character.displayName + ":" + (counter >= characters.length ? character.day + "}": character.day + ", ");
			counter++;
		});

		return(output);
	}

	prepareCharacters(characters) {
		console.log("Preparing characters: " + characters);

		var prompt = "I will give a list of characters and how their days have gone, you will respond with a short recap of each of their days with the addition of how they have progressed. Make it an interesting story while staying true to how their days have already gone. Additionally add how busy they are from 1 to 10. Divide values by /. Assess only the characters I have described, do not use the messages characters. Do not preamble. Here are the characters: {" + this.listCharactersForPrompt(characters) + "} Add in elements from the following conversation as well: {" + this.Context + "|" + this.MessageHistory + "} Example: |Bob/Bob lives in Seattle, he had breakfast, and is now working on filing files./9|Younha/Younha is a korean singer, she is writing a song, she had a good breakfast/5|";
		var parentObject = this;

		return(new Promise(function(resolve, reject){
			chatGPTController.prompt(prompt, "gpt-4").then(function(value){
				var parsedValue = value.split("|");

				parsedValue.forEach(characterDay => {
					var characterDayParsed = characterDay.split("/");
					parentObject.Characters.forEach(character => {
						if(character["displayName"] == characterDayParsed[0]) {
							character["day"] = characterDayParsed[1];
							character["busyness"] = Number(characterDayParsed[2]);
						}
					});
					resolve(value);
				});
			});
		}));	
	}

	respondAs(character, messages, history) {
		console.log("Responding as: " + character["displayName"]);

		var prompt = character["personality"] + " " + character["day"] + " You were interupted from what you were doing to respond in context with these messages as " + character["displayName"] + ": {" + messages + "} Here is more context to the messages: {" + history + "}. Reply as " + character["displayName"] + " as realistically as possible, and don't address every topic and person in the convo. Just the topic most relevent to " + character["displayName"] + ", unless it would be unrealistic to do otherwise. Additionally try to change the conversation topic to something of " + character["displayName"] + "'s own invention, if it is realistic and not out the blue (unless " + character["displayName"] + " would be like that of course). Also keep it short just like a real group chat. No monologues unless " + character["displayName"] + " would really do that. Don't repeat things " + character["displayName"] + " has already said, instead continue off of it leaving it as already said. Also don't be afraid to be contrary if necessary, giving " + character["displayName"] + " a lot more character.";
		var parentObject = this;

		return(new Promise(function(resolve, reject){
			chatGPTController.prompt(prompt, "gpt-4").then((value) => {
				resolve(value);
			});
		}));	
	}

	evaluateInterest(characters, messages, context) {
		console.log("Evaluating interest for: " + characters);

		var prompt = "I will give a list of characters, and messages and their context. Rank every characters interest in the conversation from 1 to 10.  Assess only the characters I have described, do not use the messages characters. Do not preamble. Here are the characters: {" + this.listCharactersForPrompt(characters) + "} Messages: {" + this.messagesToText(messages) + "} Context: {" + context + "} Example: 'Bob/10''Younha/3'";
		var parentObject = this;

		return(new Promise(function(resolve, reject){
			chatGPTController.prompt(prompt, "gpt-4").then(async function(value){
				var parsedValue = value.split("'");
				var output = {};
				var returnValue;

				parsedValue.forEach(characterInterest => {
					var characterInterestParsed = characterInterest.split("/");
					parentObject.Characters.forEach(character => {
						if(character["displayName"] == characterInterestParsed[0]) {
							output[character["id"]] = Number(characterInterestParsed[1]);
						}
					});
				});

				returnValue = output;

				resolve(returnValue);
			});
		}));
	}

	createContext(messages) {
		console.log("Creating context for: " + messages);

		var prompt = "Summarize this chat group summarization alongside the following chat group messages (that came afterwards) highlighting information but keeping it brief, keep it to fifty words maximum: " + this.Context + this.messagesToText(messages);
		
		return(new Promise(function(resolve, reject){
			chatGPTController.prompt(prompt, "gpt-4").then(async function(value){
				resolve(value);
			});
		}));
		
	}

	callCharacter(character, user, message) {
		console.log("Calling " + character["displayName"] + ":");

		var prompt = character["personality"] + " " + character["day"] + " You were called from what you were doing by " + user + " and forced to respond to " + user + "'s call: {" + message + "}, in context with these messages as " + character["displayName"] + ": {" + this.MessageHistory + "} Here is more context to the messages: {" + this.Context + "} Reply as " + character["displayName"] + " as realistically as possible. Also keep it short just like a real group chat. Also don't be afraid to be contrary if necessary, giving " + character["displayName"] + " a lot more character.";
		var parentObject = this;


		return(new Promise(function(resolve, reject){
			chatGPTController.prompt(prompt, "gpt-4").then(async function(value){
				var output = value;

				parentObject.addToMessageHistory(message, user);
				parentObject.addToMessageHistory(output, character["displayName"]);

				resolve(value);
			});
		}));
	}

	characterGreets(character, user, messages, history) {
		var output;
		var parentObject = this;

		return(new Promise((resolve, reject) => {
			console.log("Greeting " + user + " as: " + character["displayName"]);

			var prompt = character["personality"] + " " + character["day"] + " You were added to the group chat by " + user + " and you will greet " + user + " in context with these messages as " + character["displayName"] + ": {" + messages + "} Here is more context to the messages: {" + history + "} Reply as " + character["displayName"] + " as realistically as possible, and don't address every topic and person in the convo. Just the topic most relevent to " + character["displayName"] + ", unless it would be unrealistic to do otherwise. Additionally try to change the conversation topic to something of " + character["displayName"] + "'s own invention, if it is realistic. Also keep it short just like a real group chat. No monologues unless " + character["displayName"] + " would really do that. Don't repeat things " + character["displayName"] + " has already said, instead continue off of it leaving it as already said. Also don't be afraid to be contrary if necessary, giving " + character["displayName"] + " a lot more character.";
		
			chatGPTController.prompt(prompt, "gpt-4").then((value) => {
				output = value;

				parentObject.addToMessageHistory(output, character["displayName"]);

				resolve(output);
			});
		}));
	}

	runIteration() {
		console.log("Beginning iteration: ");

		var parentObject = this;

		return(new Promise(function(resolve, reject){
			if(parentObject.LinkedCharacters.length > 0) {
				parentObject.prepareCharacters(parentObject.LinkedCharacters).then((functionReturn) => {
					parentObject.evaluateInterest(parentObject.LinkedCharacters, parentObject.MessageHistory, parentObject.Context).then((value) => {
						var possibleResponders = [];

						parentObject.LinkedCharacters.forEach(character => {
							var randomChance = Math.random()*20;

							if(value[character["id"]] + character["busyness"] > randomChance) {
								possibleResponders.push(character);
							}
						});

						console.log("Possible Responders: " + possibleResponders);

						var responder;

						if(possibleResponders.length > 0) {
							responder = possibleResponders[0];

							possibleResponders.forEach(character => {
								if(value[character["id"]] > value[responder["id"]]) {
									responder = character;
								}
							});

							parentObject.respondAs(responder, parentObject.MessageHistory, parentObject.Context).then((value) => {
								parentObject.addToMessageHistory(value, responder["displayName"]);
								var output = [parentObject, value, responder["displayName"]]

								resolve(output);
							});
						} else {
							console.log("Everyone is too busy");
							var output = [parentObject, "", ""];

							resolve(output);
						}
					});	
				});
			} else {
				console.log("No Characters linked");

				var output = [parentObject, "", ""];

				resolve(output);
			}
		}));
	}
}

module.exports = CharacterController;