/*
 * userRegistrations object : { memberID : registrationState }, registrationState is a number
 * registrationState
 *  - 0 : first message has been sent
 *  - 1 : first answer (classe) has been sent
 *  - 2 : second answer (délégué) has been sent
 *  - 3 : third answer (prénom N.) has been sent, in fact 3 doesn't exist since we delete the user from the object at this point
 */

module.exports = async (client, member) => {
    /* check if the player is already registered in the data */
    if (client.data.get(member.id) && client.data.get(member.id).regState === 4) client.registerUser(member.id)

    /* create the new registration state in the user data */
    client.data.set(member.id, 0, 'regState')
    console.log(client.data.get(member.id))

    /* send the welcome message to the client and ask for his classe */
    const memberDMChannel = await member.createDM()
    memberDMChannel.send('Salut toi ! \nJe te souhaite la bienvenue sur le server Discord du Lycée Jean de Pange ! \nEt avant que tu ne te présentes, je vais me présenter : \nJe suis un bot Discord développé par des membres du staff, et je suis ton esclave, je vais servir à te donner tes rôles en fonction de ta classe ou encore à répondre à tes problèmes/questions.\nPour cela tu devra répondre à un petit questionnaire qui me permettra de te donner ta classe etc... (chaque réponse sera validée par un modérateur donc inutile de mentir !)\nIl sera important que tu respectes la mise en forme de tes réponses selon l\'exemple sinon les grades ne pourront pas t\'être attribué !\nAlors es-tu prêt ?\nPremière question, et attention ce n\'est pas la plus facile !\nQu\'elle est ta classe ? (sous la forme CLASSE ESPACE NUMÉRO)\nVoici différents exemples : \n2 4  si tu es en seconde 4\n1 7  si tu es en première 7\nT 1  si tu es en terminale 1 \n(attention il faut mettre la majuscule)')
}
