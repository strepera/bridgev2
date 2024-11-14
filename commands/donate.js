import fs from 'fs';
import Data from '../player_data_handler.js';

export default async function(bot, requestedPlayer, player, chat) {
    const payment = Number(requestedPlayer.split(' ')[1]);
    if (!payment) {
        return (chat + 'You need to pick an amount to donate! e.g. ".donate snailify 100"');
    }
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (requestedPlayer.trim() == '') {
        return (chat + 'You need to pick a player to donate to! e.g. ".donate snailify 100"');
    }

    const initiatingPlayerData = Data.get(player);
    const requestedPlayerData = Data.get(requestedPlayer);
    if (!Data.get(requestedPlayer)) return chat + 'Invalid player.';
    
    if (payment > initiatingPlayerData.coins) {
      return (chat + 'You cannot donate more coins than you have!');
    }
    if (payment < 0) return chat + 'You cannot donate negative coins.';
    if (requestedPlayer.toLowerCase() == player.toLowerCase()) return 'You cannot donate to yourself!';
  
    Data.add(player, 'coins', Math.floor(payment) *-1);
    Data.add(requestedPlayer, 'coins', Math.floor(payment));
  
    return (chat + 'You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
}
