let spawner = new Spawner();
let enemies = [];
let clouds = [];
let coins = [];
let bottles = [];
let levelOne = null;
let spawnIntervalId = null;
let cloudSpawnIntervalId = null;

/**
 * Creates all background tiles for level one.
 * @returns {BackgroundObject[]} A list of background tile objects.
 */
function createLevelOneBackgroundObjects() {
	let segmentPositions = [-719, 0, 719, 719 * 2, 719 * 3, 719 * 4, 719 * 5];
	let backgroundObjects = [];
	for (let index = 0; index < segmentPositions.length; index++) {
		let segmentObjects = createBackgroundSegment(segmentPositions[index], index);
		backgroundObjects.push(...segmentObjects);
	}
	return backgroundObjects;
}

/**
 * Creates one background segment at a specific x position.
 * @param {number} xPosition Segment x position.
 * @param {number} segmentIndex Segment index for tile alternation.
 * @returns {BackgroundObject[]} Segment background objects.
 */
function createBackgroundSegment(xPosition, segmentIndex) {
	let tileVariant = segmentIndex % 2 === 0 ? '2' : '1';
	return [
		new BackgroundObject('./assets/img/5_background/layers/air.png', xPosition),
		new BackgroundObject(`./assets/img/5_background/layers/3_third_layer/${tileVariant}.png`, xPosition),
		new BackgroundObject(`./assets/img/5_background/layers/2_second_layer/${tileVariant}.png`, xPosition),
		new BackgroundObject(`./assets/img/5_background/layers/1_first_layer/${tileVariant}.png`, xPosition)
	];
}

/**
 * Creates a fresh level object for a new game start.
 * @returns {Level} A newly created level instance.
 */
function createLevelOne() {
	enemies = spawner.generateEnemyList(8, 18);
	clouds = spawner.generateCloudList(2, 5);
	coins = spawner.generateCoinList(20, 40);
	bottles = spawner.generateBottleList(10, 15);

	return new Level(
		enemies,
		bottles,
		coins,
		clouds,
		createLevelOneBackgroundObjects()
	);
}

/**
 * Stops active spawn intervals before a new level starts.
 */
function stopLevelOneSpawning() {
	if (spawnIntervalId) {
		clearInterval(spawnIntervalId);
		spawnIntervalId = null;
	}

	if (cloudSpawnIntervalId) {
		clearInterval(cloudSpawnIntervalId);
		cloudSpawnIntervalId = null;
	}
}

/**
 * Starts all level one spawn intervals.
 */
function startLevelOneSpawning() {
	startEnemySpawning();
	startCloudSpawning();
}

/**
 * Starts enemy spawn interval for level one.
 */
function startEnemySpawning() {
	spawnIntervalId = setInterval(() => {
		spawner.spawnRandomEnemy(enemies);
		if (isEnemySpawningFinished()) {
			stopEnemySpawning();
		}
	}, 5000);
}


/**
 * Starts cloud spawn interval for level one.
 */
function startCloudSpawning() {
	cloudSpawnIntervalId = setInterval(() => {
		spawner.spawnRandomCloud(clouds);
		if (clouds.length > 10) {
			stopCloudSpawning();
		}
	}, 1000);
}

/**
 * Checks whether enemy spawning should end.
 * @returns {boolean} True when enemy spawning must stop.
 */
function isEnemySpawningFinished() {
	let tooManyEnemies = enemies.length > 20;
	let bossDefeated = enemies[0] && enemies[0].isDead();
	return tooManyEnemies || bossDefeated;
}

/**
 * Stops enemy spawn interval.
 */
function stopEnemySpawning() {
	clearInterval(spawnIntervalId);
	spawnIntervalId = null;
}

/**
 * Stops cloud spawn interval.
 */
function stopCloudSpawning() {
	clearInterval(cloudSpawnIntervalId);
	cloudSpawnIntervalId = null;
}

/**
 * Initializes level one and starts related spawn intervals.
 * @returns {Level} The initialized level instance.
 */
function startLevelOne() {
	stopLevelOneSpawning();
	levelOne = createLevelOne();
	startLevelOneSpawning();
	return levelOne;
}