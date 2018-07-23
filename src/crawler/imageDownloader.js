import Crawler from 'crawler'
import fs from 'fs'
import mkdirp from 'mkdirp'

const c = new Crawler({
  rateLimit: 1000,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
})

export const imageDownloader = (url, filename) => {
  const name = /.+\.(jpg|png)$/.test(filename) ? filename : `${filename}.jpg`
  const path = url
    .replace(/(https?)?:\/\/[^\/]+\//, '')
    .replace(/\/[^\/]*$/, '')
    .replace(/-/g, '/')
  mkdirp(`downloads/${path}`)

  c.queue({
    uri: url,
    filename: `downloads/${path}/${name}`,
    jQuery: false,
    encoding: null,
    callback: function(err, res, done) {
      if (err) {
        console.error(err.stack)
        fs.appendFileSync('log/errorLogs.txt', err.stack)
      } else {
        console.log('Downloading image', url)
        fs.createWriteStream(res.options.filename).write(res.body)
      }
      done()
    },
  })
}
