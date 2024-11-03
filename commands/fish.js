import fs from 'fs';

const cooldowns = {};

function ranRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const worthList = {
    'fish': () => {return ranRange(20, 100)},
    'creature': () => {return ranRange(200, 500)},
    'trash': () => {return ranRange(1, 5)},
    'jackpot': () => {return ranRange(2000, 3000)},
    'superpot': () => {return ranRange(5000, 10000)}
}

const nameList = {
    'fish': ['Salmon', 'Cod', 'Clownfish', 'Squid', 'Eel', 'Pufferfish'],
    'creature': ['Sea Walker', 'Sea Guardian', 'Sea Witch', 'Sea Archer', 'Rider of the Deep', 'Catfish'],
    'trash': ['Seaweed', 'Old Boot', 'Empty Tin Can'],
    'jackpot': ['Jackpot'],
    'superpot': ['Super Jackpot']
}

export default async function fish(bot, request, player, chat) {

    function msg(message) {
        bot.chat(chat + message);
        bot.lastMessage = (chat + message);
    }

    const cooldown = Date.now() - cooldowns[player];

    if (cooldown < 10 * 60 * 1000) {
        const remainingSeconds = Math.ceil((10 * 60 * 1000 - cooldown) / 1000);
        return (`${chat}Sorry ${player}, the pond is empty! Please wait ${remainingSeconds} seconds to fish again.`);
    }

    cooldowns[player] = Date.now();

    const fishAmount = ranRange(5, 7);
    let results = [];

    for (let i = 0; i < fishAmount; i++) {
        const randomValue = Math.random();
        let type;
        if (randomValue < 0.6) {
            type = 'fish';
        } else if (randomValue < 0.84) {
            type = 'creature';
        } else if (randomValue < 0.9968) {
            type = 'trash';
        } else if (randomValue < 0.9976) {
            type = 'jackpot';
        } else {
            type = 'superpot';
        }
        results.push({
            type: type,
            worth: worthList[type](),
            name: nameList[type][ranRange(0, nameList[type].length - 1)]
        })
    }

    let message = [];
    let total = 0;
    for (const result of results) {
        message.push(result.name + ' [' + result.worth + ']');
        total += result.worth;
    }
    setTimeout(() => {
        bot.chat("/t " + player + " You caught: " + message.join(' '));
        bot.lastMessage = ("/t " + player + " You caught: " + message.join(' '));
    }, 1000);

    const data = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
    const json = JSON.parse(data);
    const playerObj = json[player.toLowerCase()];
    playerObj.coins += total;

    fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(json, null, 2));

    return (chat + "Fished " + fishAmount + ' times!');
}