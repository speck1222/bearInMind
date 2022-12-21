const redis = require('redis')

const productionClient = () => redis.createClient({
  socket: {
    host: 'srv-captain--game-instance',
    port: 6379
  },
  password: 'Dalltx13'
})

const devClient = () => redis.createClient()

const redisClient = process.env.NODE_ENV === 'production' ? productionClient() : devClient()

module.exports = redisClient;

// conect redis client async imediatly after exporting
(async () => {
  redisClient.on('error', (err) => console.log(err))
  console.log('connecting redis')
  await redisClient.connect()
})()
