/* global imports */
const fs = require('fs')
const Discord = require('discord.js')
const Base = require('kf-database')
require('dotenv').config()
const assets = require('./assets/assets')

/* subglobal imports */
const client = new Discord.Client()
const data = new Base({ name: 'data' })

/* event handler */
fs.readdir('./src/events', (err, files) => {
    if (err) throw err
    files.forEach(fileName => {
        if (!fileName.endsWith('.js')) return
        const event = require(`./src/events/${fileName}`)
        const eventName = fileName.split('.')[0]
        client.on(eventName, event.bind(null, { Discord, assets, client, data }))
        console.log('Loaded event ' + eventName)
        delete require.cache[require.resolve(`./src/events/${fileName}`)]
    })
})

/* log in the client */
client.login(process.env.CLIENT_TOKEN)
