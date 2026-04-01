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
}