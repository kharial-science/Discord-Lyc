module.exports = (client, message, args) => {
    if (message.channel.id !== client.config.registerChannel) return

    const [id, key, ...newValue] = args

    /* modify the user data */
    if (['classe', 'delegue', 'nom'].includes(key)) client.data.set(id, newValue.join(' '), key)
    else message.channel.send('Vous devez user de cette commande de la sorte : !modify id clé:{classe|delegue|nom} valeur')
    message.channel.send(`${id} s'est inscrit avec les informations : ${JSON.stringify(client.data.get(id))}`)
}
