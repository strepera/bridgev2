export default function speeds(bot, requestedCategory, player, chat) {
  let message;
  const aliases = {
    "crops": ["crops", "nether wart", "wart", "carrot", "potato", "wheat"],
    "sugarcane": ["cane", "sugar cane"],
    "cocoa": ["cocoa", "bean", "beans", "cocoa bean", "cocoa beans"],
    "cactus": ["cactus"],
    "mushroom": ["mushroom", "shroom", "mush"],
    "melon": ["melon"],
    "pumpkin": ["pumpkin", "pump"]
  };

  const category = Object.keys(aliases).find(key => aliases[key].includes(requestedCategory.toLowerCase()));

  switch (category) {
    case "crops":
      message = requestedCategory + " (✦93) (⇄90/180) (⇅0/3)";
      break;
    case "sugarcane":
      message = "Sugar Cane (✦328) (⇄135/45) (⇅0)";
      break;
    case "cocoa":
      message = "Cocoa Beans (✦155 ✖Sprint) (⇄90/180) (⇅45)";
      break;
    case "cactus":
      message = "Cactus (✦478) (⇄90/180) (⇅0)";
      break;
    case "mushroom":
      message = "Mushroom (✦233) (⇄120/60) (⇅0)";
      break;
    case "melon":
      message = "Melon (✦290) (⇄90/180) (⇅58/-58)";
      break;
    case "pumpkin":
      message = "Pumpkin (✦290) (⇄90/180) (⇅58/-58)";
      break;
    default:
      message = "Invalid category. Use .speeds {crops/cane/cocoa/cactus/mushroom/melon/pumpkin}.";
      break;
  }
  return (chat + message);
}
