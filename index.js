import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

console.log('Ready!');

const clients = {};

const onlinePlayers = new Set();

wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const uuid = Math.random().toString();
    const client = new Client(ws, ip, uuid);
    clients[uuid] = client;
    console.log(`${ip} connected (uuid: ${uuid})`);

    ws.on('eror', (err) => {
        delete clients[uuid];
        console.log(`${ip} disconnected with error: ${err} (uuid: ${uuid})`);
    })

    ws.on('close', (code) => {
        delete clients[uuid];
        console.log(`${ip} disconnected safely (${code}) (uuid: ${uuid})`);
    })
})

class Client {

    logWithUuid = (text, error) => {
        let colour = '32;1';
        if (error) colour = '31;1';
        console.log(`\x1b[${colour}m[${this.ip} ${this.uuid}]\n${text.split('\n').map(line => '\t' + line).join('\n')}\x1b[0m`);
    }

    constructor(ws, ip, uuid) {
        this.ws = ws;
        this.ip = ip;
        this.uuid = uuid;

        this.ws.on('message', (data) => {
            const json = JSON.parse(data);
            if (!this.identified && json?.type != 'init') {
                ws.close();
                this.logWithUuid('Error: Sent packet before identification\n' + data, true);
                return;
            }
            switch (json?.type) {

                case "init":
                    try {
                        if (!json.guild) throw Error('No guild specified');
                        if (!json.username) throw Error('No username specified');
                        this.guild = json.guild;
                        this.username = json.guild;
                        this.logWithUuid(`Set guild to ${this.guild}\nSet username to ${this.username}`);
                        this.identified = true;
                    }
                    catch(e) {
                        this.logWithUuid('Error: ' + e, true);
                        this.ws.close();
                    }
                    break;

                case "chat":
                    console.log(json.player + ': ' + json.message);
                    Object.entries(clients).forEach((arr) => {
                        if (arr[1].guild == this.guild) return;
                        arr[1].chat(json.player, json.message.substring(0, 240), this.guild);
                    })
                    break;

                case "playerListChange":
                    console.log(json.player + ' ' + (json.difference > 0? 'joined' : 'left'));
                    Object.entries(clients).forEach((arr) => {
                        if (arr[1].guild == this.guild) return;
                        let newList = json.players;
                        onlinePlayers.forEach(player => newList.push(player));
                        arr[1].ws.send(JSON.stringify({
                            type: 'playerListChange',
                            difference: json.difference,
                            player: json.player,
                            players: newList,
                            guild: this.guild
                        }));
                    })
                    break;

                case "command":
                    console.log('\x1b[33;1m[Command]\x1b[0m ' + json.player + ': ' + json.command + ' ' + json.args);
                    Object.entries(clients).forEach(async (arr) => {
                        let name = json.command;
                        if (aliases[name]) name = aliases[name];
                        const module = await import(`./commands/${name}.js`);
                        const func = module.default || module;
                        if (!func) return;
                        const result = await func(null, json.args, json.player, '');
                        if (!result) return;
                        arr[1].chat(json.player, result.substring(0, 240), this.guild);
                    })
                    break;

                default:
                    this.logWithUuid('Error: Sent invalid packet\n' + data, true);
                    break;

            }
        });
    }

    chat = (player, message, guild) => {
        this.ws.send(JSON.stringify({
            type: 'chat',
            player,
            message,
            guild
        }))
    }

}

const aliases = {
    'nw': 'networth',
    'speed': 'speeds',
    'spd': 'speeds',
    'plrs': 'players',
    'i': 'info',
    'd': 'dice',
    'dono': 'donate',
    'pay': 'donate',
    'stocks': 'stock',
    'lb': 'leaderboard',
    'skill': 'skills',
    'rep': 'reputation',
    'lbin': 'lowestbin'
};