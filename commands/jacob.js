export default async function(bot, requestedPlayer, player, chat) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  let totalWeight;
  const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`)
  const json = await response.json();
  let uuid = json.id;
  requestedPlayer = json.name;

  let golds = 0;
  try {
  const response1 = await fetch(`https://api.elitebot.dev/Weight/${uuid}`);
  const json1 = await response1.json();
  let profileId = json1.selectedProfileId;
  for (let profile of json1.profiles) {
   if (profile.profileId === profileId) {
     totalWeight = Math.floor(profile.totalWeight);
     break;
   }
  }

  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
  const json2 = await response2.json();
  if (json2.success === true && json2.profiles !== null) {
    let selectedProfileId;
    let profileData;
    for (let profile of json2.profiles) {
      if (profile.selected === true) {
        selectedProfileId = profile.profile_id;
        profileData = profile.members[uuid];
        let seenCrops = [];
        const brackets = profileData.jacobs_contest.unique_brackets;
        for (const bracket in brackets) {
          if (bracket == 'gold' || bracket == 'platinum' || bracket == 'diamond') {
            for (const crop of brackets[bracket]) {
              if (!seenCrops.includes(crop)) {
                golds++;
                seenCrops.push(crop);
              }
            }
          }
        }
      }
    }
  }} catch(e) {
    console.error(e);
  }

  return (`${chat}Stats for ${requestedPlayer} | Weight ${totalWeight} | Unique Golds ${golds}/10`);
}
