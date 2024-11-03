import fs from 'fs';

export default async function(bot, requestedPlayer, player, chat) {
    const payment = Number(requestedPlayer.split(' ')[1]);
    if (!payment) {
        return (chat + 'You need to pick an amount to donate! e.g. ".donate snailify 100"');
    }
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (requestedPlayer.trim() == '') {
        return (chat + 'You need to pick a player to donate to! e.g. ".donate snailify 100"');
    }
    const playerData = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
    const playerJson = JSON.parse(playerData);

    const requestData = await fs.promises.readFile(`bot/playerData/${requestedPlayer.toLowerCase()}.json`, 'utf8').catch(() => console.error(''));
    if (!requestData) return chat + 'Invalid player.';
    const requestedJson = JSON.parse(requestData);

    const playerObj = playerJson[player.toLowerCase()];
    const requestedPlayerObj = requestedJson[requestedPlayer.toLowerCase()];
    
    if (payment > playerObj.coins) {
      return (chat + 'You cannot donate more coins than you have!');
    }
    if (payment < 0) return chat + 'You cannot donate negative coins.';
    if (requestedPlayer.toLowerCase() == player.toLowerCase()) return 'You cannot donate to yourself!';
  
    playerObj.coins -= Math.floor(payment);
    requestedPlayerObj.coins += Math.floor(payment);

    playerJson[player.toLowerCase()] = playerObj;
    requestedJson[requestedPlayer.toLowerCase()] = requestedPlayerObj;

    fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(playerJson, null, 2));
    fs.writeFileSync(`bot/playerData/${requestedPlayer.toLowerCase()}.json`, JSON.stringify(requestedJson, null, 2));
  
    return (chat + 'You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
}
