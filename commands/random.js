export default async function(bot, requestedPlayer, player, chat) {
  if (requestedPlayer > 15) {
    return (chat + 'Request exceeds maximum limit of 15 users.');
  }
  const response = await fetch(`https://api.hypixel.net/guild?key=${process.env.apiKey}&id=5d072c6b77ce842c1e4df9ea`); // nope ropes guild id
  const guildResponse = await response.json();
  const members = guildResponse.guild.members;
  let randomMembers = [];
 
  for(let i = 0; i < requestedPlayer; i++) {
    const randomMemberUuid = members[Math.floor(Math.random() * members.length)].uuid;
    const response = await fetch(`https://api.mojang.com/user/profile/${randomMemberUuid}`);
    const userResponse = await response.json();
    randomMembers.push(userResponse.name);
  }
  return (`${chat}Random users are ${randomMembers.join(', ')}`);
}