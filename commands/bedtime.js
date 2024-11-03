const story1 = "Once upon a time, in a faraway land, there lived a brave knight named Sir Lancelot. One day, he received a mysterious letter inviting him to a tournament where the prize was not gold, but a beautiful maiden's hand in marriage. Excited and eager to prove his worth, Sir Lancelot set off on his trusty steed, Galahad. Along the way, he encountered many challenges, including a fierce dragon guarding a treasure trove and a cunning wizard who tried to trick him. With courage and skill, Sir Lancelot overcame these obstacles, reaching the tournament just in time. There, he won the heart of the maiden and lived happily ever after.";
const story2 = `Once upon a time in the pixelated realm of Hypixel Skyblock, there was a young adventurer named Alex. Alex lived in a cozy little island floating high above the void, surrounded by lush greenery, gently swaying wheat fields, and the calming sound of flowing water from a small pond.One day, as the sun was setting and casting a warm, golden hue over the island, Alex decided to explore the mysterious mines located deep within the realms of the game. Armed with a sturdy iron pickaxe and a backpack full of supplies, Alex descended into the depths of the Gold Mine, where shimmering veins of precious ores awaited discovery.As Alex mined deeper and deeper, the light from the entrance grew dim, and the sound of clinking pickaxes echoed through the cavernous halls. Suddenly, Alex's pickaxe struck something unusual – a hidden passageway that led to the Lapis Quarry. Intrigued, Alex squeezed through the narrow opening and found a magical, blue-glowing cavern.In the center of the quarry stood a majestic Lapis Golem, its eyes gleaming with an ancient wisdom. Despite its imposing appearance, the Golem seemed friendly. It spoke in a deep, resonant voice, "Greetings, young adventurer. I am the guardian of this quarry. Those who prove their worth may receive my blessing".Determined to earn the Golem's favor, Alex embarked on a series of challenges. First, Alex collected an impressive amount of Lapis Lazuli, carefully avoiding the wandering zombies that lurked in the shadows. Next, Alex solved a series of intricate puzzles set by the Golem, demonstrating both wit and patience.Pleased with Alex's efforts, the Lapis Golem granted a special enchantment to Alex's gear, imbuing it with extraordinary powers. "Use these gifts wisely, brave one," the Golem advised. "For there are greater adventures awaiting you beyond these mines."`;

export default async function printBedtimeStory(bot, requestedPlayer, player, chat) {
    if (Math.random() > 0.5) {
        let index = 0;
        const arr = story1.split('.');
        
        const intervalId = setInterval(() => {
          bot.chat('/t ' + player + ' ' + arr[index])
          index += 1;
          
          if (index >= arr.length) {
            clearInterval(intervalId);
            bot.chat("/chat g");
          }
        }, 3000);
    }
    else {
        let index = 0;
        const arr = story2.split('.');
        
        const intervalId = setInterval(() => {
          bot.chat('/t ' + player + ' ' + arr[index])
          index += 1;
          
          if (index >= arr.length) {
            clearInterval(intervalId);
            bot.chat("/chat g");
          }
        }, 3000);
    }
    return chat + "Told bedtime story."
}