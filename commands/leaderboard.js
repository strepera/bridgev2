const guildData = {};

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num;
}

export default async function(bot, requestedPlayer, player, chatType) {
    function chat(message) {
        bot.chat(chatType + message);
        bot.lastMessage = (chatType + message);
    }

    const type = requestedPlayer.split(' ')[1];
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (!type) {
        return (chatType + "Invalid usage. .lb {player} {stat}");
    }

    const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const mojangData = await mojangResponse.json();
    const uuid = mojangData.id;
    requestedPlayer = mojangData.name;

    const guildResponse = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&player=${uuid}`);
    const guild = await guildResponse.json();

    if (!guild.success || !guild.guild) {
        return (chatType + "Invalid player.");
    }

    const guildName = guild.guild.name;
    if (!guildData[guildName]) {
        guildData[guildName] = {
            "members": guild.guild.members
        }
    }

    switch (type) {
        case "gexp":
            const memberGexp = {};
            for (const member of guildData[guildName].members) {
                memberGexp[member.uuid] = {
                    "exp": Object.values(member.expHistory).reduce((acc, curr) => acc + curr, 0)
                }
            }

            const response = await fetch(`https://api.mojang.com/user/profile/${uuid}`);
            const data = await response.json();
            const selectedPlayer = data.name;
            const selectedExp = memberGexp[uuid];

            const topExp = Object.entries(memberGexp)
                .sort(([, a], [, b]) => b.exp - a.exp)
                .slice(0, 3);

            for (const player of topExp) {
                const response = await fetch(`https://api.mojang.com/user/profile/${player[0]}`);
                const data = await response.json();
                player[0] = data.name;
            }
            const sortedEntries = Object.entries(memberGexp)
                .sort(([, a], [, b]) => b.exp - a.exp);

            let selectedPlayerPosition = -1;
            for (let i = 0; i < sortedEntries.length; i++) {
                if (sortedEntries[i][0] === uuid) {
                    selectedPlayerPosition = i + 1;
                    break;
                }
            }

            let message = "";
            for (let i = 0; i < topExp.length; i++) {
                const playerData = topExp[i];
                const playerName = playerData[0];
                const playerExp = playerData[1].exp;
                const position = i + 1;
                const playerMessage = `${position}. ${playerName} ${formatNumber(playerExp)}`;

                message += playerMessage;

                if (i < topExp.length - 1) {
                    message += ", ";
                }
            }

            message += `, ${selectedPlayerPosition}. ${selectedPlayer} ${formatNumber(selectedExp.exp)}`;

            return (chatType + message);
        case "level":
            if (!guildData[guildName].levels) {
                guildData[guildName].levels = {};
                chat("Please wait... Initializing level data for the first time.");
                for (const member of guildData[guildName].members) {
                    const response = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${member.uuid}`);
                    const data = await response.json();
                    let profile;
                    for (const profileObj of data.profiles) {
                        if (profileObj.selected == true) {
                            profile = profileObj;
                        }
                    }

                    const playerData = profile.members[member.uuid];

                    const level = playerData.leveling.experience / 100;
                    guildData[guildName].levels[member.uuid] = level;
                }
                console.log(guildData[guildName].levels);
            }

            const levelsArray = Object.entries(guildData[guildName].levels).sort((a, b) => b[1] - a[1]);
            const firstThreeEntries = levelsArray.slice(0, 3);
            for (const entry of firstThreeEntries) {
                const response = await fetch(`https://api.mojang.com/user/profile/${entry[0]}`);
                const data = await response.json();
                entry[0] = data.name;
            }

            let player4;
            for (const player of levelsArray) {
                if (player[0] == uuid) {
                    player4 = `${Number(levelsArray.indexOf(player)) + 1}. ${requestedPlayer} [${player[1]}]`;
                }
            }

            const player1 = `1. ${firstThreeEntries[0][0]} [${firstThreeEntries[0][1]}]`;
            const player2 = `2. ${firstThreeEntries[1][0]} [${firstThreeEntries[1][1]}]`;
            const player3 = `3. ${firstThreeEntries[2][0]} [${firstThreeEntries[2][1]}]`;

            return (`${chatType}${player1}, ${player2}, ${player3}, ${player4}`);
        default:
            return (chatType + "Invalid usage. .lb {player} {stat}");
    }
}