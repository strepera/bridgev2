import { makeMineflayerBot } from "./mineflayer.js";

const bots = [
    {
        name: 'snolp',
        guild: 'Nope Ropes'
    },
    {
        name: 'salad03',
        guild: 'Danger Noodles'
    }
]

bots.forEach(obj => {
    const start = () => {
        setTimeout(() => {
            const bot = makeMineflayerBot(obj.name, obj.guild);
            bot.on('end', start);
        }, 5*60*1000);
    }
    const bot = makeMineflayerBot(obj.name, obj.guild);
    bot.on('end', start);
});