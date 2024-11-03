const controller = new AbortController();
const signal = controller.signal;

export default async function(bot, requestedPlayer, player, chat) {
  const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/items');
  const data = await response.json();
  for (let item of data.items) {
      if (item.name.toLowerCase() === requestedPlayer) {
        return (`${chat}Wiki link: https://wiki.hypixel.net/${item.id}`);
      }
  }
  const lowercaseWikiPage = requestedPlayer.replaceAll(' ', '_');
  const words = lowercaseWikiPage.split("_");
  for (let i = 0; i < words.length; i++) {
   words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  const wikiPage = words.join("_");
  const wikiResponse = await fetch(`https://wiki.hypixel.net/${wikiPage}`, { signal });
  if (wikiResponse.status == 200) {
    return (`${chat}Wiki link: https://wiki.hypixel.net/${wikiPage}`);
  }
  else {
    const search = requestedPlayer.replaceAll(' ', '%20');
    return (`${chat}Wiki link: https://wiki.hypixel.net/?search=${search}`);
  }
}