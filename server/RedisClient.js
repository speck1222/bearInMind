const redis = require('redis')

function getRedisClient() {
    // const client = process.env.NODE_ENV === 'production' ? redis.createClient(6379, 'srv-captain--game-instance' , {password: 'Dalltx13'}) : redis.createClient(6379, '127.0.0.1')
    const client = redis.createClient(6379, 'srv-captain--game-instance' , {password: 'Dalltx13'})
    client.on('error', (err) => console.log('Redis Client Error', err));
    return client
}

module.exports = getRedisClient