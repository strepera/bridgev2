String.prototype.shuffleWords = function () {
    return this.split(' ')
        .map(word => word.split('').sort(() => 0.5 - Math.random()).join(''))
        .join(' ');
}

let answer;

export default [
    {
        getQuestion: async () => {
            const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/items');
            const data = await response.json();
            const items = data.items;
            const randomItemId = items[Math.floor(Math.random() * items.length)];
            answer = randomItemId.name;
            const shuffledItemName = answer.shuffleWords();
            console.log(`Unscramble for 2.5k guild coins! | " + ${shuffledItemName}`)
            return `Unscramble for 2.5k guild coins! | ${shuffledItemName}`;
        },
        checkAnswer: (message) => {
            return message.toLowerCase().includes(answer.toLowerCase());
        },
        timeout: () => {
            return 'No one answered in time! The answer was "' + answer + '"';
        },
        asked: Date.now()
    },
    {
        getQuestion: async () => {
            const operators = [
                {
                    str: "+",
                    operate: (num1, num2) => {
                        return num1 + num2;
                    }
                },
                {
                    str: "-",
                    operate: (num1, num2) => {
                        return num1 - num2;
                    }
                },
                {
                    str: "*",
                    operate: (num1, num2) => {
                        return num1 * num2;
                    }
                }
            ];
            const num1 = Math.floor(Math.random()*100)+2;
            const num2 = Math.floor(Math.random()*10)+2;
            const chosenOperator = operators[Math.floor(Math.random()*operators.length)];
            answer = chosenOperator.operate(num1, num2);
            return `QUICK MATH for 2.5k guild coins! | What is ${num1} ${chosenOperator.str} ${num2}?`;
        },
        checkAnswer: (message) => {
            return message.includes(answer);
        },
        timeout: () => {
            return 'No one answered in time! The answer was "' + answer + '"';
        },
        asked: Date.now()
    },
    {
        getQuestion: async () => {
            const response = await fetch('https://moulberry.codes/lowestbin.json');
            const items = await response.json();
            let randomItem;
            while (!randomItem || randomItem.includes('+')) {
                randomItem = Object.entries(items)[Math.floor(Math.random() * Object.keys(items).length)];
            }
            answer = randomItem[1];
            console.log(randomItem);
            return "Guess the price for this item! | " + randomItem[0];
        },
        checkAnswer: (message) => {
            const convertAbbreviation = (inputStr) => {
                const abbreviations = {
                    'm': 1000000,
                    'k': 1000,
                    'b': 1000000000,
                };
            
                let numStr = '';
                let abb = '';
                for (let char of inputStr) {
                    if (char.match(/[0-9.]/)) {
                        numStr += char;
                    } else {
                        abb += char.toLowerCase();
                    }
                }

                return parseFloat(numStr) * abbreviations[abb];
            }
            
            const match = message.toLowerCase().match(/([0-9.]+(?:k|m|b)?)/);
            if (!match) return;
            const num = convertAbbreviation(match[1]);
            return Math.abs(num - answer) < answer/10;
        },
        timeout: () => {
            return 'No one answered in time! The answer was "' + answer + '"';
        },
        asked: Date.now()
    }
]