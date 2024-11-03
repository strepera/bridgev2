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

function average(object) {
    let total = 0;
    for (const value of object) {
        total += value.experience;
    }
    return (total / object.length).toFixed(2);
}

export default async function(bot, requestedPlayer, player, chat) {
    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return (chat + "Invalid player.");
    let profileData;
    for (const profile of dataJson.profiles) {
      if (profile.selected) profileData = profile.members[uuid];
    }

    let classes = profileData.dungeons.player_classes;
    
    Object.keys(classes).forEach(classType => {
        const classObj = classes[classType];
        classObj.experience = Math.round(experienceToLevel.reduce((acc, val, idx) => {
            if (classObj.experience >= val && classObj.experience < experienceToLevel[idx + 1]) {
                return idx + ((classObj.experience - val) / (experienceToLevel[idx + 1] - val));
            }
            return acc;
        }) * 100) / 100;
    });

    const classAverage = average(Object.values(classes));

    return (`${chat}${requestedPlayer}'s classes | Avg: ${classAverage} ⚚ ${classes.healer.experience} ⚡ ${classes.mage.experience} ☄ ${classes.berserk.experience} ➶ ${classes.archer.experience} ⚓ ${classes.tank.experience}`);
}
  