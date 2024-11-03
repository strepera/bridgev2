export default function help(bot, request, player, chatType) {
  request = request.split(' ')[0];
  const messages = {
    "1": (chatType + "8ball ai bedtime bingo cata cf class coinflip contest coop cosmetics dice discord pay essence event fetchur firesale fish fps gexp guild harp hotm help"),
    "2": (chatType + "info jacob joke leaderboard lbin math mayor mp networth online patchnotes players pristine profile random skills slayer speeds timer top uuid wiki"),
    "image": (chatType + "https://imgur.com/sTaVP3Z"),
    "8ball": (chatType + "Usage .8ball {question} | e.g. .8ball am i cool?"),
    "ai": (chatType + "Usage .ai {question}"),
    "bedtime": (chatType + "bedtime story..."),
    "bingo": (chatType + "Usage .bingo {player} | Shows player's bingo information"),
    "cata": (chatType + "Usage Use .help cata1 for cata info help, use .help cata2 for cata calc help."),
    "cata1": (chatType + "Usage .cata {player} | e.g. .cata snailify"),
    "cata2": (chatType + "Usage .cata {player} calc {level} {floor} {hecatomb/ring} | e.g. .cata snailify calc 50 m7 hecatomb ring"),
    "cf": (chatType + "Usage .cf {player} | Shows cf info for player"),
    "class": (chatType + "Usage .class {player} | e.g. .class snailify"),
    "coinflip": (chatType + "Usage .coinflip {amount} {heads/tails} | e.g. .coinflip 100 tails"),
    "contest": (chatType + "Usage .contest | Output | The next contest is {crop}, {crop}, {crop}. It will start in {minutes} minutes."),
    "coop": (chatType + "Usage .coop {player} | Shows coop members for player"),
    "dice": (chatType + "Usage .dice {amount} | e.g. .dice 100"),
    "discord": (chatType + "Usage .discord | Output | The discord link is https://discord.com/invite/VeB4Z9C"),
    "pay": (chatType + "Usage .pay {player} {amount} | e.g. .pay snailify 1000"),
    "essence": (chatType + "Usage. essence {player} | Shows essence types for player"),
    "event": (chatType + "Usage .event {jerry/spooky} | e.g. .event jerry"),
    "fetchur": (chatType + "Usage .fetchur | Fetchur's item"),
    "firesale": (chatType + "Usage .firesale | Shows info about the current firesale"),
    "fish": (chatType + "Usage .fish | Gives random amount of coins"),
    "fps": (chatType + "Usage .fps | Output | https://www.youtube.com/watch?v=io4wESYYBwk&t=7s"),
    "gexp": (chatType + "Usage .gexp {player} | e.g. .gexp snailify"),
    "guild": (chatType + "Usage .guild {player/guild} | e.g. .guild Nope Ropes"),
    "harp": (chatType + "Usage .harp {player} | Shows harp info for player"),
    "hotm": (chatType + "Usage .hotm {player} | Shows mining and hotm info for player"),
    "info": (chatType + "Usage .info {player} | e.g. .info snailify"),
    "jacob": (chatType + "Usage .jacob {player} | e.g. .jacob snailify"),
    "joke": (chatType + "Usage .joke | Output | (random setup then punchline)"),
    "leaderboard": (chatType + "Usage .lb {player in guild} {leaderboard type} | Types | gexp, nw, level"),
    "lbin": (chatType + "Usage .lbin {item} | Shows lowest bin for the item"),
    "math": (chatType + "Usage .math {question} | e.g. .math 5 x 6"),
    "mayor": (chatType + "Usage .mayor | Output | Current mayor and next mayor with perks"),
    "mp": (chatType + "Usage .mp {player} | e.g. .mp snailify"),
    "networth": (chatType + "Usage .networth {player} | e.g. .networth snailify"),
    "online": (chatType + "Usage .online {player} or .online | Output | {player} is in SKYBLOCK - {island} or the people online in the other guild."),
    "patchnotes": (chatType + "Usage .patchnotes | Output | (most recent patchnotes)"),
    "players": (chatType + "Usage .players | Output | (amount of players in each skyblock island)"),
    "pristine": (chatType + "Usage .pristine (pristine) (rolls (optional)) | Sends the chance for a pristine proc with the amount of pristine and rolls"),
    "profile": (chatType + "Usage .profile {player} {profile} | e.g. .profile snailify peach"),
    "random": (chatType + "Usage .random {number 1-15} | Output | (that many guild users)"),
    "skills": (chatType + "Usage .skills {player} {profile} | e.g. .skills snailify peach"),
    "slayer": (chatType + "Usage .slayer {player} {profile} | e.g. .slayer snailify peach"),
    "speeds": (chatType + "Usage .speeds {crop} | e.g. | .speeds wart"),
    "uuid": (chatType + "Usage .uuid {player} | Output | {player}'s uuid is {uuid}"),
    "wiki": (chatType + "Usage .wiki {item/npc/location/anything} | e.g. .wiki plasmaflux power orb")
  }
  if (messages[request]) {
    return messages[request];
  }
  else {
    return (chatType + 'Prefix "." | Use .help 1 or .help 2 to see command pages.');
  }
}