const redis = require('redis')

const productionClient = () => redis.createClient({
  socket: {
    host: 'srv-captain--game-instance',
    port: 6379
  },
  password: 'Dalltx13'
})

const devClient = () => redis.createClient()

function getRedisClient () {
  const client = process.env.NODE_ENV === 'production' ? productionClient : devClient
  client.on('error', (err) => console.log('Redis Client Error', err))
  return client
}

module.exports = getRedisClient
