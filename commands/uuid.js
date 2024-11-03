export default async function(bot, requestedPlayer, player, chat) {
  let message = "";
  await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`)
    .then((response) => response.json())
    .then((json) => {
      const uuid = json.id;
      message = (`${chat}${requestedPlayer}'s uuid is ${uuid}`);
  })
  return message;
}