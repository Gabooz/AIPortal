require("dotenv").config();

const TelegramBot = require('node-telegram-bot-api');
const dimensionalPhone = new TelegramBot(process.env.TOKEN, {polling: true});

const CharacterController = require("./characterController.js");
const characterController = new CharacterController();

var appGoing = false;

var chatId;

dimensionalPhone.onText(/\/startPortal/, function (msg, match) {
   chatId = msg.chat.id;
   var fromId = msg.from.id;

   console.log("App Started by " + fromId);

   appGoing = true;

   var name = msg.from.first_name;


   setInterval(function() {characterController.runIteration().then((value) => { 
      if(value[0]) {
         if(!value[1] == ""){
            dimensionalPhone.sendMessage(chatId, value[2] + ": " + value[1]);
         }
      }
   })}, 180000);
});

dimensionalPhone.onText(/\/portal (.+)/, (msg, match) => {
    var fromId = msg.from.id;
    const resp = match[1];
    var name = msg.from.first_name;
    const respArray = resp.split(" ");
    const possibleName = respArray[1];
    console.log(respArray[0] + ", " + respArray[1]);
    currentChatId = chatId;

    if(respArray[0] == "link"){
         var characterToLink = {};
         var characterFound = false;

         console.log("name " + respArray[1]);

         characterController.Characters.forEach(character => {
            if(respArray[1] == character["displayName"]) {
               console.log("found " + character["displayName"]);
               characterToLink = character;
               characterFound = true;
            }
         });

         if(!characterFound){
            dimensionalPhone.sendMessage(chatId, respArray[1] + " doesn't exist, " + name + ".");
         }else{
            characterController.linkCharacter(characterToLink["id"], name).then((value) => {
               dimensionalPhone.sendMessage(chatId, value);
            });
         }
    }else if(respArray[0] == "remove"){
        var characterToRemove = {};

         characterController.Characters.forEach(character => {
            if(respArray[1] == character["displayName"]) {
               characterToRemove = character;
            }
         });

         dimensionalPhone.sendMessage(chatId, characterController.unlinkCharacter(characterToRemove, name));
    }else if(respArray[0] == "call"){
       var newArray = respArray;
       newArray.splice(0,2);

       var message = "";

       newArray.forEach((word) => {
         message += word + " ";
       });

       console.log("Message: " + message);

       var characterToLink = {};
       var characterFound = false;

       console.log("name " + possibleName);

       characterController.Characters.forEach(character => {
          if(possibleName == character["displayName"]) {
             console.log("found " + character["displayName"]);
             characterToLink = character;
             characterFound = true;
          }
       });

       if(!characterFound){
          dimensionalPhone.sendMessage(chatId, possibleName + " doesn't exist, " + name + ".");
       }else{
          characterController.callCharacter(characterToLink, name, message).then((value) => {
             dimensionalPhone.sendMessage(chatId, characterToLink["displayName"] + ": " + value);
          });
       }
    }else{
        dimensionalPhone.sendMessage(chatId, respArray[0] + " is not a command.");
    }

});

dimensionalPhone.onText(/\/say (.+)/, (msg, match) => {
    var fromId = msg.from.id;
    const resp = match[1];
    var name = msg.from.first_name;
    const respArray = resp.split(" ");
    currentChatId = chatId;

    characterController.addToMessageHistory(match[1], name);

    characterController.runIteration().then((value) => {
      if(value[0]) {
         if(!value[1] == ""){
            dimensionalPhone.sendMessage(chatId, value[2] + ": " + value[1]);
         }
      }
    });
});

dimensionalPhone.onText(/\/call (.+)/, (msg, match) => {
    var fromId = msg.from.id;
    const resp = match[0];
    var name = msg.from.first_name;
    const respArray = resp.split(" ");
    currentChatId = chatId;

    newArray = respArray;
    newArray.splice(0,2);

    var message = "";

    newArray.forEach((word) => {
      message += word + " ";
    });

    var characterToLink = {};
    var characterFound = false;

    console.log("name " + respArray[0]);

    characterController.Characters.forEach(character => {
       if(respArray[0] == character["displayName"]) {
          console.log("found " + character["displayName"]);
          characterToLink = character;
          characterFound = true;
       }
    });

    if(!characterFound){
       dimensionalPhone.sendMessage(chatId, respArray[0] + " doesn't exist, " + name + ".");
    }else{
       characterController.callCharacter(characterToLink, name, message).then((value) => {
          dimensionalPhone.sendMessage(chatId, characterToLink["displayName"] + ": " + value);
       });
    }
});

dimensionalPhone.on("polling_error", console.log);