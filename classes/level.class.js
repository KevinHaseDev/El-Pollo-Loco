class Level {
    enemies;
    bottles;
    coins;
    clouds;
    backgroundObjects;
    levelEndX = 719 * 5;

    /**
     * Creates a level container with all world entities.
     * @param {Array<MovableObject>} enemies Enemy entities.
     * @param {Array<MovableObject>} bottles Bottle collectibles.
     * @param {Array<MovableObject>} coins Coin collectibles.
     * @param {Array<MovableObject>} clouds Decorative cloud entities.
     * @param {Array<DrawableObject>} backgroundObjects Background tiles.
     */
    constructor(enemies, bottles, coins, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.bottles = bottles;
        this.coins = coins;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }

    /**
     * Assigns the world reference to all objects in one list.
     * @param {Array<MovableObject>} objectArray Object list.
     * @param {World} world Active world instance.
     */
    assignWorldReference(objectArray, world) {
        if (!objectArray) {
            return;
        }
        objectArray.forEach((gameObject) => {
            gameObject.world = world;
        });
    }

    /**
     * Synchronizes world references for all active entity lists.
     * @param {World} world Active world instance.
     * @param {Array<ThrowableObject>} throwableObject Active throwable objects.
     */
    syncWorldReferences(world, throwableObject) {
        this.assignWorldReference(this.enemies, world);
        this.assignWorldReference(this.clouds, world);
        this.assignWorldReference(this.coins, world);
        this.assignWorldReference(this.bottles, world);
        this.assignWorldReference(throwableObject, world);
    }

    /**
     * Removes one enemy once its deadtimer reaches a threshold.
     * @param {MovableObject} enemy Enemy instance.
     * @param {number} threshold Minimum deadtimer value.
     */
    removeEnemyByDeadtimer(enemy, threshold) {
        if (!enemy) {
            return;
        }
        if (enemy.deadtimer > threshold) {
            this.enemies = this.enemies.filter(e => e !== enemy);
        }
    }

    /**
     * Removes one coin by index.
     * @param {number} index Index in the coin list.
     */
    removeCoin(index) {
        this.coins.splice(index, 1);
    }

    /**
     * Removes one bottle by index.
     * @param {number} index Index in the bottle list.
     */
    removeBottle(index) {
        this.bottles.splice(index, 1);
    }

    /**
     * Collects all coins colliding with the character.
     * @param {Character} character Active character.
     * @param {Function} onCollected Callback per collected coin.
     */
    collectCollidingCoins(character, onCollected) {
        this.coins.forEach((coin, index) => {
            if (character.isColliding(coin)) {
                character.collectCoin();
                if (onCollected) {
                    onCollected();
                }
                this.removeCoin(index);
            }
        });
    }

    /**
     * Collects all bottles colliding with the character.
     * @param {Character} character Active character.
     * @param {Function} onCollected Callback per collected bottle.
     */
    collectCollidingBottles(character, onCollected) {
        this.bottles.forEach((bottle, index) => {
            if (character.isColliding(bottle)) {
                character.collectBottle();
                if (onCollected) {
                    onCollected();
                }
                this.removeBottle(index);
            }
        });
    }

    /**
     * Iterates over every bottle and enemy pair.
     * @param {Array<ThrowableObject>} throwableObject Active throwable objects.
     * @param {Function} onPair Callback for each pair (bottle, enemy).
     */
    forEachBottleEnemyPair(throwableObject, onPair) {
        if (!throwableObject || !onPair) {
            return;
        }
        throwableObject.forEach((bottle) => {
            this.enemies.forEach((enemy) => {
                onPair(bottle, enemy);
            });
        });
    }

    /**
     * Iterates over all enemy objects.
     * @param {Function} onEnemy Callback for each enemy.
     */
    forEachEnemy(onEnemy) {
        if (!onEnemy) {
            return;
        }
        this.enemies.forEach((enemy) => {
            onEnemy(enemy);
        });
    }

    /**
     * Handles collisions between throwable bottles and enemies.
     * @param {Array<ThrowableObject>} throwableObject Active throwable objects.
     * @param {Endboss} boss Endboss instance.
     * @param {Function} onBossDefeated Callback when boss is defeated.
     * @returns {Array<ThrowableObject>} Updated throwable object list.
     */
    handleBottleEnemyCollisions(throwableObject, boss, onBossDefeated) {
        if (!throwableObject) {
            return [];
        }
        let updatedThrowableObject = throwableObject;
        this.forEachBottleEnemyPair(updatedThrowableObject, (bottle, enemy) => {
            if (bottle.isColliding(enemy)) {
                let previousEnergy = enemy.energy;
                enemy.hit();
                this.playBottleHitSound(enemy, previousEnergy);
                updatedThrowableObject = updatedThrowableObject.filter(b => b !== bottle);
            }
            this.removeEnemyByDeadtimer(enemy, 20);
            if (boss && boss.shouldTriggerWinState() && onBossDefeated) {
                onBossDefeated();
            }
        });
        return updatedThrowableObject;
    }

    /**
     * Plays hit sounds for bottle collisions.
     * @param {MovableObject} enemy Hit target.
     * @param {number} previousEnergy Energy before the hit.
     */
    playBottleHitSound(enemy, previousEnergy) {
        if (!window.gameSound) return;
        window.gameSound.playBottleBreak();
        if (enemy.energy >= previousEnergy) return;
        if (typeof Endboss !== 'undefined' && enemy instanceof Endboss) {
            window.gameSound.playEndbossHurt();
            return;
        }
        window.gameSound.playChickenHurt();
    }

    /**
     * Handles character collisions with enemies, including callbacks.
     * @param {Character} character Active character.
     * @param {Function} onCharacterDamaged Callback when character takes damage.
     * @param {Function} onCharacterDefeated Callback when character is defeated.
     */
    handleCharacterEnemyCollisions(character, onCharacterDamaged, onCharacterDefeated) {
        this.forEachEnemy((enemy) => {
            let didJumpOn = character.tryJumpOnEnemy(enemy);
            if (!didJumpOn && character.handleEnemyContact(enemy)) {
                if (onCharacterDamaged) {
                    onCharacterDamaged(character.energy);
                }
                if (character.shouldTriggerLoseState() && onCharacterDefeated) {
                    onCharacterDefeated();
                }
            }
            this.removeEnemyByDeadtimer(enemy, 10);
        });
    }

    /**
     * Returns draw order groups for scrollable world objects.
     * @param {Array<ThrowableObject>} throwableObject Active throwable objects.
     * @param {Endboss} boss Endboss instance.
     * @returns {Array<Array<DrawableObject>>} Groups in render order.
     */
    getScrollableObjectGroups(throwableObject, boss) {
        let objectGroups = [
            this.backgroundObjects,
            this.clouds,
            this.enemies,
            this.bottles,
            this.coins
        ];
        if (boss) {
            objectGroups.push([boss.endbossBar]);
        }
        objectGroups.push(throwableObject || []);
        return objectGroups;
    }
}
