const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs')
const handlers = require('./lib/handlers')
const helpers = require('./lib/helpers')

const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res)
});

const httpsOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsOptions, function (req, res) {
    unifiedServer(req, res)
})

const router = {
    'ping': handlers.ping,
    'users': handlers.users
};

httpServer.listen(config.http, () => console.log(`Listening on port ${config.http}`))
httpsServer.listen(config.https, () => console.log(`Listening on port ${config.https}`))

const unifiedServer = function (req, res) {
    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const query = parsedUrl.query;

    const method = req.method.toLowerCase();

    const headers = req.headers;

    const decoder = new StringDecoder('utf-8')
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {
        buffer += decoder.end()
        const chosedHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        const data = {
            path: trimmedPath,
            query,
            method,
            headers,
            payload: buffer
        }

        chosedHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

        })
    })
}