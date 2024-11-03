import https from 'https';

async function postData(url = '', data = {}, callback) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: url.split('/')[2],
            port: 443,
            path: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        const req = https.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

const cooldowns = {};

const context = "You are a bot being used in a hypixel skyblock guild. Respond with answers relating to hypixel skyblock. If a math question is asked then respond with a human readable version of the answer.";

export default async function(bot, requested, player, chat) {
    
    const cooldown = Date.now() - cooldowns[player];

    if (cooldown <  60 * 1000) {
        const remainingSeconds = Math.ceil((60 * 1000 - cooldown) / 1000);
        return (`${chat}Sorry ${player}, command on cooldown! Please wait ${remainingSeconds} seconds.`);
    }

    cooldowns[player] = Date.now();

    const response = await postData('https://ai.spin.rip/chat', { context: context, prompt: requested, name: player, max_output_tokens: 40 })
    if (!response.response || !response) return chat + "API error";
    return response.response.length >= 200 ? chat + "AI Response > " + response.response.substring(0, 200) + " (truncated)" : chat + "AI Response > " + response.response;    
}