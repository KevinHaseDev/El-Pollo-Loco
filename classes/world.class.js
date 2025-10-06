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
    statusBars = [this.healthBar, this.coinBar, this.bottleBar];
    throwableObject = [];

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
            this.checkThrowObjects();
            this.checkBossShouldMove();
            this.checkBottleCollisions()
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.space) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
        }
    }

    checkBottleCollisions() {
        this.throwableObject.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    enemy.hit();

                    // Gegner entfernen
                    this.level.enemies = this.level.enemies.filter(e => e !== enemy);

                    // Flasche ggf. auch entfernen oder "zerbrechen"
                    this.throwableObject = this.throwableObject.filter(b => b !== bottle);
                }
            });
        });
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {

            if (this.character.isColliding(enemy) && this.character.isAboveGround()) {
                console.log("Collision with:", enemy.constructor.name);
                enemy.hit();
                this.level.enemies = this.level.enemies.filter(e => e !== enemy);
            } else if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
                // Beispiel: Coins und Bottles updaten
                // this.coinBar.setPercentage(this.character.coins);
                // this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

    checkBossShouldMove() {
        console.log('Character X:', this.character.x); // Debug-Ausgabe


        if (this.character.x >= 3599) {
            this.level.enemies[this.level.enemies.length - 1].animateWalking();
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
        this.addObjectToMap(this.throwableObject);
        this.ctx.translate(-this.camera_x, 0);
        this.addObjectToMap(this.statusBars);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    addObjectToMap(object) {
        object.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
        mo.drawOffsetFrame(this.ctx);
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
}

// collect coins
// collect bottles
// throw bottles if collect bottles > 0
// win screen
// game ends if he dies or wins
// endboss hurt when hit by bottle
// endboss dies when hit 5 times
// statusbar endboss
// fix death animation
// fix small chicken animation
// fullscreen
// Tasten overlay
// game over screen
// sound effects
// background music
