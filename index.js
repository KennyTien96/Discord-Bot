const { Client, Intents, MessageActionRow, MessageButton} = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
})

client.on('messageCreate', (message) => {
    if(message.author.id === client.user.id) return;

    if(message.content === "ping") {
        message.reply("pong")
    }
})


/* Tic Tac Toe */
let EMPTY = Symbol("empty");
let PLAYER = Symbol("player");
let BOT = Symbol("bot");

let tictactoe_state

function makeGrid() { 
    components = []

    for (let row = 0; row < 3; row++) {
        actionRow = new MessageActionRow()

        for (let col = 0; col < 3; col++) {
            messageButton = new MessageButton()
                .setCustomId('tictactoe_' + row + '_' + col)

            switch(tictactoe_state[row][col]) {
                case EMPTY:
                    messageButton
                        .setLabel(' ')
                        .setStyle('SECONDARY')
                    break;
                case PLAYER:
                    messageButton
                        .setLabel('X')
                        .setStyle('PRIMARY')
                    break;
                case BOT:
                    messageButton
                        .setLabel('O')
                        .setStyle('DANGER')
                    break;
            }
        
               
                actionRow.addComponents(messageButton)
        }

        components.push(actionRow)
    }
    return components
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

client.on('interactionCreate', async interaction => {
    if(!interaction.isButton()) return;
    if (!interaction.customId.startsWith('tictactoe')) return;

    parsedFields = interaction.customId.split("_")
    row = parsedFields[1]
    col = parsedFields[2]

    tictactoe_state[row][col] = PLAYER;

    /* Bot Functionality */
    let botRow
    let botCol
    do {
        botRow = getRandom(2);
        botCol = getRandom(2);
    } while(tictactoe_state[botRow][botCol] != EMPTY);

    tictactoe_state[botRow][botCol] = BOT;

    interaction.update({
        components: makeGrid()
    })

})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'tictactoe') { 
        tictactoe_state = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ]

        await interaction.reply({content: 'Playing a game of tic-tac-toe!', components: makeGrid() });
    }
})

client.login(token);