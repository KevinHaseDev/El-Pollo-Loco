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
    totalCoins = 0;
    totalBottles = 0;
    collectedCoins = 0;
    collectedBottles = 0;
    gameOver;
    winImage = new Image();
    loseImage = new Image();
    overlayType = null; // 'win' or 'lose'
    overlayAlpha = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeCollectionProgress();
        this.setWorld();
        this.winImage.src = "assets/img/You won, you lost/You Won B.png";
        this.loseImage.src = "assets/img/You won, you lost/You lost.png";
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.syncWorldReferences();
    }

    /**
     * Setzt die World-Referenz fuer ein Objekt-Array.
     */
    assignWorldReference(objectArray) {
        if (!objectArray) {
            return;
        }
        objectArray.forEach((gameObject) => {
            gameObject.world = this;
        });
    }

    /**
     * Synchronisiert die World-Referenz fuer alle relevanten Objekte.
     * So reagieren auch spaeter gespawnte Objekte korrekt auf world.frozen.
     */
    syncWorldReferences() {
        this.assignWorldReference(this.level.enemies);
        this.assignWorldReference(this.level.clouds);
        this.assignWorldReference(this.level.coins);
        this.assignWorldReference(this.level.bottles);
        this.assignWorldReference(this.throwableObject);
    }

    /**
     * Initialisiert die Sammel-Fortschrittswerte für Coins und Flaschen.
     * Die Bars starten bei 0% und füllen sich bis 100%, wenn alle Items eingesammelt wurden.
     */
    initializeCollectionProgress() {
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.collectedCoins = 0;
        this.collectedBottles = 0;
        this.updateCoinBarProgress();
        this.updateBottleBarProgress();
    }

    /**
     * Berechnet den prozentualen Sammelfortschritt.
     * Gibt bei 0 Gesamtitems direkt 100 zurück, um Sonderfälle sauber zu behandeln.
     */
    calculateCollectionPercentage(collectedAmount, totalAmount) {
        if (totalAmount === 0) {
            return 100;
        }
        return Math.min(100, (collectedAmount / totalAmount) * 100);
    }

    /**
     * Aktualisiert die Coin-Bar anhand der tatsächlich eingesammelten Coins.
     */
    updateCoinBarProgress() {
        let percentage = this.calculateCollectionPercentage(this.collectedCoins, this.totalCoins);
        this.coinBar.setPercentage(percentage);
    }

    /**
     * Aktualisiert die Bottle-Bar anhand der tatsächlich eingesammelten Flaschen.
     */
    updateBottleBarProgress() {
        let percentage = this.calculateCollectionPercentage(this.collectedBottles, this.totalBottles);
        this.bottleBar.setPercentage(percentage);
    }

    run() {
        this.updateInterval = setInterval(() => {
            this.syncWorldReferences();
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
        this.stopSpawnIntervals();
        this.resetKeyboardInput();
        this.frozen = true;
    }

    /**
     * Stoppt die Spawn-Intervalle aus dem Level-Script beim Game-Over.
     */
    stopSpawnIntervals() {
        if (typeof spawnIntervalId !== 'undefined' && spawnIntervalId) {
            clearInterval(spawnIntervalId);
            spawnIntervalId = null;
        }
        if (typeof cloudSpawnIntervalId !== 'undefined' && cloudSpawnIntervalId) {
            clearInterval(cloudSpawnIntervalId);
            cloudSpawnIntervalId = null;
        }
    }

    /**
     * Setzt alle Input-Flags zurueck, damit nach Game-Over keine Aktionen mehr aktiv sind.
     */
    resetKeyboardInput() {
        this.keyboard.left = false;
        this.keyboard.right = false;
        this.keyboard.up = false;
        this.keyboard.down = false;
        this.keyboard.space = false;
    }

    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
        if (!this.keyboard.space) {
            this.canThrow = true;
        }
    }

    canThrowBottle() {
        return this.character.bottleAmount > 0 && this.keyboard.space && this.canThrow;
    }

    throwBottle() {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        bottle.world = this;
        this.throwableObject.push(bottle);
        this.canThrow = false;
        this.character.bottleAmount -= 20;
        this.collectedBottles = Math.max(0, this.collectedBottles - 1);
        this.updateBottleBarProgress();
    }

    checkBottleCollisions() {
        this.throwableObject.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyCollision(bottle, enemy);
                this.cleanupDeadEnemy(enemy);
                this.checkBossDefeat();
            });
        });
    }

    handleBottleEnemyCollision(bottle, enemy) {
        if (bottle.isColliding(enemy)) {
            enemy.hit();
            this.throwableObject = this.throwableObject.filter(b => b !== bottle);
        }
    }

    cleanupDeadEnemy(enemy) {
        if (enemy.deadtimer > 20) {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }
    }

    checkBossDefeat() {
        if (this.boss.isDead()) {
            setTimeout(() => {
                this.triggerGameEnd('win');
            }, 1000);
        }
    }

    triggerGameEnd(type) {
        this.overlayType = type;
        this.gameOver = true;
        this.freezeGame();
        this.showRetryButton();
    }

    showRetryButton() {
        let btn = document.getElementById('retry-button');
        if (btn) btn.classList.add('visible');
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            const didJumpOn = this.handleJumpOnEnemy(enemy);
            if (!didJumpOn) {
                this.handleCharacterHitByEnemy(enemy);
            }
            this.removeDeadEnemy(enemy);
        });
    }

    // Returns true if the character successfully jumped on the enemy
    handleJumpOnEnemy(enemy) {
        if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0) {
            console.log("Collision with:", enemy.constructor.name);
            enemy.hit();
            this.character.speedY = 15;
            return true;
        }
        return false;
    }

    handleCharacterHitByEnemy(enemy) {
        if (this.character.isColliding(enemy) && !this.isJumpingOnEnemy()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            console.log("Character hit! Energy:", this.character.energy);
            this.checkCharacterDeath();
        }
    }

    isJumpingOnEnemy() {
        return this.character.isAboveGround() && this.character.speedY < 0;
    }

    checkCharacterDeath() {
        if (this.character.isDead()) {
            setTimeout(() => {
                this.triggerGameEnd('lose');
            }, 1000);
        }
    }

    removeDeadEnemy(enemy) {
        if (enemy.deadtimer > 10) {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }
    }

    checkBossShouldMove() {
        if (this.character.x >= 3595) {
            this.boss.animate();
            console.log('Boss is moving now!');
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorldObjects();
        this.drawUI();
        this.drawCharacter();
        requestAnimationFrame(() => this.draw());
        if (this.gameOver) {
            this.drawOverlay();
        }
    }

    drawWorldObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);
        if (this.boss) { this.addToMap(this.boss.endbossBar); }
        this.addObjectToMap(this.throwableObject);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUI() {
        this.addObjectToMap(this.statusBars);
    }

    drawCharacter() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawOverlay() {
        this.ctx.save();
        let img = this.overlayType === 'win' ? this.winImage : this.loseImage;
        if (!img || !img.complete || img.naturalWidth === 0) {
            this.drawFallbackOverlay();
            return;
        }
        this.drawImageOverlay(img);
        this.ctx.restore();
    }

    drawFallbackOverlay() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px sans-serif';
        this.ctx.textAlign = 'center';
        let text = this.overlayType === 'win' ? 'YOU WIN' : 'YOU LOST';
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }

    drawImageOverlay(img) {
        this.overlayAlpha = Math.min(1, this.overlayAlpha + 0.02);
        this.ctx.globalAlpha = this.overlayAlpha;
        let targetWidth = this.canvas.width * 0.6;
        let scale = (img.width > 0) ? targetWidth / img.width : 1;
        let targetHeight = img.height * scale;
        let x = (this.canvas.width - targetWidth) / 2;
        let y = (this.canvas.height - targetHeight) / 2;
        this.ctx.drawImage(img, x, y, targetWidth, targetHeight);
        this.ctx.globalAlpha = 1;
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
                this.collectedCoins++;
                this.updateCoinBarProgress();
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
                this.collectedBottles++;
                this.updateBottleBarProgress();
                this.removeBottle(index);
            }
        });
    }

    removeBottle(index) {
        this.level.bottles.splice(index, 1);
    }
}
// sounds
