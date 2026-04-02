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
     * Setzt die World-Referenz auf allen Objekten einer Liste.
     * @param {Array<MovableObject>} objectArray Objektliste.
     * @param {World} world Aktuelle Weltinstanz.
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
     * Synchronisiert die World-Referenzen aller aktiven Listen.
     * @param {World} world Aktuelle Weltinstanz.
     * @param {Array<ThrowableObject>} throwableObject Aktive Wurfobjekte.
     */
    syncWorldReferences(world, throwableObject) {
        this.assignWorldReference(this.enemies, world);
        this.assignWorldReference(this.clouds, world);
        this.assignWorldReference(this.coins, world);
        this.assignWorldReference(this.bottles, world);
        this.assignWorldReference(throwableObject, world);
    }

    /**
     * Entfernt einen Gegner ab einem gegebenen Death-Timer-Schwellwert.
     * @param {MovableObject} enemy Gegnerinstanz.
     * @param {number} threshold Mindestwert des Deadtimers.
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
     * Entfernt eine Münze per Index.
     * @param {number} index Index in der Coin-Liste.
     */
    removeCoin(index) {
        this.coins.splice(index, 1);
    }

    /**
     * Entfernt eine Flasche per Index.
     * @param {number} index Index in der Bottle-Liste.
     */
    removeBottle(index) {
        this.bottles.splice(index, 1);
    }

    /**
     * Sammelt kollidierende Münzen für den Character ein.
     * @param {Character} character Aktiver Character.
     * @param {Function} onCollected Callback pro eingesammelter Münze.
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
     * Sammelt kollidierende Flaschen für den Character ein.
     * @param {Character} character Aktiver Character.
     * @param {Function} onCollected Callback pro eingesammelter Flasche.
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
     * Iteriert über alle Kombinationen aus Wurfobjekten und Gegnern.
     * @param {Array<ThrowableObject>} throwableObject Aktive Wurfobjekte.
     * @param {Function} onPair Callback pro Paar (bottle, enemy).
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
     * Iteriert über alle Gegnerobjekte.
     * @param {Function} onEnemy Callback pro Gegner.
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
     * Verarbeitet Kollisionen zwischen Wurfobjekten und Gegnern.
     * @param {Array<ThrowableObject>} throwableObject Aktive Wurfobjekte.
     * @param {Endboss} boss Endboss-Instanz.
     * @param {Function} onBossDefeated Callback bei Boss-Niederlage.
     * @returns {Array<ThrowableObject>} Aktualisierte Wurfobjektliste.
     */
    handleBottleEnemyCollisions(throwableObject, boss, onBossDefeated) {
        if (!throwableObject) {
            return [];
        }
        let updatedThrowableObject = throwableObject;
        this.forEachBottleEnemyPair(updatedThrowableObject, (bottle, enemy) => {
            if (bottle.isColliding(enemy)) {
                enemy.hit();
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
     * Verarbeitet Character-Kollisionen mit Gegnern inkl. Callbacks.
     * @param {Character} character Aktiver Character.
     * @param {Function} onCharacterDamaged Callback bei Character-Schaden.
     * @param {Function} onCharacterDefeated Callback bei Character-Niederlage.
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
     * Liefert die Zeichenreihenfolge fuer scrollbare Weltobjekte.
     * @param {Array<ThrowableObject>} throwableObject Aktive Wurfobjekte.
     * @param {Endboss} boss Endboss-Instanz.
     * @returns {Array<Array<DrawableObject>>} Gruppen in Render-Reihenfolge.
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