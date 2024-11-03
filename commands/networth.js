import skyhelper from 'skyhelper-networth'

function formatNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num.toFixed(2);
}

async function getNetworth(bot, requestedPlayer, player, chat) {
  let uuid;
  try {
  const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json1 = await response1.json();
  uuid = json1.id;
  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
  const json2 = await response2.json();
  if (json2.success === true && json2.profiles !== null) {
    let selectedProfileId;
    let profileData;
    let bankBalance;
    for (let profile of json2.profiles) {
      if (profile.selected === true) {
        selectedProfileId = profile.profile_id;
        profileData = profile.members[uuid];
        bankBalance = profile.banking?.balance;
        break;
      }
    }
    if (selectedProfileId === undefined) return
    const museumResponse = await fetch(`https://api.hypixel.net/v2/skyblock/museum?key=${process.env.apiKey}&uuid=${uuid}&profile=${selectedProfileId}`);
    const museumJson = await museumResponse.json();
    const museumData = museumJson.members[uuid];
    const longNetworthObj = await skyhelper.getNetworth(profileData, bankBalance, { v2Endpoint: true, cache: false, onlyNetworth: false, museumData});
    const networth = await skyhelper.getNetworth(profileData, bankBalance, { v2Endpoint: true, onlyNetworth: true, museumData });
    let num = parseInt(networth.networth.toLocaleString().replace(/,/g, ""));
    let shortenedNetworth = `${Math.round(networth.networth.toLocaleString())} (${formatNumber(num)})`;
    let lengthenedNetworth = Math.round(networth.networth).toLocaleString();
    lengthenedNetworth = lengthenedNetworth.replaceAll(",", " ");
    const equipment = formatNumber(longNetworthObj.types.armor.total + longNetworthObj.types.equipment.total + longNetworthObj.types.wardrobe.total);
    const purse = formatNumber(longNetworthObj.purse);
    const bank = formatNumber(longNetworthObj.bank);
    const essence = formatNumber(longNetworthObj.types.essence.total);
    const items = formatNumber(longNetworthObj.types.inventory.total + longNetworthObj.types.enderchest.total + longNetworthObj.types.personal_vault.total
       + longNetworthObj.types.fishing_bag.total + longNetworthObj.types.potion_bag.total + longNetworthObj.types.candy_inventory.total);
    const pets = formatNumber(longNetworthObj.types.pets.total);
    const accessories = formatNumber(longNetworthObj.types.accessories.total);
    const museum = formatNumber(longNetworthObj.types.museum.total);
    const breakdown = `Purse: ${purse} Bank: ${bank} Essence: ${essence} Equipment: ${equipment} Items: ${items} Pets: ${pets} Accessories: ${accessories} Museum: ${museum}`;
    return (`${chat}${requestedPlayer}'s networth${shortenedNetworth.replaceAll('NaN', '')} ${breakdown}`);
  }
  else {
    return (chat + "Invalid user " + requestedPlayer);
  }
  } catch (error) {
  console.error('Error:', error);
  }
}

export default async function(bot, requestedPlayer, player, chat) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  requestedPlayer = requestedPlayer.replaceAll("\\", "");
  let message = '';
  if (requestedPlayer.includes("/")) {
    let requestedPlayers = requestedPlayer.split("/");
    for (let requestedPlayer in requestedPlayers) {
      requestedPlayer = requestedPlayers[requestedPlayer];
      message = await getNetworth(bot, requestedPlayer, player, chat);
    }
  }
  else {
    message = await getNetworth(bot, requestedPlayer, player, chat);
  }
  return message;
}