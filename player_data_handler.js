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
                const difference = Data.stockPrices[stock].price / 100 * ranRange(-7, 3);
                Data.stockPrices[stock].price = Math.floor(Data.stockPrices[stock].price + difference);
            }
        }, 60*60*1000);
    },

    get: (playerName) => {
        Data._checkPlayerExists(playerName);
        return Data.playerData[playerName?.toLowerCase()];
    },

    add: (playerName, type, amount, stockType) => {

        Data._checkPlayerExists(playerName);

        switch (type) {
            case "coins":
                Data.playerData[playerName.toLowerCase()].coins += amount;
                break;
            case "messages":
                const msgs = Data.playerData[playerName.toLowerCase()].messages;
                const hour = Math.floor(Date.now()/1000/3600);
                if (!msgs[hour]) msgs[hour] = 0;
                msgs[hour] += amount;
                break;
            case "stocks":
                if (!Data.stockPrices[stockType.toLowerCase()].ownership[playerName.toLowerCase()]) Data.stockPrices[stockType.toLowerCase()].ownership[playerName.toLowerCase()] = 0;
                Data.stockPrices[stockType.toLowerCase()].ownership[playerName.toLowerCase()] += amount;
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
