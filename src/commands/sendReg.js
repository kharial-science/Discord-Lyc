/*
 * userRegistrations object : { memberID : registrationState }, registrationState is a number
 * registrationState
 *  - 0 : first message has been sent
 *  - 1 : first answer (classe) has been sent
 *  - 2 : second answer (délégué) has been sent
 *  - 3 : third answer (prénom N.) has been sent, in fact 3 doesn't exist since we delete the user from the object at this point
 *  - 4 : registered
 */

module.exports = async (client, message, args) => {
    if (message.channel.id !== client.config.registerChannel) return

    const [id] = args

    /* reset the user in database */
    client.data.set(id, {})
    client.data.set(id, 0, 'regState')

    /* send feedback */
    message.channel.send('sent new registration form to user ' + id)

    /* send the welcome message to the client and ask for his classe */
    const memberDMChannel = await client.guilds.cache.get(client.config.server).members.cache.get(id).createDM()
    memberDMChannel.send('Nous venons (les modérateurs) de relancer ton inscription car il doit y avoir eu une erreur ! Réponds normalement aux questions qui suivent, merci :)')
    memberDMChannel.send('Salut toi ! \nJe te souhaite la bienvenue sur le server Discord du Lycée Jean de Pange ! \nEt avant que tu ne te présentes, je vais me présenter : \nJe suis un bot Discord développé par des membres du staff, et je suis ton esclave, je vais servir à te donner tes rôles en fonction de ta classe ou encore à répondre à tes problèmes/questions.\nPour cela tu devra répondre à un petit questionnaire qui me permettra de te donner ta classe etc... (chaque réponse sera validée par un modérateur donc inutile de mentir !)\nIl sera important que tu respectes la mise en forme de tes réponses selon l\'exemple sinon les grades ne pourront pas t\'être attribué !\nAlors es-tu prêt ?\nPremière question, et attention ce n\'est pas la plus facile !\nQu\'elle est ta classe ? (sous la forme CLASSE ESPACE NUMÉRO)\nVoici différents exemples : \n2 4  si tu es en seconde 4\n1 7  si tu es en première 7\nT 1  si tu es en terminale 1 \n(attention il faut mettre la majuscule)')
}
