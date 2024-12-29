import dotenv from 'dotenv';
dotenv.config({ path: './.env'});
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3000 });
import Data from './player_data_handler.js';
Data.init();

import games from './chat_games.js';
let currentGame;

setTimeout(() => {
    setInterval(async () => {
        const game = games[Math.floor(Math.random()*games.length)];
        currentGame = game;
        currentGame.asked = Date.now();
        const question = await game.getQuestion();
        Object.entries(clients).forEach((arr) => {
            arr[1].chat("Game", question, arr[1].guild, arr[1].prefix);
        })
        setTimeout(() => {
            if (!currentGame) return;
            currentGame = null;
            Object.entries(clients).forEach((arr) => {
                arr[1].chat("Game", game.timeout(), arr[1].guild, arr[1].prefix);
            })
        }, 30*1000);
    }, 30*60*1000);
}, (Math.floor(Date.now()/1000/3600+1)*1000*3600) - Date.now());

const playerSpamFilter = {};
const checkSpam = (player) => {
    if (!playerSpamFilter[player]) playerSpamFilter[player] = {
        msgs: 0,
        time: Date.now()
    }
    playerSpamFilter[player].msgs++;
    if (playerSpamFilter[player].msgs >= 4) {
        if (Date.now() - playerSpamFilter[player].time < 6000) {
            Object.values(clients).forEach(client => {
                client.ws.send(JSON.stringify({
                    type: 'mute',
                    player: player,
                    duration: 6000 - (Date.now() - playerSpamFilter[player].time),
                    reason: "Spam"
                }))
            })
        }
        else {
            playerSpamFilter[player] = {
                msgs: 0,
                time: Date.now()
            }
        }
    }
}

const clients = {};

let onlinePlayers = [];

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

        this.ws.on('message', async (data) => {
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
                        if (!json.prefix) this.prefix = json.guild;
                        else this.prefix = json.prefix;
                        this.guild = json.guild;
                        this.username = json.username;
                        this.logWithUuid(`Set guild to ${this.guild}\nSet username to ${this.username}`);
                        this.identified = true;
                    }
                    catch(e) {
                        this.logWithUuid('Error: ' + e, true);
                        this.ws.close();
                    }
                    break;

                case "chat":
                    if (currentGame && currentGame.checkAnswer(json.message)) {
                        Data.add(json.player, 'coins', 2500);
                        Object.entries(clients).forEach((arr) => {
                            arr[1].chat(json.player, `${json.player} won in ${Date.now() - currentGame.asked}ms`, this.guild, this.prefix);
                        })
                        currentGame = null;
                    }
                    checkSpam(json.player);
                    Data.add(json.player, 'coins', 15);
                    Data.add(json.player, 'messages', 1);
                    console.log(json.player + ': ' + json.message);
                    Object.entries(clients).forEach((arr) => {
                        if (arr[1].guild == this.guild) return;
                        arr[1].chat(json.player, json.message.substring(0, 240), this.guild, this.prefix);
                    })
                    break;

                case "playerListChange":
                    const joinedorleft = (json.difference > 0? 'joined' : 'left');
                    console.log(json.player + ' ' + joinedorleft);
                    json.players.forEach(player => onlinePlayers.push(player));
                    onlinePlayers = onlinePlayers.filter((name, index) => {
                        if (json.difference < 0 && name == json.player) return false;
                        return onlinePlayers.filter(n => n == name).length == 1 || onlinePlayers.indexOf(name) == index;
                    });
                    Object.entries(clients).forEach((arr) => {
                        if (arr[1].guild == this.guild) return;
                        arr[1].ws.send(JSON.stringify({
                            type: 'playerListChange',
                            difference: json.difference,
                            player: json.player,
                            players: onlinePlayers,
                            guild: this.guild,
                            prefix: this.prefix
                        }));
                    })
                    break;

                case "command":

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

                    let name = json.command;
                    if (aliases[name]) name = aliases[name];
                    const module = await import(`./commands/${name}.js`).catch(e => console.error('Unknown command: ' + json.command));
                    const func = module?.default || module;
                    if (!func) return;
                    if (!json.args) json.args = json.player;
                    console.log('\x1b[33;1m[Command]\x1b[0m ' + json.player + ': ' + json.command + ' ' + json.args);
                    const result = await func(null, json.args, json.player, '');
                    if (!result) return;
                    Object.entries(clients).forEach(async (arr) => {
                        arr[1].chat(json.player, result.substring(0, 240), this.guild, this.prefix);
                    })
                    break;

                case "say":
                    Object.values(clients).forEach(client => {
                        if (client.guild.toLowerCase() !== json.guild.toLowerCase()) return;
                        client.ws.send(JSON.stringify({
                            type: 'say',
                            message: json.message
                        }))
                    })
                    break;

                case "event":
                    Object.values(clients).forEach(client => {
                        if (client.guild == this.guild) return;
                        client.ws.send({
                            type: "event",
                            event_type: json.event_type,
                            message: json.message,
                            player: json.player
                        })
                    })

                default:
                    this.logWithUuid('Error: Sent invalid packet\n' + data, true);
                    break;

            }
        });
    }

    chat = (player, message, guild, prefix) => {
        this.ws.send(JSON.stringify({
            type: 'chat',
            player,
            message,
            guild,
            prefix
        }))
    }

}