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
    winImage = new Image();
    loseImage = new Image();
    overlayType = null; // 'win' or 'lose'
    overlayAlpha = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.winImage.src = "assets/img/You won, you lost/You Won B.png";
        this.loseImage.src = "assets/img/You won, you lost/You lost.png";
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        this.updateInterval = setInterval(() => {
            this.checkCollisions();
            this.checkBottleCollisions();
            this.checkThrowObjects();
            this.checkCollisionCoin();
            this.checkCollisionBottle();
        }, 1000 / 60);
        this.bossInterval = setInterval(() => {
            this.checkBossShouldMove();
        }, 200);
    }

    freezeGame() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.bossInterval) {
            clearInterval(this.bossInterval);
            this.bossInterval = null;
        }
        this.frozen = true;
    }

    checkThrowObjects(index) {
        if (this.character.bottleAmount > 0) {
        if (this.keyboard.space && this.canThrow) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            this.canThrow = false;
            this.bottleBar.setPercentage(this.character.bottleAmount);
            this.character.bottleAmount -=10 ;
        }
        if (!this.keyboard.space) {
            this.canThrow = true;
        }
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
                        this.overlayType = 'win';
                        this.gameOver = true;
                        this.freezeGame();
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
                        this.overlayType = 'lose';
                        this.gameOver = true;
                        this.freezeGame();
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
        if (this.gameOver) {
            this.drawOverlay();
            
        }
    }

    drawOverlay() {
        this.ctx.save();
        // Ensure overlay draws in canvas coordinates (no camera translation active here)
        let img = this.overlayType === 'win' ? this.winImage : this.loseImage;
        if (!img || !img.complete || img.naturalWidth === 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.overlayType === 'win' ? 'YOU WIN' : 'YOU LOST', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.restore();
            return;
        }
        // simple fade-in
        this.overlayAlpha = Math.min(1, this.overlayAlpha + 0.02);
        this.ctx.globalAlpha = this.overlayAlpha;
        let targetWidth = this.canvas.width * 0.6;
        let scale = (img.width > 0) ? targetWidth / img.width : 1;
        let targetHeight = img.height * scale;
        let x = (this.canvas.width - targetWidth) / 2;
        let y = (this.canvas.height - targetHeight) / 2;
        this.ctx.drawImage(img, x, y, targetWidth, targetHeight);
        this.ctx.globalAlpha = 1;
        this.ctx.restore();
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

    checkCollisionCoin() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                this.coinBar.setPercentage(this.character.coinAmount);
                this.removeCoin(index);
            }
        });
    }

    removeCoin(index) {
        this.level.coins.splice(index, 1);
    }

    checkCollisionBottle() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle();
                this.bottleBar.setPercentage(this.character.bottleAmount);
                this.removeBottle(index);
            }
        });
    }

    removeBottle(index) {
        this.level.bottles.splice(index, 1);

    }
}



// endscreen
// startscreen
// mobile buttons
// sounds
