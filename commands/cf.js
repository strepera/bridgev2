function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
}

const rabbitBuffs = {
    "COMMON": {
        additive: 1,
        multiplicative: 0.002
    },
    "UNCOMMON": {
        additive: 2,
        multiplicative: 0.003
    },
    "RARE": {
        additive: 4,
        multiplicative: 0.004
    },
    "EPIC": {
        additive: 10,
        multiplicative: 0.005
    },
    "LEGENDARY": {
        additive: 0,
        multiplicative: 0.02
    },
    "DIVINE": {
        additive: 0,
        multiplicative: 0.025
    }
}

const prestigeBuffs = [
    0,
    0.1,
    0.25,
    0.5,
    1,
	1.5
];

const workerBuffs = {
    "rabbit_bro": 1,
    "rabbit_cousin": 2,
	"rabbit_sis": 3,
    "rabbit_father": 4,
    "rabbit_grandma": 5,
    "rabbit_uncle": 6,
	"rabbit_dog": 7
}

async function getCps(data, cookiebuff) {
    let multiplicative = 2;
    let additive = 0;

    if (cookiebuff) multiplicative += 0.25;

    const prestige = check(data.chocolate_level);
    multiplicative += prestigeBuffs[prestige - 1];

    const tower = check(data.time_tower.level);
    multiplicative += tower * 0.1;

    const coach = check(data.chocolate_multiplier_upgrades);
    multiplicative += coach * 0.01;

    for (const index in data.employees) {
        additive += workerBuffs[index] * data.employees[index];
    }

    for (const rabbit in data.rabbits) {
        if (rabbits[rabbit]) {
            if (rabbits[rabbit] == 'MYTHIC') {
                switch (rabbit) {
                    case "dante":
                        additive += 50;
                        break;
                    case "galaxy":
                        multiplicative += 0.05;
                        break;
                    case "zest_zephyr":
                        additive += 30;
                        multiplicative += 0.03;
                        break;
					case "mu":
						multiplicative += 0.7;
						break;
					case "sigma":
						const mythicAmount = Object.values(rabbits).filter(rarity => rarity == "MYTHIC").length;
						additive += mythicAmount * 50;
						break;
                    default:
                        break;
                }
                break;
            }
            additive += rabbitBuffs[rabbits[rabbit]].additive;
            multiplicative += rabbitBuffs[rabbits[rabbit]].multiplicative;
        }
    }
    
    return Math.floor(additive * multiplicative);
}

const prestigeRequirements = [
	0,
	500000000,
	1200000000,
	4000000000,
	10000000000,
	25000000000
];

function check(value) {
    if (value) {
        return value;
    }
    else {
        return 0;
    }
}

export default async function cfCommand(bot, requestedPlayer, player, chat) {
    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return (chat + "Invalid player.");

    let profileData;
    for (const profile of dataJson.profiles) {
      if (profile.selected) profileData = profile.members[uuid];
    }
    
    const cfData = profileData.events.easter;
    const chocolate = formatNumber(cfData.total_chocolate);
    const currentChocolate = formatNumber(cfData.chocolate);
	const chocolateSincePrestige = check(cfData.chocolate_since_prestige);
    const prestige = cfData.chocolate_level;
    const timeTower = check(cfData.time_tower.level);
    const coach = check(cfData.chocolate_multiplier_upgrades);
    const shrine = check(cfData.rabbit_rarity_upgrades);
    const rabbitsObj = cfData.rabbits;
    let rabbits = 0;
    let duplicates = 0;
    for (const rabbitKey in rabbitsObj) {
        const rabbit = rabbitsObj[rabbitKey];
        if (typeof rabbit == 'number') {
            duplicates += Number(rabbit) - 1;
            rabbits++;
        }
    }
    const cps = await getCps(cfData, profileData.profile.cookie_buff_active);
	const timeLeft = ((prestigeRequirements[prestige] - chocolateSincePrestige) / cps / 60 / 60).toFixed(2);

	if (prestige == 6) {
		return (`${chat}${requestedPlayer}'s cf: CPS (with tt) [${cps.toLocaleString()}] Prestige [${prestige}/6] Timetower ${timeTower}/15 Shrine ${shrine}/20 Coach ${coach}/20 All-time ${chocolate} Current ${currentChocolate} Rabbits ${rabbits}/457 Duplicates: ${duplicates}`);
	}
    return (`${chat}${requestedPlayer}'s cf: CPS (with tt) [${cps.toLocaleString()}] Prestige [${prestige}/6] (${timeLeft} hrs for prestige ${prestige + 1}) Gained (${formatNumber(chocolateSincePrestige)}/${formatNumber(prestigeRequirements[prestige])}) Timetower ${timeTower}/15 Shrine ${shrine}/20 Coach ${coach}/20 All-time ${chocolate} Current ${currentChocolate} Rabbits ${rabbits}/457 Duplicates: ${duplicates}`);
}

const rabbits = {
	aurora: 'DIVINE',
	celestia: 'DIVINE',
	orion: 'DIVINE',
	starfire: 'DIVINE',
	vega: 'DIVINE',
	dante: 'MYTHIC',
	einstein: 'MYTHIC',
	galaxy: 'MYTHIC',
	king: 'MYTHIC',
	mu: 'MYTHIC',
	napoleon: 'MYTHIC',
	omega: 'MYTHIC',
	sigma: 'MYTHIC',
	zest_zephyr: 'MYTHIC',
	zeta: 'MYTHIC',
	zorro: 'MYTHIC',
	apollo: 'LEGENDARY',
	april: 'LEGENDARY',
	atlas: 'LEGENDARY',
	echo: 'LEGENDARY',
	el_dorado: 'LEGENDARY',
	epsilon: 'LEGENDARY',
	extra: 'LEGENDARY',
	general: 'LEGENDARY',
	houdini: 'LEGENDARY',
	kaeman: 'LEGENDARY',
	lambda: 'LEGENDARY',
	magic: 'LEGENDARY',
	mystic: 'LEGENDARY',
	nova: 'LEGENDARY',
	psi: 'LEGENDARY',
	rho: 'LEGENDARY',
	shadow: 'LEGENDARY',
	solomon: 'LEGENDARY',
	storm: 'LEGENDARY',
	ube_unicorn: 'LEGENDARY',
	vanilla_vortex: 'LEGENDARY',
	walnut_whirl: 'LEGENDARY',
	xoco_xanudu: 'LEGENDARY',
	yogurt_yucca: 'LEGENDARY',
	ace: 'EPIC',
	achilles: 'EPIC',
	alpine: 'EPIC',
	angel: 'EPIC',
	calypso: 'EPIC',
	chi: 'EPIC',
	comet: 'EPIC',
	delta: 'EPIC',
	gatsby: 'EPIC',
	implode: 'EPIC',
	jedi: 'EPIC',
	kappa: 'EPIC',
	ken: 'EPIC',
	kiera: 'EPIC',
	kodo: 'EPIC',
	merlin: 'EPIC',
	necron: 'EPIC',
	peppermint_pearl: 'EPIC',
	pi: 'EPIC',
	prince: 'EPIC',
	punch: 'EPIC',
	quince_quark: 'EPIC',
	rambo: 'EPIC',
	raspberry_ripple: 'EPIC',
	saga: 'EPIC',
	simba: 'EPIC',
	strawberry_swirl: 'EPIC',
	thor: 'EPIC',
	toffee_tulip: 'EPIC',
	trix: 'EPIC',
	turbo: 'EPIC',
	aladdin: 'RARE',
	aloysius: 'RARE',
	barbie: 'RARE',
	bishop: 'RARE',
	blackberry: 'RARE',
	blackjack: 'RARE',
	bugatti: 'RARE',
	bun_bun: 'RARE',
	burst: 'RARE',
	cajun: 'RARE',
	caramel: 'RARE',
	casanova: 'RARE',
	chevy: 'RARE',
	cinnamon: 'RARE',
	crystal: 'RARE',
	dallas: 'RARE',
	draco: 'RARE',
	easter: 'RARE',
	elvis: 'RARE',
	favor: 'RARE',
	figaro: 'RARE',
	frodo: 'RARE',
	gamma: 'RARE',
	gremlin: 'RARE',
	honey: 'RARE',
	hope: 'RARE',
	hyde: 'RARE',
	iota: 'RARE',
	jasper: 'RARE',
	jynx: 'RARE',
	kiwi_kiss: 'RARE',
	lavender_lemon: 'RARE',
	linus: 'RARE',
	maple_mirage: 'RARE',
	midnight: 'RARE',
	monalisa: 'RARE',
	murphy: 'RARE',
	neptune: 'RARE',
	nougat_nebula: 'RARE',
	olympe: 'RARE',
	omicron: 'RARE',
	onyx: 'RARE',
	orange_obsidian: 'RARE',
	orlando: 'RARE',
	paddington: 'RARE',
	peanut: 'RARE',
	pepper: 'RARE',
	phantom: 'RARE',
	phi: 'RARE',
	popcorn: 'RARE',
	pride: 'RARE',
	pumpkin: 'RARE',
	river: 'RARE',
	sage: 'RARE',
	snowball: 'RARE',
	spirit: 'RARE',
	spooky: 'RARE',
	stormy: 'RARE',
	sunny: 'RARE',
	tornado: 'RARE',
	tricky: 'RARE',
	uncle_buck: 'RARE',
	vlad: 'RARE',
	wesson: 'RARE',
	widget: 'RARE',
	willow: 'RARE',
	zero: 'RARE',
	abi: 'UNCOMMON',
	abigail: 'UNCOMMON',
	alexa: 'UNCOMMON',
	alexander: 'UNCOMMON',
	alpaca: 'UNCOMMON',
	amazon: 'UNCOMMON',
	arachno: 'UNCOMMON',
	ashes: 'UNCOMMON',
	asterix: 'UNCOMMON',
	average: 'UNCOMMON',
	bambam: 'UNCOMMON',
	bandit: 'UNCOMMON',
	barcode: 'UNCOMMON',
	benji: 'UNCOMMON',
	beta: 'UNCOMMON',
	bilbo: 'UNCOMMON',
	blossom: 'UNCOMMON',
	blueberry: 'UNCOMMON',
	brutus: 'UNCOMMON',
	bubbles: 'UNCOMMON',
	buckwheat: 'UNCOMMON',
	buffalo: 'UNCOMMON',
	bugs: 'UNCOMMON',
	bumper: 'UNCOMMON',
	buster: 'UNCOMMON',
	butters: 'UNCOMMON',
	candi: 'UNCOMMON',
	carter: 'UNCOMMON',
	casper: 'UNCOMMON',
	cassidy: 'UNCOMMON',
	charmin: 'UNCOMMON',
	chewy: 'UNCOMMON',
	chilli: 'UNCOMMON',
	chubby: 'UNCOMMON',
	cloudy: 'UNCOMMON',
	cookie: 'UNCOMMON',
	cooper: 'UNCOMMON',
	cotton: 'UNCOMMON',
	cotton_puff: 'UNCOMMON',
	cottonball: 'UNCOMMON',
	dalton: 'UNCOMMON',
	dandelion: 'UNCOMMON',
	darla: 'UNCOMMON',
	dash: 'UNCOMMON',
	demarcus: 'UNCOMMON',
	demetrious: 'UNCOMMON',
	destiny: 'UNCOMMON',
	domino: 'UNCOMMON',
	eastwood: 'UNCOMMON',
	ella: 'UNCOMMON',
	fish: 'UNCOMMON',
	fitch: 'UNCOMMON',
	flip_flop: 'UNCOMMON',
	forrest: 'UNCOMMON',
	fudge_fountain: 'UNCOMMON',
	gadget: 'UNCOMMON',
	gee_gee: 'UNCOMMON',
	ginger_glaze: 'UNCOMMON',
	goofy: 'UNCOMMON',
	harmony: 'UNCOMMON',
	honey_hazelnut: 'UNCOMMON',
	hop_a_long: 'UNCOMMON',
	icing_ivy: 'UNCOMMON',
	inferno: 'UNCOMMON',
	irena: 'UNCOMMON',
	jasmine_jello: 'UNCOMMON',
	jazz: 'UNCOMMON',
	jelly_bean: 'UNCOMMON',
	kobi: 'UNCOMMON',
	leopold: 'UNCOMMON',
	lulu: 'UNCOMMON',
	maybelline: 'UNCOMMON',
	mediocrity: 'UNCOMMON',
	milo: 'UNCOMMON',
	modest: 'UNCOMMON',
	morgan: 'UNCOMMON',
	oakley: 'UNCOMMON',
	obelix: 'UNCOMMON',
	oreo: 'UNCOMMON',
	otto: 'UNCOMMON',
	ozwald: 'UNCOMMON',
	pancake: 'UNCOMMON',
	patches: 'UNCOMMON',
	penelope: 'UNCOMMON',
	pepsi: 'UNCOMMON',
	pillsbury: 'UNCOMMON',
	polka_dot: 'UNCOMMON',
	porsche: 'UNCOMMON',
	prestige: 'UNCOMMON',
	pretzel: 'UNCOMMON',
	prudent: 'UNCOMMON',
	quincy: 'UNCOMMON',
	raven: 'UNCOMMON',
	ringo: 'UNCOMMON',
	rusty: 'UNCOMMON',
	sargent: 'UNCOMMON',
	seinfield: 'UNCOMMON',
	snoopy: 'UNCOMMON',
	sprinkles: 'UNCOMMON',
	squish: 'UNCOMMON',
	stewart: 'UNCOMMON',
	sven: 'UNCOMMON',
	sweetpea: 'UNCOMMON',
	sylvester: 'UNCOMMON',
	theta: 'UNCOMMON',
	toby: 'UNCOMMON',
	trixie: 'UNCOMMON',
	una: 'UNCOMMON',
	upsilon: 'UNCOMMON',
	void: 'UNCOMMON',
	wadsworth: 'UNCOMMON',
	waffle: 'UNCOMMON',
	xi: 'UNCOMMON',
	zombie: 'UNCOMMON',
	aaron: 'COMMON',
	able: 'COMMON',
	acker: 'COMMON',
	alfie: 'COMMON',
	alice: 'COMMON',
	almond_amaretto: 'COMMON',
	alpha: 'COMMON',
	angus: 'COMMON',
	annabelle: 'COMMON',
	archie: 'COMMON',
	arnie: 'COMMON',
	audi: 'COMMON',
	augustus: 'COMMON',
	baby: 'COMMON',
	badger: 'COMMON',
	bagel: 'COMMON',
	baldwin: 'COMMON',
	baloo: 'COMMON',
	barney: 'COMMON',
	bartholomew: 'COMMON',
	basket: 'COMMON',
	baxter: 'COMMON',
	beatrice: 'COMMON',
	bertha: 'COMMON',
	bibsy: 'COMMON',
	billy: 'COMMON',
	bindi: 'COMMON',
	binky: 'COMMON',
	blake: 'COMMON',
	bob: 'COMMON',
	bramble: 'COMMON',
	breeze: 'COMMON',
	brian: 'COMMON',
	brie: 'COMMON',
	bronson: 'COMMON',
	brooks: 'COMMON',
	bruce: 'COMMON',
	bruno: 'COMMON',
	bud: 'COMMON',
	bugster: 'COMMON',
	bugsy: 'COMMON',
	buttercream_blossom: 'COMMON',
	cadet: 'COMMON',
	callie: 'COMMON',
	cave: 'COMMON',
	chase: 'COMMON',
	chester: 'COMMON',
	chip: 'COMMON',
	chomper: 'COMMON',
	chompsky: 'COMMON',
	claude: 'COMMON',
	cocoa_comet: 'COMMON',
	collin: 'COMMON',
	copper: 'COMMON',
	cottontail: 'COMMON',
	cricket: 'COMMON',
	crush: 'COMMON',
	cuddles: 'COMMON',
	cupcake: 'COMMON',
	delboy: 'COMMON',
	delilah: 'COMMON',
	demi: 'COMMON',
	digger: 'COMMON',
	duchess: 'COMMON',
	dulce_drizzle: 'COMMON',
	dusty: 'COMMON',
	ellie: 'COMMON',
	ember: 'COMMON',
	emerson: 'COMMON',
	espresso_eclair: 'COMMON',
	eta: 'COMMON',
	fergie: 'COMMON',
	fievel: 'COMMON',
	fluffy: 'COMMON',
	francine: 'COMMON',
	frank: 'COMMON',
	frankie: 'COMMON',
	fudge: 'COMMON',
	fuzzy: 'COMMON',
	george: 'COMMON',
	ginger: 'COMMON',
	ginny: 'COMMON',
	gizmo: 'COMMON',
	gloria: 'COMMON',
	gouda: 'COMMON',
	gracie: 'COMMON',
	guinness: 'COMMON',
	gunther: 'COMMON',
	hadley: 'COMMON',
	harley: 'COMMON',
	hefner: 'COMMON',
	heidie: 'COMMON',
	herbie: 'COMMON',
	hershey: 'COMMON',
	hondo: 'COMMON',
	hopper: 'COMMON',
	hubby: 'COMMON',
	huck: 'COMMON',
	hugo: 'COMMON',
	humphrey: 'COMMON',
	hunter: 'COMMON',
	iggy: 'COMMON',
	indie: 'COMMON',
	jade: 'COMMON',
	jake: 'COMMON',
	james: 'COMMON',
	jammer: 'COMMON',
	jasmine: 'COMMON',
	jazmin: 'COMMON',
	jeffery: 'COMMON',
	jerry: 'COMMON',
	joey: 'COMMON',
	jonah: 'COMMON',
	josephine: 'COMMON',
	lenny: 'COMMON',
	lily: 'COMMON',
	lone_ranger: 'COMMON',
	lotte: 'COMMON',
	louie: 'COMMON',
	mandy: 'COMMON',
	marlow: 'COMMON',
	maui: 'COMMON',
	max: 'COMMON',
	mickey: 'COMMON',
	miles: 'COMMON',
	milly: 'COMMON',
	mimi: 'COMMON',
	mochi: 'COMMON',
	molly: 'COMMON',
	mona: 'COMMON',
	moody: 'COMMON',
	mookie: 'COMMON',
	mopsy: 'COMMON',
	morris: 'COMMON',
	natalie: 'COMMON',
	ned: 'COMMON',
	nibbles: 'COMMON',
	niko: 'COMMON',
	niza: 'COMMON',
	nu: 'COMMON',
	nutmeg: 'COMMON',
	oletta: 'COMMON',
	oliver: 'COMMON',
	olivette: 'COMMON',
	olivier: 'COMMON',
	ollie: 'COMMON',
	paddy: 'COMMON',
	patch: 'COMMON',
	pebbles: 'COMMON',
	penny: 'COMMON',
	peony: 'COMMON',
	petunia: 'COMMON',
	pickles: 'COMMON',
	picky: 'COMMON',
	pinky: 'COMMON',
	poppy: 'COMMON',
	porter: 'COMMON',
	quentin: 'COMMON',
	razzie: 'COMMON',
	reginald: 'COMMON',
	remi: 'COMMON',
	ressie: 'COMMON',
	ricky: 'COMMON',
	riley: 'COMMON',
	rolf: 'COMMON',
	rosco: 'COMMON',
	ross: 'COMMON',
	rowdy: 'COMMON',
	ruben: 'COMMON',
	rupert: 'COMMON',
	ryder: 'COMMON',
	sassy: 'COMMON',
	scooter: 'COMMON',
	scotch: 'COMMON',
	scout: 'COMMON',
	scuba: 'COMMON',
	selene: 'COMMON',
	skippe: 'COMMON',
	smokey: 'COMMON',
	sniffles: 'COMMON',
	snoppy: 'COMMON',
	snuffy: 'COMMON',
	sophie: 'COMMON',
	sorbet: 'COMMON',
	spencer: 'COMMON',
	spot: 'COMMON',
	stanley: 'COMMON',
	stinky: 'COMMON',
	stuart: 'COMMON',
	suri: 'COMMON',
	tagalong: 'COMMON',
	tau: 'COMMON',
	teddy: 'COMMON',
	thalai: 'COMMON',
	theo: 'COMMON',
	theodore: 'COMMON',
	thumper: 'COMMON',
	ticky: 'COMMON',
	tobi: 'COMMON',
	webb: 'COMMON',
	william: 'COMMON',
	winston: 'COMMON',
	woody: 'COMMON',
	zack: 'COMMON',
	zea: 'COMMON'
}  