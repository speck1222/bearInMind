// server/index.js
const path = require('path');
const express = require("express");
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();
var corsOptions = {
  origin: 'https://bear-in-mind-frontend.game.peckappbearmind.com',
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});