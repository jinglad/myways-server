const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("User Authentication");
});

const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpsgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const userCollection = client
    .db(process.env.DB_NAME)
    .collection("userCollection");
  console.log("Connected");

  app.post("/signUp", (req, res) => {
    userCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/login", (req, res) => {
    const {email,password} = req.body;
    const user = userCollection.find({email:email});
    if(user.password === password){
        res.send(1);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
