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

const saveMessage = (req, res) => {
  const newMessage = req.body;
  const sameMessage = messages.find((q) => q.text === newMessage.text);
  if (sameMessage) {
    res.status(400).send("A message with the same content already exists.");
  } else if (newMessage.text.length == 0 || newMessage.from.length == 0) {
    res.status(400).send("The 'text' and 'from' fields can't be empty");
  } else {
    const maxId = Math.max(...messages.map((q) => q.id));
    newMessage.id = maxId + 1;
    messages.push(newMessage);
    res.status(201).send(newMessage);
  }
};
const getMessageByIdFunction = (req, res) => {
  const messageId = parseInt(req.params.messageId);

  const message = messages.find((u) => u.id === messageId);
  if (message) {
    res.send(message);
  } else {
    res.status(404).send("Nope");
  }
};
const deleteMessageByIdFunction = (req, res) => {
  let messageId = parseInt(req.params.messageId);
  let message = messages.find((u) => u.id === messageId);

  if (message) {
    messages = messages.filter((q) => q.id != messageId);
    res.status(200).send(message);
  } else {
    res.status(404).send(`Didn't find message with id ${messageId}`);
  }
};

const textQueryFunction = (req, res) => {
  const term = req.query.text;

  const filteredMessages = messages.filter((q) => q.text.includes(term));

  res.status(200).send(filteredMessages);
};

const getLatestFunction = (req, res) => {
  let lastTen = messages.slice(-10);
  res.send(lastTen);
};
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages", function (req, res) {
  res.send(messages);
});
app.get("/messages/latest", getLatestFunction);
app.get("/messages/:messageId", getMessageByIdFunction);
app.post("/messages", saveMessage);
app.delete("/messages/:messageId", deleteMessageByIdFunction);
app.get("/quotes/search", textQueryFunction);

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
