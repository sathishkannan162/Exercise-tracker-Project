const express = require("express");
const app = express();
const cors = require("cors");
let UserModel = require("./user");
let bodyParser = require("body-parser");
const { arrayBuffer } = require("stream/consumers");
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

app.get('/api/users',function(req,res){
  UserModel.find({},{
    username: 1,
    _id: 1
  })
  .then(docs=>{
  console.log(docs)
    res.json(docs);
  })
  .catch(err=>{
  console.log(err)
    res.send(err);
  });
  
});


app.post("/api/users/:_id/exercises", function (req, res) {
  console.log(req.body);

  // findOneAndUpdate 


  UserModel.findOneAndUpdate({
    _id: req.params._id
  },
  {
    $push: {
      logs: {
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date || Date.now()
      }
    }
  },
  {new: true})
  .then(docs=>{
  console.log('updated',docs);
    res.json({
      username: docs.username,
      description: req.body.description,
      duration: req.body.duration,
      date: (new Date(req.body.date || Date.now())).toDateString(),
      _id: docs._id
    })
  })
  .catch(err=>{
  console.log(err)
    res.json(err)
  });
  



//   UserModel.findById(req.params._id)
//   .then((docs) => {
//     if (docs == null) {
//       res.json({error: "user not found"})
//     }
//     else {
//     console.log("found", docs);
//     docs.logs.push({
//       description: req.body.description,
//       duration: req.body.duration,
//     });
//     console.log('modified',docs.logs);

//     docs
//       .save()
//       .then((docs) => {
//         console.log("saved", docs);
//         res.json();
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send(err);
//       });
// }})
//   .catch((err) => {
//     console.log(err);
//   });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
