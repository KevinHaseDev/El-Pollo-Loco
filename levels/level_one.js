const spawner = new Spawner();
let x = 0;
let y = 0;
let enemies = spawner.generateEnemyList(8, 18);
let clouds = spawner.generateCloudList(2, 5);
let coins = spawner.generateCoinList(20, 40);
let bottles = spawner.generateBottleList(10, 15);
let level_one = new Level(
	enemies,
	bottles,
	coins,
	clouds,
	[
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
	]
);

let spawnIntervalId = setInterval(function () {
	spawner.spawnRandomEnemy(enemies);
	if (enemies.length > 20) {
		clearInterval(spawnIntervalId);
	}
	if (enemies[0].isDead()) {
	    clearInterval(spawnIntervalId);
	}
}, 5000);

let cloudSpawnIntervalId = setInterval(function () {
	spawner.spawnRandomCloud(clouds);
	if (clouds.length > 10) {
		clearInterval(cloudSpawnIntervalId);
	}
}, 1000);