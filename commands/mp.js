export default async function(bot, requestedPlayer, player, chat) {
    try {
  requestedPlayer = requestedPlayer.split(" ")[0];
  const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`)
  const json0 = await response0.json();
  let uuid = json0.id;
  requestedPlayer = json0.name;

  let profileName;
  const response1 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`)
  const json1 = await response1.json();
  if (json1.success == true) {
      for (let profile of json1.profiles) {
          if (profile.selected == true) {
              profileName = profile.cute_name;
          }
      }
  }

  let rarityValues = {
      "special": 3,
      "very_special": 5,
      "common": 3,
      "uncommon": 5,
      "rare": 8,
      "epic": 12,
      "legendary": 16,
      "mythic": 22
  }
  let totalValue = 0;
  let message = '';
  const response2 = await fetch(`https://sky.shiiyu.moe/api/v2/talismans/${requestedPlayer}/${profileName}`)
  const json2 = await response2.json();
  if (json2.accessories.accessory_rarities) {
      let accessories = json2.accessories.accessory_rarities;

      for (let accessory in accessories) {
          if (rarityValues[accessory]) {
              let accessoryType = accessory;
              let accessoryAmount = accessories[accessory];
              if (accessoryType == null || accessory == 'abicase') {
                  totalValue += 0;
              } else if (accessories[accessory] == true) {
                  totalValue += 8;
              } else {
                  totalValue += rarityValues[accessoryType] * accessoryAmount;
                  message += `${accessoryType} ${rarityValues[accessoryType] * accessoryAmount} `;
              }
          }
      }
  }
  return (`${chat}${requestedPlayer}'s MP is ${totalValue} | ${message}`);
}
catch(e) {
    console.error(e);
}
}
