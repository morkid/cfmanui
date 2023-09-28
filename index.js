const proxy = require('express-http-proxy')
const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const app = express()
const { NODE_PORT = 5000 } = process.env

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

app.use('/', express.static('dist'))
app.use(cors())
app.use('/client/v4', proxy('api.cloudflare.com', {
    https: true,
    proxyReqPathResolver: req => `/client/v4/${req.url}`,
    proxyReqOptDecorator: opt => {
        opt.headers['authorization'] = [
            'Bearer', 
            process.env.VITE_API_AUTH_TOKEN
        ].join(' ')
        return opt
    }
}))

app.get('/oauth2/userinfo', (req, res) => {
    res.json({
        sub: 'Administrator'
    })
})

app.get('/roles/:username', (req, res) => {
    res.json({})
})

app.listen(NODE_PORT, () => {
    console.log(`starting server on port ${NODE_PORT}`)
})