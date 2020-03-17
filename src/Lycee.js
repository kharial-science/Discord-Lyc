const { Client } = require('discord.js')
const fs = require('fs')

class Lycee extends Client {
    constructor({ data, config }) {
        super()

        this.data = data
        this.config = config

        this.commands = {}
    
        this.loadEvents()
        this.loadCommands()
    }

    loadEvents() {
        fs.readdir('./src/events', (err, files) => {
            if (err) throw err
            files.forEach(fileName => {
                if (!fileName.endsWith('.js')) return
                const event = require(`./events/${fileName}`)
                const eventName = fileName.split('.')[0]
                this.on(eventName, event.bind(null, this))
                delete require.cache[require.resolve(`./events/${fileName}`)]
            })
        })
    }

    loadCommands() {
        fs.readdir('./src/commands', (err, files) => {
            if (err) throw err
            files.forEach(fileName => {
                if (!fileName.endsWith('.js')) return
                const command = require(`./commands/${fileName}`)
                const commandName = fileName.split('.')[0]
                this.commands[commandName] = command
                delete require.cache[require.resolve(`./commands/${fileName}`)]
            })
        })
    }

    async registerUser(userID) {
        /* retrieve the member object */
        const member = this.guilds.cache.get(this.config.server).members.cache.get(userID)    
        if(!member) return

        /* remove the member current roles */
        await member.roles.set([])

        /* add the classe role and if he is delegue, the delegue role */
        await member.roles.add(this.config[this.data.get(userID, 'classe')])
        if (this.data.get(userID, 'delegue') === 'oui') await member.roles.add(this.config.delegue)

        /* modify the user displayName to add his nom */
        const newUserName = this.data.get(userID, 'nom') + (' | ' + member.user.username).slice(0, 32 - this.data.get(userID, 'nom').length)
        member.edit({
            nick: newUserName
        })
    }
}

module.exports = Lycee
