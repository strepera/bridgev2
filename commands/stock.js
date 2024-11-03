import fs from 'fs';

export default async function stock(bot, request, player, chat) {
    const stocks = JSON.parse(await fs.promises.readFile('bot/stockPrices.json', 'utf8'));

    let stockNames = [];
    for (const stock in stocks) {
        stockNames.push(stocks[stock].name + ' ($' + stocks[stock].value + ')');
    }

    let stockType = request.split(' ')[1];
    let playerData;
    switch(request.split(' ')[0]) {
        case "list":
            return (chat + "Available stocks: " + stockNames.join(', '));
        case "buy":
            const buyAmount = Math.abs(Math.floor(Number(request.split(' ')[2])));
            if (stockType) stockType = stockType.toLowerCase();
            if (!stocks[stockType]) return (chat + "Invalid stock " + stockType);
            if (!stockType || !buyAmount) return (chat + "Invalid syntax. Usage: .stock buy stock amount");

            playerData = JSON.parse(await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8'));
            if (playerData[player.toLowerCase()].coins <= stocks[stockType].value * buyAmount) return (chat + "You do not have enough coins to buy this!");
            stocks[stockType].ownership.none -= buyAmount;
            if (!stocks[stockType].ownership[player.toLowerCase()]) stocks[stockType].ownership[player.toLowerCase()] = buyAmount;
            else stocks[stockType].ownership[player.toLowerCase()] += buyAmount;
            playerData[player.toLowerCase()].coins -= stocks[stockType].value * buyAmount;
            fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(playerData, null, 2));
            fs.writeFileSync(`bot/stockPrices.json`, JSON.stringify(stocks, null, 2));
            return (chat + "Bought [" + buyAmount + '] ' + stocks[stockType].name + ' stocks for $' + stocks[stockType].value * buyAmount);
        case "sell":
            const sellAmount = Math.abs(Math.floor(Number(request.split(' ')[2])));
            if (stockType) stockType = stockType.toLowerCase();
            if (!stocks[stockType]) return (chat + "Invalid stock " + stockType);
            if (!stockType || !sellAmount) return (chat + "Invalid syntax. Usage: .stock sell stock amount");

            playerData = JSON.parse(await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8'));
            if (!stocks[stockType].ownership[player.toLowerCase()]) return (chat +"You do not own any of this stock!");
            if (stocks[stockType].ownership[player.toLowerCase()] < sellAmount) return (chat + "You do not own enough of this stock!");
            stocks[stockType].ownership.none += sellAmount;
            stocks[stockType].ownership[player.toLowerCase()] -= sellAmount;
            if (stocks[stockType].ownership[player.toLowerCase()] == 0) delete stocks[stockType].ownership[player];
            playerData[player.toLowerCase()].coins += stocks[stockType].value * sellAmount;
            fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(playerData, null, 2));
            fs.writeFileSync(`bot/stockPrices.json`, JSON.stringify(stocks, null, 2));
            return (chat + "Sold [" + sellAmount + '] ' + stocks[stockType].name + ' stocks and gained $' + stocks[stockType].value * sellAmount);
        case "price":
            let stock = request.split(' ')[1];
            if (!stocks[stock]) return (chat + "Invalid stock " + stock);
            stock = stock.toLowerCase();
            return (chat + stocks[stock].name + "'s price is at $" + stocks[stock].value);
        case "inventory":
            let ownedStocks = [];
            for (const stock in stocks) {
                if (stocks[stock].ownership[player.toLowerCase()]) {
                    ownedStocks.push(stocks[stock].name + ' ' + stocks[stock].ownership[player.toLowerCase()] + ' ($' + stocks[stock].value * stocks[stock].ownership[player.toLowerCase()] + ')');
                }
            }
            ownedStocks = ownedStocks.join(', ');
            if (ownedStocks == '') return (chat + "You do not own any stocks.")
            return (chat + "Owned stocks: " + ownedStocks);
        default: 
            return (chat + "Stock commands: .stock list, .stock buy {stock}, .stock sell {stock}, .stock price {stock}, .stock inventory");
    }

}