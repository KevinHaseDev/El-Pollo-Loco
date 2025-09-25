class Spawner {
	generateEnemyList(minCount, maxCount) {
		let enemyList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			if (Math.random() < 0.4) {
				enemyList.push(new Chicken());
			} else {
				enemyList.push(new SmallChicken());
			}
		}
		enemyList.push(new Endboss());
		return enemyList;
	}

	spawnRandomEnemy(enemyArray) {
		if (!enemyArray) {
			return;
		}
		if (Math.random() < 0.4) {
			enemyArray.push(new Chicken());
		} else {
			enemyArray.push(new SmallChicken());
		}
	}

	generateCloudList(minCount, maxCount) {
		let cloudList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			cloudList.push(new Cloud());
		}
		return cloudList;
	}

	spawnRandomCloud(cloudArray) {
		if (!cloudArray) {
			return;
		}
		if (Math.random() < 0.5) {
			cloudArray.push(new Cloud());
		}
	}
}