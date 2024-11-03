import mineflayer from 'mineflayer';
import WebSocket from 'ws';

export const makeMineflayerBot = (username, guild) => {

    let ws = new WebSocket('ws://192.168.1.114:3000');
    
    ws.on('open', () => {
        console.log('connected!');
        ws.send(JSON.stringify({
            type: 'init',
            guild: guild,
            username: username
        }))
    })

    ws.on('close', (code, reason) => {
        console.error(code + ' ' + reason);
    })
    
    ws.on('message', (data) => {
        const json = JSON.parse(data);
        switch (json.type) {
            case "chat":
                bot.chat("/gc " + json.player + " : " + json.message);
                break;
            default:
                break;
        }
    })

    const bot = mineflayer.createBot({
        host: "mc.hypixel.net",
        username: username,
        auth: "microsoft",
        port: "25565",
        version: "1.20"
    });
    
    bot.once('login', () => {
        console.log('Joined as ' + bot.username);
        bot.chat('/g online');
        for (let i = 0; i < 15; i++) {
            bot.chat("/"); // send self to limbo
        }
    })
    
    bot.on('message', (msg) => {
        console.log(msg.toAnsi());
    })
    
    bot.on('messagestr', (msg) => {
        let match;
        let match2;
        if (match = msg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
            if (match[2] == bot.username) return;
            if (match2 = match[4].match(/\.(\S+)( .+)?/)) {
                let args = match2[2]?.slice(1);
                if (!args) args = match[2];
                ws.send(JSON.stringify({
                    type: 'command',
                    player: match[2],
                    command: match2[1],
                    args
                }))
            }
            ws.send(JSON.stringify({
                type: 'chat',
                player: match[2],
                message: match[4]
            }))
        }
        else if (match = msg.match(/^Guild > (\S+) (joined.|left.)/)) {
            ws.send(JSON.stringify({
                type: 'playerListChange',
                player: match[1],
                difference: match[2] == 'joined.'? 1 : -1,
                players: []
            }))
        }
    })
    
}