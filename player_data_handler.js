import fs from 'fs';

const ranRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Data = {

    playerData: {},
    stockPrices: {},

    _checkPlayerExists: (playerName) => {
        if (!Data.playerData[playerName.toLowerCase()]) {
            Data.playerData[playerName.toLowerCase()] = {
                username: playerName,
                coins: 0,
                messages: 0,
                playtime: 0
            }
        }
    },

    init: async () => {
        Data.playerData = JSON.parse((await fs.promises.readFile('./player_data.json')).toString());
        Data.stockPrices = JSON.parse((await fs.promises.readFile('./stock_prices.json')).toString());
        setInterval(() => {
            fs.writeFileSync('./player_data.json', JSON.stringify(Data.playerData));
            fs.writeFileSync('./stock_prices.json', JSON.stringify(Data.stockPrices));
        }, 2*60*1000);
        setInterval(() => {
            for (const stock in Data.stockPrices) {
                const difference = Data.stockPrices[stock].price / 100 * ranRange(-5.3, 5.5);
                Data.stockPrices[stock].price = Math.floor(Data.stockPrices[stock].price + difference);
            }
        }, 60*60*1000);
    },

    get: (playerName) => {
        _checkPlayerExists(playerName);
        return Data.playerData[playerName?.toLowerCase()];
    },

    add: (playerName, type, amount, stockType) => {

        _checkPlayerExists(playerName);

        switch (type) {
            case "coins":
                Data.playerData[playerName.toLowerCase()].coins += amount;
                break;
            case "messages":
                Data.playerData[playerName.toLowerCase()].messages += amount;
                break;
            case "stocks":
                if (!Data.stockPrices[stockType].ownership[player.toLowerCase()]) Data.stockPrices[stockType].ownership[player.toLowerCase()] = 0;
                Data.stockPrices[stockType].ownership[player.toLowerCase()] += amount;
                break;
            default: 
                throw new Error('Invalid player data type received');
        }

        return Data.playerData[playerName];

    },

    getStocks: () => {
        return Data.stockPrices;
    }
}

export default Data;
