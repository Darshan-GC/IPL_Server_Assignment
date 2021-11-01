const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');

let port = process.env.PORT || 5000;

app.use(cors());
app.use('/views', express.static('views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DataBase

const dbURI = `mongodb+srv://darshan:${process.env.REACT_APP_PASSWORD}@cluster0.yyd90.mongodb.net/IPL_Assignment?retryWrites=true&w=majority`;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log('Database Connection Established');
  })
  .catch(() => {
    console.log('Database Connection Not Successfull');
  });

const teamSchema = new mongoose.Schema({}, { strict: false });

var details = mongoose.model('details', teamSchema);
var comments = mongoose.model('comments', teamSchema);

app.get('/home/:team', async (req, res) => {
  var teamCode = req.params.team;
  var data = await details.find({ playingFor: teamCode });
  res.render('index', { data });
});

app.get('/admin', async (req, res) => {
  var data = await details.find();
  res.render('index', { data });
});

app.get('/player/:name', async (req, res) => {
  var Name = req.params.name;
  var data = await details.find({ playerName: Name });
  res.send(data);
});

app.get('/comments/:player', async (req, res) => {
  var Name = req.params.player;
  var data = await comments.find({ player: Name });
  res.send(data);
});

// POST

app.post('/comments', async (req, res) => {
  var data = await comments.insertMany([req.body]);
  res.send(data);
});

app.post('/addPlayer', async (req, res) => {
  if (req.body.userData.code === '345235') {
    var data = await details.insertMany([req.body]);
    res.send(data);
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
