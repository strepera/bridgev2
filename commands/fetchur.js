const items = [
    "20x Yellow Stained Glass",
    "1x Compass",
    "20x Mithril",
    "1x Firework Rocket",
    "1x Cheap Coffee, Decent Coffee, or Black Coffee",
    "1x Iron Door or Wood Door",
    "3x Rabbit's Foot",
    "1x Superboom TNT",
    "1x Pumpkin",
    "1x Flint and Steel",
    "50x Emerald",
    "50x Red Wool"
];

function calculateCycleIndex(time) {
    return Math.floor((time / 86400) % items.length);
}

function calculateTimeRemaining(time) {
    const currentDay = time / 86400;
    const nextDay = Math.floor(time / 86400) + 1;
    return Math.floor(((nextDay - currentDay) * 86400))
}

export default async function(bot, requestedPlayer, player, chat) {
    const estNow = Date.now() / 1000 - 18000;
    let cycleIndex = calculateCycleIndex(estNow);
    const remaining = Math.floor(calculateTimeRemaining(estNow) / 3600);

    if (cycleIndex > items.length) {
        cycleIndex = cycleIndex - items.length + 1;
    }
    const currentItem = items[cycleIndex - 3];

    return (`${chat}Fetchur currently wants ${currentItem}. Changes in ${remaining} hours.`);
}