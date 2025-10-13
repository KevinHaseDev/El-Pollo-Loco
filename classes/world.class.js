class World {
    character = new Character();
    level = level_one;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    boss = this.level.enemies[0];
    statusBars = [this.healthBar, this.coinBar, this.bottleBar];
    throwableObject = [];
    canThrow = true;
    gameOver;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBottleCollisions();
            this.checkThrowObjects();
            this.checkCollisionCoin();
            this.checkCollisionBottle();
        }, 1000 / 60);
        setInterval(() => {
            this.checkBossShouldMove();
        }, 200);
    }

    checkThrowObjects(index) {
        if (this.keyboard.space && this.canThrow) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            this.canThrow = false;
            this.removeBottle(index);
            this.bottleBar.setPercentage(this.character.bottleAmount);
        }
        if (!this.keyboard.space) {
            this.canThrow = true;
        }
    }

    checkBottleCollisions() {
        this.throwableObject.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    enemy.hit();
                    this.throwableObject = this.throwableObject.filter(b => b !== bottle);
                }
                if (enemy.deadtimer > 20) {
                    this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                }
                if (this.boss.isDead()) {
                    setTimeout(() => {
                        this.gameOver = true;
                    }, 1000);
                }
            });
        });
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0) {
                console.log("Collision with:", enemy.constructor.name);
                enemy.hit();
                this.character.speedY = 15;
            } else if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
                console.log("Character hit! Energy:", this.character.energy);
                if (this.character.isDead()) {
                    setTimeout(() => {
                        this.gameOver = true;
                    }, 1000);
                }
            }
            if (enemy.deadtimer > 10) {
                this.level.enemies = this.level.enemies.filter(e => e !== enemy);
            }
        });
    }

    checkBossShouldMove() {
        if (this.character.x >= 3595) {
            this.boss.animate();
            console.log('Boss is moving now!');
        }
    }

    draw() {
        if (this.gameOver) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);
        if (this.boss) { this.addToMap(this.boss.endbossBar); }
        this.addObjectToMap(this.throwableObject);
        this.ctx.translate(-this.camera_x, 0);
        this.addObjectToMap(this.statusBars);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    addObjectToMap(objectArray) {
        objectArray.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
        this.ctx.restore();
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }
    /**
 * Prüft, ob der Charakter eine Münze einsammelt.
 * @author Copilot
 */
    checkCollisionCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                this.coinBar.setPercentage(this.character.coinAmount);
                this.removeCoin(index);
            }
        });
    }

    /**
     * Entfernt eine Münze aus dem Level.
     * @param {number} index - Index der Münze im Array.
     * @author Copilot
     */
    removeCoin(index) {
        this.level.coins.splice(index, 1);
    }

    /**
 * Prüft, ob der Charakter eine Flasche einsammelt.
 * @author Copilot
 */
    checkCollisionBottle() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle();
                this.bottleBar.setPercentage(this.character.bottleAmount);
            }
        });
    }

    /**
     * Entfernt eine Flasche aus dem Level.
     * @param {number} index - Index der Flasche im Array.
     * @author Copilot
     */
    removeBottle(index) {
        this.level.bottles.splice(index, 1);
        
    }
}


// prüfen wieso meine coins nicht gesammelt werden
