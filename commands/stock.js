import Data from '../player_data_handler.js';

export default async function(bot, request, player, chat) {
    const playerData = Data.get(player);

    const stockType = request.split(' ')[1];
    const stocks = Data.getStocks();
    const stock = stocks[stockType];
    const amount = Math.abs(Math.floor(Number(request.split(' ')[2])));
    switch(request.split(' ')[0]) {
        case "list":
            return chat + "Available stocks: " + Object.entries(Data.getStocks()).map(arr => `${arr[0]} ($${arr[1].price})`).join(" ");
        case "buy":
            if (!stock) return (chat + "Invalid syntax. Usage: .stock buy stock amount");
            if (playerData.coins <= stocks[stockType].price * amount) return (chat + "You do not have enough coins to buy this!");

            Data.add('none', 'stocks', amount * -1);
            Data.add(player, 'stocks', amount);
            Data.add(player, 'coins', stock.price*amount*-1);

            return `${chat}Bought [${amount}] ${stockType} stocks for $${stock.value * amount}`;
        case "sell":
            if (!stock) return (chat + "Invalid syntax. Usage: .stock sell stock amount");
            if (!stock.ownership[player.toLowerCase()]) return chat + "You do not own any of this stock!";
            if (stock.ownership[player.toLowerCase()] < amount) return chat + "You don't have enough of this stock to sell";

            Data.add('none', 'stocks', amount);
            Data.add(player, 'stocks', amount * -1);
            Data.add(player, 'coins', stock.price*amount);

            return `${chat}Sold [${amount}] ${stocks[stockType].name} stocks and gained $${stocks[stockType].value * amount}`;
        case "price":
            if (!stock) return (chat + "Invalid stock " + stock);
            return (chat + stockType + "'s price is at $" + stock.price);
        case "inventory":
            const ownedStocks = Object.entries(stocks).filter(arr => Object.entries(arr[1].ownership).some(a => a[0].toLowerCase() == player.toLowerCase() && a[1] > 0));
            if (ownedStocks.length == 0) return (chat + "You do not own any stocks.");
            return chat + Object.entries(ownedStocks).map(a => a[0] + " " + a[1].ownership[player.toLowerCase()] + ' ($' + a[1].price * a[1].ownership[player.toLowerCase()] + ')');
        default: 
            return (chat + "Stock commands: .stock list, .stock buy {stock}, .stock sell {stock}, .stock price {stock}, .stock inventory");
    }

}