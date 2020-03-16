const config = require('./global/config')

const LycServer = require('./servers/LycServer')
const ModServer = require('./servers/ModServer')

const assets = {
    config,
    LycServer,
    ModServer
}

module.exports = assets
