const redisClient = require('../RedisClient')

async function deleteKeysWithPrefix (prefix) {
  console.log('Deleting keys with prefix:', prefix)
  let cursor = '0'

  do {
    // Run the SCAN command to get a list of keys
    const reply = await redisClient.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', '100')
    cursor = reply[0]
    const keys = reply[1]

    // Delete the keys if any were found
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } while (cursor !== '0') // When cursor returns '0', we've iterated through all keys
}

exports.deleteKeysWithPrefix = deleteKeysWithPrefix
