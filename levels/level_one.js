let spawner = new Spawner();
let enemies = [];
let clouds = [];
let coins = [];
let bottles = [];
let level_one = null;
let spawnIntervalId = null;
let cloudSpawnIntervalId = null;

/**
 * Erzeugt alle Hintergrund-Objekte fuer Level 1.
 */
function createLevelOneBackgroundObjects() {
	return [
		new BackgroundObject('./assets/img/5_background/layers/air.png', -719),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', -719),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', -719),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', -719),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 0),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 0),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 0),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 0),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 719),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 719),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 719),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 719),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 2),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 719 * 2),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 719 * 2),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 719 * 2),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 3),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 719 * 3),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 719 * 3),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 719 * 3),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 4),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 719 * 4),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 719 * 4),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 719 * 4),
		new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 5),
		new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 719 * 5),
		new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 719 * 5),
		new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 719 * 5),
	];
}

/**
 * Erstellt ein neues, frisches Level-Objekt fuer einen Spielstart oder Neustart.
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
 * Stoppt laufende Spawn-Intervalle, bevor ein neues Level gestartet wird.
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
 * Startet die Spawn-Logik fuer Gegner und Wolken im aktuellen Level.
 */
function startLevelOneSpawning() {
	spawnIntervalId = setInterval(() => {
		spawner.spawnRandomEnemy(enemies);
		if (enemies.length > 20) {
			clearInterval(spawnIntervalId);
			spawnIntervalId = null;
		}
		if (enemies[0] && enemies[0].isDead()) {
			clearInterval(spawnIntervalId);
			spawnIntervalId = null;
		}
	}, 5000);

	cloudSpawnIntervalId = setInterval(() => {
		spawner.spawnRandomCloud(clouds);
		if (clouds.length > 10) {
			clearInterval(cloudSpawnIntervalId);
			cloudSpawnIntervalId = null;
		}
	}, 1000);
}

/**
 * Initialisiert Level 1 komplett neu und startet alle zugehoerigen Spawn-Intervalle.
 */
function startLevelOne() {
	stopLevelOneSpawning();
	level_one = createLevelOne();
	startLevelOneSpawning();
	return level_one;
}