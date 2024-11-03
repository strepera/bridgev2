function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
}

export default async function(bot, requestedItem, player, chat) {
    const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/items');
    const data = await response.json();
    for (let item of data.items) {
        if (item.name.toLowerCase() === requestedItem) {
            const response = await fetch('http://moulberry.codes/lowestbin.json');
            const data = await response.json();
            return (`${chat}${item.name}'s lowest bin is ${formatNumber(data[item.id])} coins.`);
        }
    }
    return chat + 'Invalid item.';
}