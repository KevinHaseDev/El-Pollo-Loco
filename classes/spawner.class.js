class Spawner {
	/**
	 * Generates a randomized enemy list including one endboss.
	 * @param {number} minCount Minimum enemy count.
	 * @param {number} maxCount Maximum enemy count.
	 * @returns {MovableObject[]} Enemy list.
	 */
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

	/**
	 * Spawns one random enemy and appends it to the list.
	 * @param {MovableObject[]} enemyArray Existing enemy list.
	 */
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

	/**
	 * Generates a randomized bottle list.
	 * @param {number} minCount Minimum bottle count.
	 * @param {number} maxCount Maximum bottle count.
	 * @returns {Bottles[]} Bottle list.
	 */
	generateBottleList(minCount, maxCount) {
		let bottleList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			let realX = 450 + Math.random() * 3200;
			bottleList.push(new Bottles(realX));
		}
		return bottleList;
	}

	/**
	 * Randomly appends one bottle to the provided list.
	 * @param {Bottles[]} bottleArray Existing bottle list.
	 */
	spawnRandomBottle(bottleArray) {
		if (!bottleArray) {
			return;
		}
		if (Math.random() < 0.5) {
			bottleArray.push(new Bottles());
		}
	}

	/**
	 * Generates a randomized coin list.
	 * @param {number} minCount Minimum coin count.
	 * @param {number} maxCount Maximum coin count.
	 * @returns {Coins[]} Coin list.
	 */
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

	/**
	 * Randomly appends one coin to the provided list.
	 * @param {Coins[]} coinArray Existing coin list.
	 */
	spawnRandomCoin(coinArray) {
		if (!coinArray) {
			return;
		}
		if (Math.random() < 0.5) {
			coinArray.push(new Coins());
		}
	}

	/**
	 * Generates a randomized cloud list.
	 * @param {number} minCount Minimum cloud count.
	 * @param {number} maxCount Maximum cloud count.
	 * @returns {Cloud[]} Cloud list.
	 */
	generateCloudList(minCount, maxCount) {
		let cloudList = [];
		let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
		for (let i = 0; i < count; i++) {
			cloudList.push(new Cloud());
		}
		return cloudList;
	}

	/**
	 * Randomly appends one cloud to the provided list.
	 * @param {Cloud[]} cloudArray Existing cloud list.
	 */
	spawnRandomCloud(cloudArray) {
		if (!cloudArray) {
			return;
		}
		if (Math.random() < 0.5) {
			cloudArray.push(new Cloud());
		}
	}
}