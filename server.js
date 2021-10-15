const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

let welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

//functions
//const newMessageFromDom 
//NOT WORKING 
const saveMessage = (req, res) => {
    
    const newMessage = document.getElementById('messageId')
    console.log(newMessage.value);
    const maxId = Math.max(...messages.map((q) => q.id));
    newMessage.id = maxId + 1;

    messages.push(newMessage);

    res.status(201).send(newMessage);
  };
const getMessageByIdFunction = (req, res) => {
    const messageId = parseInt(req.params.messageId)
  
   
    const message = messages.find((u) => u.id === messageId)
    if (message) {
   res.send(message);
    }
    else {
       res.status(404).send('Nope')
    }
}
const deleteMessageByIdFunction = (req, res) => {
    let messageId = parseInt(req.params.messageId)
    let message = messages.find((u) => u.id === messageId)

    if (message) {
    messages = messages.filter((q) => q.id != messageId);
      res.status(200).send(message);
    }
    else {
       res.status(404).send(`Didn't find message with id ${messageId}`)
    }
}
app.use(express.json())

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app .get("/messages", function (req, res) {
  res.send(messages);
});
app .get("/messages/:messageId", getMessageByIdFunction);
app .post("/messages", saveMessage);
app .delete("/messages/:messageId", deleteMessageByIdFunction);


app.listen(3000, () => {
   console.log("Listening on port 3000")
  });

