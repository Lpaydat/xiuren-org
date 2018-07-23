// @flow
import redis from 'redis'
import fs from 'fs'

const client = redis.createClient()

client.on('error', err => console.error('Error', err))

// methods
const storeQueue = (key, url) =>
  client.rpush(key, url, (err, rep) => {
    if (err) {
      fs.appendFileSync('log/errorLogs.txt', err.message)
    } else {
      console.log('Queued', url)
    }
  })

const getNextQueue = (key, callback) =>
  client.lpop(key, (err, rep) => {
    if (err) {
      fs.appendFileSync('log/errorLogs.txt', err.message)
    } else {
      callback(rep)
    }
  })

const storeCrawled = (key, url) =>
  client.sadd(key, url, (err, rep) => {
    if (err) {
      fs.appendFileSync('log/errorLogs.txt', err.message)
    }
  })

const checkCrawled = (key, url, callback) =>
  client.sismember(key, url, (err, rep) => {
    if (err) {
      fs.appendFileSync('log/errorLogs.txt', err.message)
    } else {
      callback(rep)
    }
  })

// export methods
export default { storeQueue, getNextQueue, storeCrawled, checkCrawled }
