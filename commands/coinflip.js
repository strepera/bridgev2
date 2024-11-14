import fs from 'fs';
import Data from '../player_data_handler.js';

export default async function(bot, bet, player, chat) {
  const side = bet.split(' ')[1];
  if (!side) {
      return (chat + 'You need to pick a side! e.g. ".coinflip 100 tails"');
  }
  bet = bet.split(' ')[0].replace(/[^0-9]/g, '');
  if (bet.trim() == '') {
    return (chat + 'You need to bet an amount! e.g. ".coinflip 100 tails"');
  }
  if (Number(bet) < 100 || Number(bet) < 0) {
    return (chat + 'You need to bet at least 100 coins!');
  }
  if (Number(bet) > playerObj.coins) {
    return (chat + 'You cannot bet more coins than you have!');
  }

  const coin = Math.random() > 0.5 ? 'heads' : 'tails';

  if (side == 'heads' || side == 'tails') {
    if (coin == side) {
        var reward = bet / 2;
    }
    else {
        var reward = bet / 2 * -1;
    }
  }
  else {
    return (chat + 'Pick heads or tails!');
  }

  Data.add(player, 'coins', Math.floor(reward));

  if (reward > 0) reward = '+' + reward;
  return (chat + 'The coin flipped ' + coin + '. You chose ' + side + ' (' + reward + ')');
}
