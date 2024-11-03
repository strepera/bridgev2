function getTimeLeft(time) {
    let weeks = Math.floor(time / 604800);
    let days = Math.floor((time % 604800) / 86400);
    let hours = Math.floor(((time % 604800) % 86400) / 3600);
    let minutes = Math.floor((((time % 604800) % 86400) % 3600) / 60);
    let seconds = Math.floor((((time % 604800) % 86400) % 3600) % 60);
  
    if (weeks >= 1) return `${weeks} weeks ${days} days`;
    if (days >= 1) return `${days} days ${hours} hours`;
    if (hours >= 1) return `${hours} hours ${minutes} minutes`;
    if (minutes >= 1) return `${minutes} minutes ${seconds} seconds`
    return `${seconds} seconds`
}

export default async function(bot, requestedPlayer, player, chat) {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/firesales`);
    const data = await response.json();

    if (!data.success || !data.sales || data.sales == []) return (chat + "No firesale data available.");

    const itemResponse = await fetch(`https://api.hypixel.net/v2/resources/skyblock/items`);
    const itemData = await itemResponse.json();

    let items = [];
    for (const item of data.sales) {
        for (const itemObj of itemData.items) {
            if (itemObj.id == item.item_id) {
                items.push(`${itemObj.name} [${item.price}] (${item.amount} quantity) starts in ${getTimeLeft(item.start / 1000 - Date.now() / 1000)}`);
            }
        }
    }
    if (items.length != data.sales.length) {
        items = [];
        for (const item of data.sales) {
            items.push(`${item.item_id} [${item.price}] (${item.amount} quantity) starts in ${getTimeLeft(item.start / 1000 - Date.now() / 1000)}`);
        }
    }

    return (chat + items.join(', ').substring(0, 240));
}