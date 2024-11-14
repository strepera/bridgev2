const readability = {
  'farming_1': 'Barn Islands',
  'foraging_1': 'Park',
  'mining_1': 'Gold Mine',
  'mining_2': 'Deep Caverns',
  'mining_3': 'Dwarven Mines',
  'combat_1': "Spider's Den",
  'combat_3': 'End',
  'dynamic': 'Private Island'
}

function getTimeRemaining(endtime){
  const total = Date.now() / 1000 - endtime;
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );
 
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

import { bot as main } from '../../index.js';
import { branch as branch } from '../../index.js';
import { joins, leaves } from '../bot.js';

export default async function(bot, requestedPlayer, player, chat) {
  if (requestedPlayer == player) {
    if (bot.username == process.env.botUsername1) {
      branch.chat('/g online');
      branch.lastMessage = '/g online';
    }
    else {
      main.chat('/g online');
      main.lastMessage = '/g online';
    }
    async function checkOnlineEmbed() {
      if (global.onlineEmbed != undefined) {
        bot.chat(chat + global.onlineEmbed.name + ' (' + global.onlineEmbed.online + '/' + global.onlineEmbed.total + ')');
        bot.lastMessage = (chat + global.onlineEmbed.name + ' (' + global.onlineEmbed.online + '/' + global.onlineEmbed.total + ')');
        bot.chat('/t ' + player + ' Players: ' + global.onlineEmbed.players.join(', '));
        bot.lastMessage = ('/t ' + player + ' Players: ' + global.onlineEmbed.players.join(', '));
        delete global.onlineEmbed;
        return;
      }
      else {
        setTimeout(async () => {
          checkOnlineEmbed();
        }, 500);
      }
    }
    checkOnlineEmbed();
    return;
  }
  let uuid;
  requestedPlayer = requestedPlayer.split(' ')[0];
  const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json1 = await response1.json();
  uuid = json1.id;
  requestedPlayer = json1.name;
  const response2 = await fetch(`https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=${uuid}`);
  const json2 = await response2.json();
  if (!json2.success) return (chat + 'Invalid player.');
  try {
    let lastOnline = "";
    if (leaves[requestedPlayer]) {
      if (joins[requestedPlayer] > leaves[requestedPlayer]) {
        lastOnline = ' (offline mode)';
      }
      else {
        lastOnline = ', last online ' + ((Date.now() - leaves[requestedPlayer]) / 3600000).toFixed(2) + ' hours ago';
      }
    }
    if (!json2.session.gameType) return (`${chat}${requestedPlayer} is offline${lastOnline}`);
    let gameType = json2.session.gameType;
    let mode = json2.session.mode;
    if (readability[mode]) {
      mode = readability[mode];
    }
    mode = mode.replaceAll('_', ' ');
    let modeParts = mode.split(' ');
    for (let part in modeParts) {
        modeParts[part] = modeParts[part][0].toUpperCase() + modeParts[part].slice(1);
    }
    mode = modeParts.join(' ');
    return (`${chat}${requestedPlayer} is in ${gameType} - ${mode}`);
  }
  catch(e) {
    console.error(e);
  }
}
