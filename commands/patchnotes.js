export default async function(bot, requestedPlayer, player, chat) {
  let message = "";
  await fetch(`https://api.hypixel.net/v2/skyblock/news?key=${process.env.apiKey}`)
  .then((response) => response.json())
  .then((json) => {
    message = (chat + json.items[0].link);
  })
  return message;
}