// server/index.js
import path from 'path';
import express from "express";
import cors from 'cors';
import redis from 'redis';
import getRedisClient from './RedisClient';

const PORT = process.env.PORT || 3001;

const app = express();
console.log(process.env.NODE_ENV)
const origin = process.env.NODE_ENV === 'production' ? 'https://bear-in-mind-frontend.game.peckappbearmind.com' : 'http://localhost:3000'
var corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))
const client = getRedisClient()

app.get("/", async (req, res) => {
  console.log(process.env.frontend_url)
  res.json({ message: 'Hello' });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});