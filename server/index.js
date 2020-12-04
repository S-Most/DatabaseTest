const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk("localhost/messages");
const myMessages = db.get("myMessages");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "server on port 5000 is working",
    });
});

app.get("/messages", (req, res) => {
    // display all the messages
    myMessages.find().then((myMessage) => {
        res.json(myMessage);
    });
});

app.post("/messages", (req, res) => {
    if (isValid(req.body)) {
        const myMessage = {
            name: req.body.name.toString(),
            message: req.body.message.toString(),
            created: new Date(),
        };
        console.log(myMessage);
        myMessages.insert(myMessage).then((createdMessage) => {
            res.json(createdMessage);
        });
    } else {
        res.status(422);
        res.json({
            message: "name and message are required!",
        });
    }
});

function isValid(body) {
    return (
        body.name &&
        body.name.toString().trim() !== "" &&
        body.message &&
        body.message.toString().trim() !== ""
    );
}

app.listen(5000, () => {
    console.log("listening on 5000");
});
