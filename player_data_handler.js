import fs from 'fs/promises';

const ranRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Data = {

    _checkPlayerExists: (name) => {
        if (!this.playerData[playerName.toLowerCase()]) {
            this.playerData[playerName.toLowerCase()] = {
                username: playerName,
                coins: 0,
                messages: 0,
                playtime: 0
            }
        }
    },

    init: async () => {
        this.playerData = await fs.readFile('./player_data.json');
        this.stockPrices = await fs.readFile('./stock_prices.json');
        setInterval(() => {
            fs.writeFile('./player_data.json', JSON.stringify(this.playerData));
            fs.writeFile('./player_data.json', JSON.stringify(this.stockPrices));
        }, 2*60*1000);
        setInterval(() => {
            for (const stock in this.stockPrices) {
                const difference = this.stockPrices[stock].value / 100 * ranRange(-5.3, 5.5);
                this.stockPrices[stock].value = Math.floor(this.stockPrices[stock].value + difference);
            }
        }, 60*60*1000);
    },

    get: (playerName) => {
        _checkPlayerExists(playerName);
        return this.playerData[playerName?.toLowerCase()];
    },

    add: (playerName, type, amount, stockType) => {

        _checkPlayerExists(playerName);

        switch (type) {
            case "coins":
                this.playerData[playerName.toLowerCase()].coins += amount;
                break;
            case "messages":
                this.playerData[playerName.toLowerCase()].messages += amount;
                break;
            case "stocks":
                if (!this.stockPrices[stockType].ownership[player.toLowerCase()]) this.stockPrices[stockType].ownership[player.toLowerCase()] = 0;
                this.stockPrices[stockType].ownership[player.toLowerCase()] += amount;
                break;
            default: 
                throw new Error('Invalid player data type received');
        }

        return this.playerData[playerName];

    },

    getStocks: () => {
        return this.stockPrices;
    }
}

export default Data;
