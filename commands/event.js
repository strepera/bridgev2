export default async function(bot, requestedPlayer, player, chat) {
  requestedPlayer = requestedPlayer.split(' ')[0];
  switch(requestedPlayer) {
    case "jerry":
      return chat + getTimeLeft(440400);
    case "spooky":
      return chat + getTimeLeft(297600);
    case "hoppity":
      return chat + getTimeLeft(3600);
  }
}; 

function formatDuration(milliseconds) {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `Event starts in ${days} days ${hours} hours`;
}

function getTimeLeft(offset) {
  const now = Math.floor(Date.now() / 1000);
  const timeSinceStart = now - 1560275700 // start of years for sb
  const year = Math.floor(timeSinceStart / 446400 /*5 days 4 hours*/);
  const unixYear = 1560275700 + year * 446400;
  let timeLeft = unixYear + offset - now;
  
  if (timeLeft < 0) {
    const elapsedYears = Math.ceil((-timeLeft) / 446400);
    timeLeft = (unixYear + elapsedYears * 446400) + offset - now;
  }
  
  return formatDuration(timeLeft * 1000);
}