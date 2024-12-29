import Data from '../player_data_handler.js';

export default async function(bot, request, player, chat) {
    const playerData = Data.get(player);

    const stockType = request.split(' ')[1]?.toLowerCase();
    const stocks = Data.getStocks();
    const stock = stocks[stockType];
    const amount = Math.abs(Math.floor(Number(request.split(' ')[2])));
    switch(request.split(' ')[0]) {
        case "list":
            return chat + "Available stocks: " + Object.values(Data.getStocks()).map(stock => `${stock.name} ($${stock.price})`).join(" ");
        case "buy":
            if (!stock) return (chat + "Invalid syntax. Usage: .stock buy stock amount");
            if (playerData.coins <= stocks[stockType].price * amount) return (chat + "You do not have enough coins to buy this!");

            Data.add('none', 'stocks', amount * -1, stockType);
            Data.add(player, 'stocks', amount, stockType);
            Data.add(player, 'coins', stock.price*amount*-1);

            return `${chat}Bought [${amount}] ${stock.name} stocks for $${stock.price * amount}`;
        case "sell":
            if (!stock) return (chat + "Invalid syntax. Usage: .stock sell stock amount");
            if (!stock.ownership[player.toLowerCase()]) return chat + "You do not own any of this stock!";
            if (stock.ownership[player.toLowerCase()] < amount) return chat + "You don't have enough of this stock to sell";

            Data.add('none', 'stocks', amount, stockType);
            Data.add(player, 'stocks', amount * -1, stockType);
            Data.add(player, 'coins', stock.price*amount);

            return `${chat}Sold [${amount}] ${stocks[stockType].name} stocks and gained $${stock.price * amount}`;
        case "price":
            if (!stock) return (chat + "Invalid stock " + stockType);
            return (chat + stock.name + "'s price is at $" + stock.price);
        case "inventory":
            const playuh = (stockType || player).toLowerCase();
            const ownedStocks = Object.entries(stocks).filter(arr => Object.entries(arr[1].ownership).some(a => a[0].toLowerCase() == playuh && a[1] > 0));
            if (ownedStocks.length == 0) return (chat + "You do not own any stocks.");
            return chat + ownedStocks.map(stock => stock[1].name + " " + stock[1].ownership?.[playuh] + ' ($' + (stock[1].price * stock[1].ownership?.[playuh]).toLocaleString() + ')').join(", ");
        default: 
            return (chat + "Stock commands: .stock list, .stock buy {stock}, .stock sell {stock}, .stock price {stock}, .stock inventory");
    }

}