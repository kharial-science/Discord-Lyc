/* global imports */
const fs = require('fs')
const Discord = require('discord.js')
const Base = require('kf-database')
require('dotenv').config()
const config = require('./src/config')

/* declarations */
const client = new Discord.Client()
const data = new Base({ name: 'data' })

client.on('ready', () => console.log('client ready'))
// data.deleteAll()

/* log in the client */
client.login(process.env.CLIENT_TOKEN)

/*
 * userRegistrations object : { memberID : registrationState }, registrationState is a number
 * registrationState
 *  - 0 : first message has been sent
 *  - 1 : first answer (classe) has been sent
 *  - 2 : second answer (délégué) has been sent
 *  - 3 : third answer (prénom N.) has been sent, in fact 3 doesn't exist since we delete the user from the object at this point
 */
const userRegistrationsStates = {}

/* new user came to the server */
client.on('guildMemberAdd', async member => {

    userRegistrationsStates[member.id] = 0
    const memberDMChannel = await member.createDM()
    memberDMChannel.send('Salut toi ! \nJe te souhaite la bienvenue sur le server Discord du Lycée Jean de Pange ! \nEt avant que tu ne te présentes, je vais me présenter : \nJe suis un bot Discord développé par des membres du staff, et je suis ton esclave, je vais servir à te donner tes rôles en fonction de ta classe ou encore à répondre à tes problèmes/questions.\nPour cela tu devra répondre à un petit questionnaire qui me permettra de te donner ta classe etc... (chaque réponse sera validée par un modérateur donc inutile de mentir !)\nIl sera important que tu respectes la mise en forme de tes réponses selon l\'exemple sinon les grades ne pourront pas t\'être attribué !\nAlors es-tu prêt ?\nPremière question, et attention ce n\'est pas la plus facile !\nQu\'elle est ta classe ? (sous la forme CLASSE ESPACE NUMÉRO)\nVoici différents exemples : \n2 4  si tu es en seconde 4\n1 7  si tu es en première 7\nT 1  si tu es en terminale 1 \n(attention il faut mettre la majuscule)')

})

const nextQuestionsMessages = [
    'Tu vois, ce n\'était pas si compliqué !\nMaitenant tu vas devoir me dire si tu es délégué ou non (attention des modérateurs vont vérifier)\nSi tu es délégué tu dit "oui" sinon tu dit "non" (sans majuscule).', // demander délégué 
    'Maintenant l\'étape la plus difficile, la dernière étape, celle qui te donnera le plus de mal,\ntu vas devoir m\'écrire ton Prénom avec la première lettre de ton nom de famille (TRES DIFFICILE ATTENTION)\nExemple : Prénom N. (Attention, il faut une majuscule à la première lettre du prénom et à la première et seule lettre du nom, suivi d\'un point, si par exeple il y a 2 Lucas N dans ta classe, tu doit écrire les deux premières lettre de ton nom de famille sous la forme Na. et ainsi de suite) \nJe m\'appelle Kharoh Heest, cela donne Kharoh H. ', // demander le prénom N.
    'Merci beaucoup ! Tu as normalement réussi toutes les épreuves, tu vas devoir attendre gentillement qu\'un modérateur valide ou non ton entrée dans le discord.', // remercier
]

const registerUser = (userID) => {
    const member = client.guilds.cache.get(config.server).members.cache.get(userID)

    member.roles.set([])

    member.roles.add(config[data.get(userID, 'classe')])
    if (data.get(userID, 'delegue') === 'oui') member.roles.add(config.delegue)

    const newUserName = data.get(userID, 'nom') + (' | ' + member.user.username).slice(0, 32 - data.get(userID, 'nom').length)

    member.edit({
        nick: newUserName
    })
}

client.on('message', message => {

    /* return if the user is a bot */
    if (message.author.bot) return

    if (message.channel.type === 'dm') client.channels.cache.get(config.returnChannel).send(
        '**' + 
        client.guilds.cache.get(config.server).members.cache.get(message.author.id).displayName + 
        ' ' +
        message.author.id +
        ' a dit : ' +
        '**' + 
        message.content
    )

    /* check if the player is sending a message for its registration */
    if ( (userRegistrationsStates[message.author.id] || userRegistrationsStates[message.author.id] === 0) && message.channel.type === 'dm' ) {
        if (userRegistrationsStates[message.author.id] === 0) {
            /* save the user's anwer to its classe */
            data.set(message.author.id, message.content, 'classe')
            
            /* send the next message */
            message.channel.send(nextQuestionsMessages[userRegistrationsStates[message.author.id]])
    
            /* go to the next state for next message */
            userRegistrationsStates[message.author.id]++
        }
    
        else if (userRegistrationsStates[message.author.id] === 1) {
            /* save the user's anwer to its state, student or delegue */
            data.set(message.author.id, message.content, 'delegue')
            
            /* send the next message */
            message.channel.send(nextQuestionsMessages[userRegistrationsStates[message.author.id]])
    
            /* go to the next state for next message */
            userRegistrationsStates[message.author.id]++
        }
    
        else if (userRegistrationsStates[message.author.id] === 2) {
            /* save the user's anwer to its state, student or delegue */
            data.set(message.author.id, message.content, 'nom')
            
            /* send the next message */
            message.channel.send(nextQuestionsMessages[userRegistrationsStates[message.author.id]])
    
            /* end the registration process */
            delete userRegistrationsStates[message.author.id]
    
            /* register the little boy with the informations given */
            client.channels.cache.get(config.registerChannel).send(`${message.author.tag} ${message.author.id} s'est inscrit avec les informations : ${JSON.stringify(data.get(message.author.id))}`)
        }
    }

    else if (!message.content.startsWith('!')) return

    if (message.channel.id === config.registerChannel) {
        if (message.content.startsWith('!accept')) {
            const [command, id] = message.content.split(' ')
    
            registerUser(id)
        }
    
        if (message.content.startsWith('!modify')) {
            const [command, id, key, ...newValue] = message.content.split(' ')
    
            if (['classe', 'delegue', 'nom'].includes(key)) data.set(id, newValue.join(' '), key)
            else message.channel.send('Vous devez user de cette commande de la sorte : !modify id clé:{classe|delegue|nom} valeur')
            message.channel.send(`${id} s'est inscrit avec les informations : ${JSON.stringify(data.get(id))}`)
        }
    }
})
 