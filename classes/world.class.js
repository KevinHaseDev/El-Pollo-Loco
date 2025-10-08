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
    canThrow = true;

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
            this.checkBossShouldMove();
            this.checkBottleCollisions();
            this.checkThrowObjects();

        }, 1000 / 60);

    }

    checkThrowObjects() {
        if (this.keyboard.space && this.canThrow) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);

            this.canThrow = false; // blockiert weiteren Wurf, solange Taste gedrückt bleibt
        }

        // Wenn Taste losgelassen wird, darf man wieder werfen
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
                if (enemy.deadcounter > 20) {
                    this.level.enemies = this.level.enemies.filter(e => e !== enemy);
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
                // Beispiel: Coins und Bottles updaten
                // this.coinBar.setPercentage(this.character.coins);
                // this.bottleBar.setPercentage(this.character.bottles);
            } 
            if (enemy.deadcounter > 20) {
                    this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                }
        });
    }

    checkBossShouldMove() {
        // Debug-Ausgabe
        // console.log('Character X:', this.character.x);
        // console.log('Character Y:', this.character.y);

        if (this.character.x >= 3595) {
            this.level.enemies[0].animate();
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
        // mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
        // mo.drawOffsetFrame(this.ctx);
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
