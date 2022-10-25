const express = require("express");
const app = express();
const cors = require("cors");
let UserModel = require("./user");
let bodyParser = require("body-parser");
const { arrayBuffer } = require("stream/consumers");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
require("./database");

// middleware for handling post requests
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", function (req, res) {
  let newUser = new UserModel({ username: req.body.username });
  newUser
    .save()
    .then((docs) => {
      console.log(docs);
      res.json({
        username: docs.username,
        _id: docs._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.get("/api/users", function (req, res) {
  UserModel.find(
    {},
    {
      username: 1,
      _id: 1,
    }
  )
    .then((docs) => {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.post("/api/users/:_id/exercises", function (req, res) {
  console.log(req.body);

  UserModel.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    {
      $push: {
        logs: {
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date || Date.now(),
        },
      },
    },
    { new: true }
  )
    .then((docs) => {
      console.log("updated", docs);
      res.json({
        username: docs.username,
        description: req.body.description,
        duration: req.body.duration,
        date: new Date(req.body.date || Date.now()).toDateString(),
        _id: docs._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.get("/api/users/:_id/logs", function (req, res) {
  console.log(req.query);
  console.log(
    "from:",
    req.query.from,
    "to:",
    req.query.to,
    "limit:",
    req.query.limit
  );
  UserModel.aggregate([
    { $unwind: "$logs" },
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params._id),
        "logs.date": {
          $gt: new Date(req.query.from || new Date("1970")),
          $lt: new Date(req.query.to || Date.now()),
        },
      },
    },
    { $limit: Number(req.query.limit) || 1000 },
    {
      $group: {
        _id: "$_id",
        username: { $first: "$username" },
        count: { $sum: 1 },
        logs: { $addToSet: "$logs" },
      },
    },
    {
      $project: {
        "logs._id": 0
      }
    }
  ])
    .then((docs) => {
      console.log(docs);
      let newDocs = JSON.parse(JSON.stringify(docs));
      for (let i = 0; i < docs[0].logs.length; i++) {
        newDocs[0].logs[i].date = docs[0].logs[i].date.toDateString();
      }

      res.json(newDocs[0]);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
