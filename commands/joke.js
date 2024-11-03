export default async function(bot, requestedPlayer, player, chat) {
  const response = await fetch('https://soopy.dev/api/sbgBot/joke.json');
  const json = await response.json();

  return chat + json.data.setup + ' ' + json.data.punchline;
}
