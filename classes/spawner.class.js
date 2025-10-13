class Spawner {
	generateEnemyList(minCount, maxCount) {
		let enemyList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		enemyList.push(new Endboss());
		for (let i = 0; i < count; i++) {
			if (Math.random() < 0.4) {
				enemyList.push(new Chicken());
			} else {
				enemyList.push(new SmallChicken());
			}
		}
		
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

	generateBottleList(minCount, maxCount) {
		let bottleList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			let realX = 450 + Math.random() * 3200;
			bottleList.push(new Bottles (realX));
		}
		return bottleList;
	}

	spawnRandomBottle(bottleArray) {
		if (!bottleArray) {
			return;
		}
		if (Math.random() < 0.5) {
			bottleArray.push(new Bottles());
		}
	}

	generateCoinList(minCount, maxCount) {
		let coinList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			let realX = 500 + Math.random() * 3000;
			let realY = 100 + Math.random() * 200;
			coinList.push(new Coins(realX, realY));
		}
		return coinList;
	}

	spawnRandomCoin(coinArray) {
		if (!coinArray) {
			return;
		}
		if (Math.random() < 0.5) {
			coinArray.push(new Coins());
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