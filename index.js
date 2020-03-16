/* global imports */
const fs = require('fs')
const Discord = require('discord.js')
const Base = require('kf-database')
require('dotenv').config()
const assets = require('./assets/assets')

/* subglobal imports */
const config = assets.config
const client = new Discord.Client()
const db = new Base('')

/* event handler */
fs.readdir('./src/events', (err, files) => {
    if (err) throw err
    files.forEach(fileName => {
        if (!fileName.endsWith('.js')) return
        const event = require(`./src/events/${fileName}`)
        const eventName = fileName.split('.')[0]
        client.on(eventName, event.bind(null, client))
        delete require.cache[require.resolve(`./src/events/${fileName}`)]
    })
})



client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }
})


/* log the client in */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.CLIENT_TOKEN)
