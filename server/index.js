const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || "localhost/messages");
const myMessages = db.get("myMessages");
const filter = new Filter();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "server on port 5000 is working",
    });
});

app.get("/messages", (req, res) => {
    myMessages.find().then((myMessage) => {
        res.json(myMessage);
    });
});

app.get("/remove", (req, res) => {
    myMessages.remove();
});

app.use(
    rateLimit({
        windowMs: 15 * 1000, // 15 seconds
        max: 1,
    })
);

app.post("/messages", (req, res) => {
    if (isValid(req.body)) {
        const myMessage = {
            name: filter.clean(req.body.name.toString()),
            message: filter.clean(req.body.message.toString()),
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
