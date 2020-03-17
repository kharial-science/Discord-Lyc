module.exports = (client, message, args) => {
    if (message.channel.id !== client.config.registerChannel) return

    const [id] = args

    /* register user */
    client.registerUser(id)
    message.channel.send(`registered ` + id)
}
