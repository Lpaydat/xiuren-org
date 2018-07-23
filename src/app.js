import redis from 'redis'
import { database } from './database'
import crawler from './crawler'
import fs from 'fs'
import mkdirp from 'mkdirp'

const client = redis.createClient()

const crawlerLoop = () => {
  database.getNextQueue('xiuren:queue', url => {
    if (url) {
      console.log('Start crawling...')
      crawler(url)
      crawlerLoop()
    } else {
      console.log('Wait 5 seconds...')
      setTimeout(() => crawlerLoop(), 5000)
    }
  })
}

console.log('Start app')
mkdirp('downloads', () => console.log('Created downloads directory.'))
fs.writeFileSync('log/errorLogs.txt', 'start logs:', err => console.error(err))
database.storeQueue('xiuren:queue', 'http://www.xiuren.org')
crawlerLoop()
