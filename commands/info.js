import Data from '../player_data_handler.js';

export default async function info(bot, player, placeholder, chat) {
    const d = Data.get(player.split(" ")[0]);
    if (!d) return chat + 'Player has no data.';
    return (`${chat}${d.username} has ${d.coins.toLocaleString()} coins and has sent ${Object.values(d.messages).reduce((a,b) => a+b, 0).toLocaleString()} messages`);
}