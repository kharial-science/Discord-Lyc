module.exports = (client, message) => {
    /* return if the user is a bot */
    if (message.author.bot) return

    /* return all messages sent to the bot in the return channel */
    if (message.channel.type === 'dm') client.channels.cache.get(client.config.returnChannel).send(
        '**' + 
        client.guilds.cache.get(client.config.server).members.cache.get(message.author.id).displayName + 
        ' ' +
        message.author.id +
        ' a dit : ' +
        '**' + 
        message.content
    )

    /* check if the player is sending a message for its registration */
    const regState = client.data.get(message.author.id) ? client.data.get(message.author.id).regState : undefined
    if ( (regState || regState === 0) && message.channel.type === 'dm') {

        const nextQuestionsMessages = [
            'Tu vois, ce n\'était pas si compliqué !\nMaitenant tu vas devoir me dire si tu es délégué ou non (attention des modérateurs vont vérifier)\nSi tu es délégué tu dit "oui" sinon tu dit "non" (sans majuscule).', // demander délégué 
            'Maintenant l\'étape la plus difficile, la dernière étape, celle qui te donnera le plus de mal,\ntu vas devoir m\'écrire ton Prénom avec la première lettre de ton nom de famille (TRES DIFFICILE ATTENTION)\nExemple : Prénom N. (Attention, il faut une majuscule à la première lettre du prénom et à la première et seule lettre du nom, suivi d\'un point, si par exeple il y a 2 Lucas N dans ta classe, tu doit écrire les deux premières lettre de ton nom de famille sous la forme Na. et ainsi de suite) \nJe m\'appelle Kharoh Heest, cela donne Kharoh H. ', // demander le prénom N.
            'Merci beaucoup ! Tu as normalement réussi toutes les épreuves, tu vas devoir attendre gentillement qu\'un modérateur valide ou non ton entrée dans le discord.', // remercier
        ]

        /* save the user classe and ask for the delegue */
        if (regState === 0) { 
            /* save the user's classe */
            client.data.set(message.author.id, message.content, 'classe')

            /* send the next message to ask */
            message.channel.send(nextQuestionsMessages[regState])

            /* go to the next regState for the next message */
            client.data.set(message.author.id, regState + 1, 'regState')
        }

        /* save the user delegue and ask for the name */
        else if (regState === 1) { 
            /* save the user's classe */
            client.data.set(message.author.id, message.content, 'delegue')

            /* send the next message to ask */
            message.channel.send(nextQuestionsMessages[regState])

            /* go to the next regState for the next message */
            client.data.set(message.author.id, regState + 1, 'regState')
        }

        /* save the user name and welcome the user, send the informations to the modChannel */
        else if (regState === 2) {
            /* save the user's anwer to its state, student or delegue */
            client.data.set(message.author.id, message.content, 'nom')
                        
            /* send the next message */
            message.channel.send(nextQuestionsMessages[regState])

            /* end the registration process */
            client.data.set(message.author.id, regState + 1, 'regState') // it will now be 3, informations sent but unregistered

            /* send the message to modChannel and wait for registration */
            client.channels.cache.get(client.config.registerChannel).send(`${message.author.tag} ${message.author.id} s'est inscrit avec les informations : ${JSON.stringify(client.data.get(message.author.id))}`)
        }
    }

    /* handle commands */
    if (!message.content.startsWith('!')) return
    const [ command, ...args ] = message.content.substr(1).split(' ')
    if (!client.commands[command]) return
    client.commands[command](client, message, args)
}
