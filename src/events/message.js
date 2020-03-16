module.exports = ({ Discord, client, data, config }, message) => {
    if (message.content === 'ping') {
        message.reply('Pong!')
    }
}
