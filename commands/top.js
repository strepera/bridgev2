import fs from "fs";

export default async function(bot, requested = 0, player, chat) {
    requested = parseInt(requested.split(" ")[0]);
    if (!requested) requested = 0;
    let data = [];
    const read = fs.readdirSync("bot/playerData");
    for (const file of read) {
        data.push(Object.values(JSON.parse(fs.readFileSync("bot/playerData/" + file)))[0]);
    }

    const sortedEntries = data.sort((a, b) => b.coins - a.coins);
    const top3Users = sortedEntries.slice(requested * 3, requested * 3 + 3);

    let message = [];
    for (const i in top3Users) {
        message.push(`${Number(i) + 1 + requested * 3}. ${top3Users[i].username} $${top3Users[i].coins}, ${top3Users[i].messageCount} msgs`);
    }
    return (chat + message.join(', '));
}