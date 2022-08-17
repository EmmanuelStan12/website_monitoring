const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer(function (req, res) {
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
        const chosedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        const data = {
            path: trimmedPath,
            query,
            method,
            headers,
            payload: buffer
        }

        chosedHandler(data, function (statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            const payloadString = JSON.stringify(payload)
            res.writeHead(statusCode)
            res.end(payloadString)

        })
    })
})

const handlers = {};

handlers.sample = function (data, callback) {
    callback(406, {'name': 'handler'})
};

handlers.notFound = function(data, callback) {
    callback(404)
}

const router = {
    'sample': handlers.sample
};

server.listen(3000, () => console.log('Listening on port 3000'))