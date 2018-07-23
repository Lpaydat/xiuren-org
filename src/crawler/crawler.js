import fs from 'fs'
import Crawler from 'crawler'
import { database } from '../database'
import { imageDownloader } from './imageDownloader'

const c = new Crawler({
  rateLimit: 1000,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
  callback: (err, res, done) => {
    if (err) {
      console.error(err)
      fs.appendFileSync('log/errorLogs.txt', err.stack)
    } else {
      const $ = res.$
      $('a').each((i, element) => {
        const url = encodeURI(element.attribs.href)
        const { href, title } = element.attribs

        if (/.+\.(jpg|png)$/.test(url)) {
          imageDownloader(href, title)
        } else if (/.+xiuren\.org.*\/(tag|category)\/.+/.test(url)) {
          database.checkCrawled('xiuren:crawled', url, res => {
            if (!res) {
              database.storeQueue('xiuren:queue', url)
              database.storeCrawled('xiuren:crawled', url)
            }
          })
        }
      })

      // get all magezine albums
      const album = $('#main')
        .children('.loop')
        .find('a')
        .each((i, element) => {
          console.log(element.attribs)
          const { href, title } = element.attribs
          database.checkCrawled('xiuren:crawled', href, res => {
            console.log('Stored album', title)
            if (!res) {
              database.storeQueue('xiuren:queue', href)
              database.storeCrawled('xiuren:crawled', href)
            }
          })
        })
    }
    done()
  },
})

const crawler = url => c.queue(url)

export default crawler
