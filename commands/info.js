import fs from 'fs';

export default async function info(bot, player, placeholder, chat) {
    try {
        player = player.split(' ')[0];
        const stat = await fs.promises.stat(`bot/playerData/${player.toLowerCase()}.json`);
        if (!stat.isFile()) {
            throw new Error('File does not exist');
        }
        const data = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
        const json = JSON.parse(data);
    
        player = player.split(' ')[0];
    
        if (!json[player.toLowerCase()]) { 
            return (chat + 'Invalid player.');
        }
            
        return (`${chat}${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
    }
    catch (error) {
        return chat + 'Player has no data.';
    }
}