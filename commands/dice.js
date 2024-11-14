import fs from 'fs';
import Data from '../player_data_handler.js';

export default async function(bot, bet, player, chat) {

    if (bet.trim() == '') {
        return (chat + 'You need to bet an amount! e.g. ".dice 100"');
    }

    if (bet.split(' ')[0].toLowerCase() === 'all') {
        bet = playerObj.coins;
    } else {
        bet = bet.split(' ')[0].replace(/[^0-9]/g, '');
    }

    if (Number(bet) < 100) {
        return (chat + 'You need to bet at least 100 coins! You have ' + playerObj.coins + ' coins.');
    }

    if (Number(bet) > playerObj.coins) {
        return (chat + 'You cannot bet more coins than you have! Your current balance is ' + playerObj.coins + ' coins.');
    }

    const dice1 = Math.round(Math.random() * (6 - 1) + 1);
    const dice2 = Math.round(Math.random() * (6 - 1) + 1);
    let reward = Math.round((dice1 + dice2 - 8) * Number(bet) / 60);

    Data.add(player, 'coins', Math.floor(reward));

    if (reward > 0) reward = '+' + reward;
    return (chat + 'The dice rolled ' + dice1 + ' + ' + dice2 + '. (' + reward + ')');
}