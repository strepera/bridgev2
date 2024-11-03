export default async function(bot, requested, player, chat) {
    let time = parseInt(requested);

    if (isNaN(time)) return chat + "Invalid time (use seconds)";
    setTimeout(() => {
        bot.chat("/msg " + player + " Timer for " + time + " seconds is up!");
        bot.lastMessage = ("/msg " + player + " Timer for " + time + " seconds is up!");
    }, time * 1000);
    return chat + "Timer set for " + time + " seconds.";
}