import mineflayer from 'mineflayer';
import WebSocket from 'ws';

const generateRandomNonNumericString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const makeMineflayerBot = (username, guild, login, prefix) => {

    const chat = (msg) => {
        bot.chat(msg);
        lastMessage = msg;
    }

    let readingGuildOnlineMessage = false;
    let onlineMessageArray = [];

    let lastMessage = "";

    let players = [];

    let ws = new WebSocket('ws://192.168.1.110:3000');
    
    const connect = () => {
        ws = new WebSocket('ws://192.168.1.110:3000');
        ws.on('open', () => {
            console.log('connected!');
            ws.send(JSON.stringify({
                type: 'init',
                guild: guild,
                username: username,
                prefix: prefix
            }))
        })
    
        ws.on('close', (code, reason) => {
            console.error(code + ' ' + reason);
            setTimeout(connect, 30*1000);
        })
        
        ws.on('message', (data) => {
            const json = JSON.parse(data);
            switch (json.type) {
                case "chat":
                    chat(`/gc [${json.prefix}] ${json.player} : ${json.message}`);
                    break;
                case "playerListChange":
                    chat(`/gc [${json.prefix}] ${json.player} ${json.difference > 0? 'joined' : 'left'}. (${json.players.length}/?)`);
                    break;
                case "mute":
                    chat(`/g mute ${json.player} ${Math.floor(json.duration/60)}m`);
                case "say":
                    chat(json.message);
                default:
                    break;
            }
        })
    }
    connect();

    const bot = mineflayer.createBot({
        host: "mc.hypixel.net",
        username: login,
        auth: "microsoft",
        port: "25565",
        version: "1.20"
    });
    
    bot.once('login', () => {
        console.log('Joined as ' + bot.username);
        setTimeout(() => {
            bot.chat('/g online');
        }, 5*1000);
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
        if (msg == 'You cannot say the same message twice!' || msg == 'You are sending commands too fast! Please slow down.' || msg == 'You can only send a message once every half second!') {
            chat(lastMessage + " " + generateRandomNonNumericString(6));
        }
        if (match = msg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
            if (match[2] == bot.username) return;
            if (match2 = match[4].match(/^\.(\S+)(?: (.+))?/)) {
                let args = match2[2];
                if (!args) args = match[2];
                ws.send(JSON.stringify({
                    type: 'command',
                    player: match[2],
                    command: match2[1],
                    args
                }))
            }
            if (!players.includes(match[2])) players.push(match[2]);
            ws.send(JSON.stringify({
                type: 'chat',
                player: match[2],
                message: match[4]
            }))
        }
        else if (match = msg.match(/^Guild > (\S+) (joined.|left.)/)) {
            if (match[2] == 'joined.') {
                players.push(match[1])
            }
            else {
                players = players.filter(p => p !== match[1]);
            }
            ws.send(JSON.stringify({
                type: 'playerListChange',
                player: match[1],
                difference: match[2] == 'joined.'? 1 : -1,
                players: players
            }))
        }
        else if (match = msg.match(/^Guild Name: (.+)/)) {
            readingGuildOnlineMessage = true;
            onlineMessageArray = [];
        }
        else if (readingGuildOnlineMessage) {
            if (msg.includes('-') || msg.includes('Total Members') || msg.includes('Online Members')) return;
            if (msg.match(/^Offline Members: \d+/)) {
                readingGuildOnlineMessage = false;
                players = onlineMessageArray.join(" ").match(/(?:\[\S+\] )?(\S+)/g);
                ws.send(JSON.stringify({
                    type: 'playerListChange',
                    player: bot.username,
                    difference: players.length,
                    players: players
                }))
                return;
            }
            onlineMessageArray.push(msg.replaceAll('●', ' '));
        }
    })

    bot.on('kicked', ws.close);
    bot.on('error', ws.close);
    bot.on('end', ws.close);

    return bot;
    
}