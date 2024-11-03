const slayerIcons = {
  'wolf': '❂',
  'zombie': 'ௐ',
  'spider': '੭',
  'enderman': 'ᛃ',
  'blaze': '〣',
  'vampire': 'ჶ'
}

const slayerXpToLevel = {
  'zombie': [
    5,
    15,
    200,
    1000,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'spider': [
    5,
    25,
    200,
    1000,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'wolf': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'enderman': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'blaze': [
    10,
    30,
    250,
    1500,
    5000,
    20000,
    100000,
    400000,
    1000000
  ],
  'vampire': [
    20,
    75,
    240,
    840,
    2400
  ]
}

function formatNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num;
}

export default async function(bot, requestedPlayer, player, chat) {
  let slayerStarted = false;
  let requestedProfile;
  if (requestedPlayer.split(" ")[1]) requestedProfile = requestedPlayer.split(" ")[1];
  requestedPlayer = requestedPlayer.split(" ")[0];
  const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json1 = await response1.json();
  let uuid = json1.id;
  requestedPlayer = json1.name;
  const response0 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
  const json0 = await response0.json();
  if (json0.success == true) {
    let members;
    slayerStarted = true;
    for (let profile in json0.profiles) {
        if (typeof requestedProfile == 'string') {
          if (json0.profiles[profile].cute_name.toLowerCase() == requestedProfile.toLowerCase()) {
            members = json0.profiles[profile].members;
          }
        }
        else {
          if (json0.profiles[profile].selected == true) {
            members = json0.profiles[profile].members;
          }
        }
        for (let member in members) {
          if (members[member].player_id.replaceAll('-','') == uuid) {
            let sortOrder = ['zombie', 'spider', 'wolf', 'enderman', 'blaze', 'vampire'];
            const memberData = members[member];
            const slayerData = memberData.slayer.slayer_bosses;
            let slayerArray = [`${requestedPlayer}'s slayer |`];
            for (let i in memberData.slayer.slayer_bosses) {
              for (let slayerType in slayerData) {
                 if (slayerType == sortOrder[0]) {
                   let levels = slayerXpToLevel[slayerType].slice().reverse();
                   let slayerLevel = 0;
                   let isAboveHighestLevel = false;
                   for (let j in levels) {
                     if (slayerData[slayerType].xp >= levels[j]) {
                       let originalIndex = slayerXpToLevel[slayerType].indexOf(levels[j]);
                       let orderInNonReversedArray = slayerXpToLevel[slayerType].length - originalIndex;
                       slayerLevel = orderInNonReversedArray;
                       if (j == 0) {
                         isAboveHighestLevel = true;
                         slayerLevel = `${orderInNonReversedArray} + ${formatNumber(slayerData[slayerType].xp - levels[0])}`;
                       }
                       slayerArray.push(slayerIcons[slayerType], slayerLevel);
                       break;
                     }
                   }
                   if (isAboveHighestLevel && !slayerLevel.includes("+")) {
                    slayerLevel = `${orderInNonReversedArray} + ${formatNumber(slayerData[slayerType].xp - levels[0])}`;
                   }
                   sortOrder.shift();
                   delete slayerData.slayerType;
                   break;
                 }
              }
            }    
            if (slayerStarted == true) {        
              slayerStarted = false;
              return (chat + slayerArray.join(" "));
            }
          }
        }
    }
  }
}