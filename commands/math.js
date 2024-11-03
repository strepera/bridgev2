import * as math from 'mathjs';

export default function(bot, requestedPlayer, player, chat) {
  if (global.mathAnswer) {
    return `/g mute ${player} 1m`;
  }
  requestedPlayer = requestedPlayer.replaceAll("x","*");
    try {
      const preludes = [
        "The answer to your question is",
        `The answer to ${requestedPlayer} is`,
        `${requestedPlayer} is`,
        "The answer you are looking for is",
        "The solution you're seeking is",
        "Your query resolves to",
        "What you're asking leads to",
        "The result of your question is",
        "The response to your inquiry is",
        "The conclusion to your query is"
      ];
      const answerpreludeindex = Math.floor(Math.random() * preludes.length);
      const answerprelude = preludes[answerpreludeindex];
      const answer = math.evaluate(requestedPlayer);
      return (`${chat}${answerprelude} ${answer}`);
    } catch (err) {
      return (chat + 'Sorry, I could not understand the math question.');
    }
}