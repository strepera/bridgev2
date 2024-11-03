export default async function(bot, requested, player, chatType) {
    let pristine = Number(requested.split(" ")[0]);
    let rolls = Number(requested.split(" ")[1]);
    if (!pristine) {
        return chatType + "Please specify a pristine amount.";
    }
    if (!rolls) {
        return `Average chance for ${pristine} ✧ Pristine is ${Math.floor((calculatePristine(pristine, 3) + calculatePristine(pristine, 4) + calculatePristine(pristine, 5))/3*100*1000)/1000}%`;
    }
    return `Drop chance for ${pristine} ✧ Pristine and ${rolls} rolls is ${Math.floor(calculatePristine(pristine, rolls)*100*1000)/1000}%`;
}

function calculatePristine(pristine, rolls) {
    return ((((100-pristine)*0.01)**rolls-1)*-1);
}