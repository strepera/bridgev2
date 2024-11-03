function formatNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num;
}

const skillIcons = {
  'taming': '♣',
  'farming': '✿',
  'mining': '⸕',
  'combat': '❁',
  'foraging': '⸙',
  'fishing': 'α',
  'enchanting': '✎',
  'alchemy': '☕',
  'carpentry': '☖',
  'social': '℻'
} 

async function convertXPtoLevel(xpAmount, checkSkill) {
  let skill = checkSkill.toUpperCase();
  const response = await fetch('https://api.hypixel.net/resources/skyblock/skills');
  const json = await response.json();
  if (!json.skills[skill]) {
     console.error(`Skill "${skill}" not found in the response.`);
     return null;
  }
 
  let levels = json.skills[skill].levels.slice().reverse();
  for (let level of levels) {
     if (xpAmount >= level.totalExpRequired) {
        if (level.level == json.skills[skill].maxLevel) {
          let skillData = `${level.level} + ${formatNumber(xpAmount - level.totalExpRequired)}`;
          return skillData;
        }
        let skillData = level.level;
        return skillData;
     }
  }
  let skillData = json.skills[skill].maxLevel;
  return skillData;
 }
let skillStarted = false;

export default async function(bot, requestedPlayer, player, chat) {
  let requestedProfile;
  if (requestedPlayer.split(" ")[1]) requestedProfile = requestedPlayer.split(" ")[1];
  requestedPlayer = requestedPlayer.split(" ")[0];
  let playerSkills = {
    'taming': 0,
    'farming': 0,
    'mining': 0,
    'combat': 0,
    'foraging': 0,
    'fishing': 0,
    'enchanting': 0,
    'alchemy': 0,
    'carpentry': 0,
    'social': 0
  }
  const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json1 = await response1.json();
  let uuid = json1.id;
  requestedPlayer = json1.name;
  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
  const json2 = await response2.json();
  if (json2.success == true) {
    skillStarted = true;
    let members;
    for (let profile in json2.profiles) {
      if (typeof requestedProfile == 'string') {
        if (json2.profiles[profile].cute_name.toLowerCase() == requestedProfile.toLowerCase()) {
          members = json2.profiles[profile].members;
        }
      }
      else {
        if (json2.profiles[profile].selected == true) {
          members = json2.profiles[profile].members;
        }
      }
        for (let member in members) {
          if (members[member].player_id.replaceAll('-','') == uuid) {
            const memberData = members[member];
            for (let skill in memberData.player_data.experience) {
              for (let playerSkill in playerSkills) {
                const checkSkill = skill.split("").slice(6).join('').toLowerCase();
                if (checkSkill == playerSkill) {
                  const xpAmount = memberData.player_data.experience[skill];
                  const skillData = await convertXPtoLevel(xpAmount, checkSkill);
                  playerSkills[playerSkill] = skillData;
                  break;
                }
              }
            }
            let skillSum = 0;
            for (let skill in playerSkills) {
              if (skill == 'social') break;
              if (typeof playerSkills[skill] == 'string') {   
                skillSum += Number(playerSkills[skill].split(" ")[0]);
              }
              else {
                skillSum += playerSkills[skill];
              }
            }
            const skillAverage = Math.floor((skillSum / 9) * 100) / 100;
            let message = [`${requestedPlayer}'s skills ⚝ [` + Math.floor(members[member].leveling.experience / 100) + ']', '☯', skillAverage, '|'];
            for (let skill in playerSkills) {
              message.push(skillIcons[skill]);
              message.push(playerSkills[skill].toString()); 
            }
            if (skillStarted == true) {
              skillStarted = false;
              return (chat + message.join(" "));
            }
          }
        }
    }
  }
  else {
    return (chat + 'Invalid player.');
  }
}