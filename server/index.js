// server/index.js
const path = require('path');
const express = require("express");
const cors = require('cors');
const redis = require('redis')

const PORT = process.env.PORT || 3001;

const app = express();
var corsOptions = {
  origin: process.env.frontend_url || 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))
const client = redis.createClient(6379, 'srv-captain--game-instance' , {password: 'Dalltx13'})

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});