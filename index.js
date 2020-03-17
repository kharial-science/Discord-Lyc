/* global imports */
const fs = require('fs')
const Discord = require('discord.js')
const Lycee = require('./src/Lycee')
const Base = require('kf-database')
require('dotenv').config()
const config = require('./src/config')

/* declarations */
const data = new Base({ name: 'data' })
const client = new Lycee({ data, config })

client.on('ready', () => console.log('client ready'))
data.deleteAll()

/* log in the client */
client.login(process.env.CLIENT_TOKEN)
