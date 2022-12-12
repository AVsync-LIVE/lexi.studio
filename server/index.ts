export {}

const next = require('next')

const fs = require('fs')

const express = require('express')
const { join } = require('path')

const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const bodyParser = require('body-parser')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

require('dotenv').config()
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let lexi = {} as any

app.prepare().then(() => {
  const server = express()

  server.use(
    bodyParser.json({limit: '10mb'})
  )
  server.use(
    bodyParser.urlencoded({limit: '10mb', extended: true})
  )

  server.use(
    express.static('public')
  )

  server.use(
    cookieParser()
  )

  server.use(
    cookieSession({ 
      name: 'session', 
      keys: ['eThElIMpLYMOSeAMaNKlEroashIrOw'],
      maxAge: 1.75 * 60 * 60 * 1000 // 1 hour 45 minutes 
    })
  )

  server.use((req: any, res: any, next: any) => {
    if (
      req.originalUrl !== '/login' && 
      !req.session.loggedIn &&
      !req.originalUrl.startsWith('/_next') &&
      !req.originalUrl.startsWith('/assets') &&
      !req.originalUrl.startsWith('/auth')
    ) {
      res.redirect('/login')
    }
    
    next()
  })

  // login
  server.post('/auth/login', async (req: any, res: any) => {
    const { sessionToken, clearanceToken, userAgent } = req.body
    try {
      (async() => {
        const { ChatGPTAPI } = await import('chatgpt')
        lexi = new ChatGPTAPI({
          sessionToken,
          clearanceToken,
          userAgent
        })
        
        try {
          console.log(sessionToken, clearanceToken, userAgent)

          const auth = await lexi.ensureAuth()

          req.session.loggedIn = true
          req.session.sessionToken
          req.session.auth = auth

          res.send({ status: 'success' })
        }
        catch(e) {
          res.send({ status: 'failure', msg: (e as any).statusText })
        }
      })()
    }
    catch(e) {
      console.log(e)
      res.send({ status: 'failure', msg: 'Code validation failed' })
    }
  })

  // chat
  server.post('/lexi/chat', async (req: any, res: any) => {
    const { query } = req.body
    try {
      (async() => {
        try {
          const conversation = lexi.getConversation()
          const response = await conversation.sendMessage(query)
          res.send({ status: 'success', data: { response } })
        }
        catch(e) {
          res.send({ status: 'failure', msg: (e as any).statusText })
        }
      })()
    }
    catch(e) {
      console.log(e)
      res.send({ status: 'failure', msg: 'Chat failed' })
    }
  })

  // initialize Lexi
  server.post('/lexi/chat/init', async (req: any, res: any) => {
    try {
      (async() => {
        const lexiInitializationScript = fs.readFileSync('lexi/lexi-initialization.txt', 'utf8')
        
        try {
          const conversation = lexi.getConversation()
          const response = await conversation.sendMessage(lexiInitializationScript)
          res.send({ status: 'success', data: {
            response
          } })
        }
        catch(e) {
          res.send({ status: 'failure', msg: (e as any).statusText })
        }
      })()
    }
    catch(e) {
      console.log(e)
      res.send({ status: 'failure', msg: 'Chat failed' })
    }
  })
  
  server.all('/next/*', async (req: Request, res: any) => {
    res.status(400).json({ error: 'Next API route not found' })
  })
  
  server.all('*', (req: Request, res: Response) => handle(req, res))

  server.listen(<number>port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})