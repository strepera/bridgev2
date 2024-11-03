function getTopCandidate(data) {
  let sortedMayors = data.sort((a, b) => b.votes - a.votes);
  sortedMayors[0].perks = sortedMayors[0].perks.map(perk => perk.name).join(", ").replace(/EZPZ/g, 'E ZPZ');
  sortedMayors[1].perks = sortedMayors[1].perks.map(perk => perk.name).join(", ").replace(/EZPZ/g, 'E ZPZ');
  return {mayor: sortedMayors[0], minister: sortedMayors[1]};
}

export default async function(bot, requestedPlayer, player, chat) {
  const response = await fetch(`https://api.hypixel.net/v2/resources/skyblock/election`);
  const json = await response.json();
  if (!json.current) {
    const top = getTopCandidate(json.mayor.election.candidates);
    return (`${chat}Mayor ${top.mayor.name} (${top.mayor.perks}) | Minister ${top.minister.name} (${top.minister.perks})`);
  }
  else {
    const nextMayorYear = json.current.year;
    const multipliedTime = nextMayorYear * 446400; // 446400 = 5 days 4 hours
    const addedTime = multipliedTime + 1560275700 + 108000;
    const date = new Date(addedTime * 1000);
    const now = new Date();
    const timeRemaining = date.getTime() - now.getTime();
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const top = getTopCandidate(json.current.candidates);
    return (`${chat}Mayor ${json.mayor.name} | Election (${days}d ${hours}h): Mayor ${top.mayor.name} (${top.mayor.perks}) Minister ${top.minister.name} (${top.minister.perks})`);
  }
}