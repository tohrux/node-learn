const http = require('http')
const url = require('url')
const users = []
let uid = 1

//基础的增删改查实现
const server = http
  .createServer((req, res) => {
    if (req.url === '/favicon.ico') return
    req.setEncoding('utf-8')
    reqLogger(req)
    const { pathname, query } = url.parse(req.url, true)
    if (req.method === 'POST') {
      if (req.url === '/register') {
        let uname = ''
        req.on('data', (chunk) => {
          uname += chunk
        })
        req.on('end', () => {
          let userInfo = { uid, uname }
          users.push(userInfo)
          uid++
          res.end('register successfully')
        })
      }
    } else if (req.method === 'GET') {
      if (pathname === '/users') {
        let user = users.find((v) => v.uid === Number(query.uid))
        res.end(JSON.stringify(user || { msg: 'not found' }))
      }
      if (pathname === '/allUsers') {
        res.end(JSON.stringify(users))
      }
    } else if (req.method === 'DELETE') {
      if (pathname === '/users') {
        if (
          users.find((v, i) => {
            if (v.uid === Number(query.uid)) {
              users.splice(i, 1)
              return true
            }
          })
        ) {
          res.end('delete successfully')
        } else {
          res.end('not found')
        }
      }
    }
  })
  .listen(3000)

function reqLogger(req) {
  console.log(req.method, ' ', req.url)
}
