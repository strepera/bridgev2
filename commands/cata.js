export default async function(bot, requestedPlayer, player, chat, match) {
  let calculating = false;
  const experienceToLevel = [
    0,
    50,                 
    125,                
    235,                
    395,                
    625,                
    955,                
    1425,               
    2095,               
    3045,               
    4385,   
    6275,   
    8940,   
    12700,  
    17960,  
    25340,  
    35640,  
    50040,  
    70040,  
    97640,  
    135640, 
    188140, 
    259640, 
    356640, 
    488640, 
    668640, 
    911640, 
    1239640,
    1684640,
    2284640,
    3084640,
    4149640,
    5559640,
    7459640,
    9959640,
    13259640,
    17559640,
    23159640,
    30359640,
    39559640,
    51559640,
    66559640,
    85559640,
    109559640,
    139559640,
    177559640,
    225559640,
    285559640,
    360559640,
    453559640,
    569809640
  ]
    const playerMatch = requestedPlayer.split(" ");
    requestedPlayer = playerMatch[0];
    let requestedFloor;
    let floorType;
    let requestedLevel;
    let ring = false;
    let hecatomb = false;
    if (playerMatch.includes('ring')) {
      ring = true;
    }
    if (playerMatch.includes('hecatomb')) {
      hecatomb = true;
    }
    if (playerMatch[1] == 'calc') {
      requestedLevel = playerMatch[2];
      requestedFloor = playerMatch[3];
      calculating = true;
      if (!requestedLevel) {
        return (chat + 'Invalid syntax. (cata {player} calc {level} {floor} (hecatomb or ring)');
      }
    } 
    if (requestedPlayer.split(" ")[0] == 'calc') {
      try {
      requestedPlayer = match[3];
      requestedLevel = playerMatch[1];
      requestedFloor = playerMatch[2];
      calculating = true;
      if (!requestedLevel) {
        return (chat + 'Invalid syntax. (cata {player} calc {level} {floor} (hecatomb or ring)');
     }
    }
    catch (e) {
        console.error(e);
    }
    }
    let uuid;
    const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const json1 = await response1.json();
    uuid = json1.id;
    requestedPlayer = json1.name;
    try {
      const response1 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
      const json1 = await response1.json();
      if (json1.success === true && json1.profiles !== null) {
        let completionBonus;
        let selectedProfileId;
        let cataExperience;
        let cataLevel;
        let secretsFound = 0;
        for (let profile of json1.profiles) {
          if (profile.selected === true) {
            selectedProfileId = profile.profile_id;
            cataExperience = profile.members[uuid].dungeons.dungeon_types.catacombs.experience;
            secretsFound = profile.members[uuid].dungeons.secrets;
            cataLevel = Math.round(experienceToLevel.reduce((acc, val, idx) => {
              if (cataExperience >= val && cataExperience < experienceToLevel[idx + 1]) {
                  return idx + ((cataExperience - val) / (experienceToLevel[idx + 1] - val));
              }
              return acc;
          }) * 100) / 100;
          if (calculating == true) {
            floorType = requestedFloor.split('')[0];
            if (requestedFloor == 'entrance') {
            completionBonus = profile.members[uuid].dungeons.dungeon_types.catacombs.tier_completions[0] * 2;
            }
            else if (floorType == 'f') {
            const floor = requestedFloor.split('f');
            if (!profile.members[uuid].dungeons.dungeon_types.catacombs.tier_completions[floor[1]] == NaN) {
            completionBonus = profile.members[uuid].dungeons.dungeon_types.catacombs.tier_completions[floor[1]] * 2;
            }
            else {
              completionBonus = 0;
            }
            }
            else if (floorType == 'm') {
            const floor = requestedFloor.split('m');
            if (!profile.members[uuid].dungeons.dungeon_types.master_catacombs.tier_completions[floor[1]] == NaN) {
            completionBonus = profile.members[uuid].dungeons.dungeon_types.master_catacombs.tier_completions[floor[1]] * 2;
            }
            else {
              completionBonus = 0;
            }
            }
            }
            if (cataLevel === 51) {cataLevel = 50}
            if (selectedProfileId === undefined) {return}
            break;
          }
        }
        if (calculating == true) {
          let baseExp = {
            'entrance': 50,
            'f1': 80,
            'f2': 160,
            'f3': 400,
            'f4': 1420,
            'f5': 2400,
            'f6': 5000,
            'f7': 28000,
            'm1': 10000,
            'm2': 14444,
            'm3': 35000,
            'm4': 61111,
            'm5': 70000,
            'm6': 100000,
            'm7': 300000
          };
          if (completionBonus > 50) {
            completionBonus = 50;
          }
          let bonus = 1 + (completionBonus / 100);
          if (ring == true) {
            bonus += 0.02;
          }
          if (hecatomb == true) {
            bonus += 0.1;
          }
          const expDifference = experienceToLevel[requestedLevel] - cataExperience;
          const requiredFloors = Math.floor(expDifference / (baseExp[requestedFloor] * bonus));
          calculating = false;
          return (`${chat}${requestedPlayer} needs ${requiredFloors} ${requestedFloor} runs to get from cata ${cataLevel} to ${requestedLevel}.`);
        }
        else {
        const response2 = await fetch(`https://api.hypixel.net/v2/player?key=${process.env.apiKey}&uuid=${uuid}`);
        const json2 = await response2.json();
        let totalSecretsFound = json2.success === true && json2.profiles !== null ? json2.player.achievements.skyblock_treasure_hunter : 0;
        return (`${chat}${requestedPlayer} ⚔${cataLevel}, ${secretsFound} secrets. [${totalSecretsFound} total]`);
        }
      }
      else {
        return (chat + "Invalid user " + requestedPlayer);
      }
    } catch (error) {
      console.error('Error:', error);
    }
   }
