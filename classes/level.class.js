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
}