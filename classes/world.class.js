class World {
    character = new Character();
    level = levelOne;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
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
    overlayType = null;
    overlayAlpha = 0;
    animationFrameId = null;
    isActive = true;

    /** Creates a playable world bound to one canvas and keyboard instance. */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeCollectionProgress();
        this.setWorld();
        this.winImage.src = "assets/img/You won, you lost/You Won B.png";
        this.loseImage.src = "assets/img/You won, you lost/You lost b.png";
        this.draw();
        this.run();
    }

    /** Assigns world reference to character and all entity groups. */
    setWorld() {
        this.character.world = this;
        this.syncWorldReferences();
    }

    /** Assigns world reference to each object in the provided list. */
    assignWorldReference(objectArray) {
        if (!objectArray) {
            return;
        }
        objectArray.forEach((gameObject) => {
            gameObject.world = this;
        });
    }

    /** Synchronizes world references for all active entity lists. */
    syncWorldReferences() {
        this.assignWorldReference(this.level.enemies);
        this.assignWorldReference(this.level.clouds);
        this.assignWorldReference(this.level.coins);
        this.assignWorldReference(this.level.bottles);
        this.assignWorldReference(this.throwableObject);
    }

    /** Initializes collectible progress counters and bars. */
    initializeCollectionProgress() {
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.collectedCoins = 0;
        this.collectedBottles = 0;
        this.updateCoinBarProgress();
        this.updateBottleBarProgress();
    }

    /** Calculates collection percentage from current and total values. */
    calculateCollectionPercentage(collectedAmount, totalAmount) {
        if (totalAmount === 0) {
            return 100;
        }
        return Math.min(100, (collectedAmount / totalAmount) * 100);
    }

    /** Updates the coin status bar based on collection progress. */
    updateCoinBarProgress() {
        let percentage = this.calculateCollectionPercentage(this.collectedCoins, this.totalCoins);
        this.coinBar.setPercentage(percentage);
    }

    /** Updates the bottle status bar based on collection progress. */
    updateBottleBarProgress() {
        let percentage = this.calculateCollectionPercentage(this.collectedBottles, this.totalBottles);
        this.bottleBar.setPercentage(percentage);
    }

    /** Starts main world update loops. */
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

    /** Freezes all runtime loops, input, and spawning. */
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

    /** Stops globally registered spawn intervals if available. */
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

    /** Resets all keyboard inputs to false. */
    resetKeyboardInput() {
        this.keyboard.left = false;
        this.keyboard.right = false;
        this.keyboard.up = false;
        this.keyboard.down = false;
        this.keyboard.space = false;
    }

    /** Handles bottle throwing input and cooldown state. */
    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
        if (!this.keyboard.space) {
            this.canThrow = true;
        }
    }

    /** Returns true when a bottle can be thrown. */
    canThrowBottle() {
        return this.character.bottleAmount > 0 && this.keyboard.space && this.canThrow;
    }

    /** Creates and launches one throwable bottle object. */
    throwBottle() {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        bottle.world = this;
        this.throwableObject.push(bottle);
        this.canThrow = false;
        if (this.character) {
            this.character.bottleAmount -= 20;
            this.character.isThrowing = true;
            this.character.idleStartTime = new Date().getTime();
            setTimeout(() => {
                if (this.character) this.character.isThrowing = false;
            }, this.character.throwAnimationDuration || 400);
        }
        this.collectedBottles = Math.max(0, this.collectedBottles - 1);
        this.updateBottleBarProgress();
    }

    /** Checks collisions between throwable bottles and enemies. */
    checkBottleCollisions() {
        this.throwableObject.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyCollision(bottle, enemy);
                this.cleanupDeadEnemy(enemy);
                this.checkBossDefeat();
            });
        });
    }

    /** Applies bottle hit behavior against one enemy. */
    handleBottleEnemyCollision(bottle, enemy) {
        if (bottle.isColliding(enemy)) {
            enemy.hit();
            this.throwableObject = this.throwableObject.filter(b => b !== bottle);
        }
    }

    /** Removes an enemy from level list after death timer threshold. */
    cleanupDeadEnemy(enemy) {
        if (enemy.deadtimer > 20) {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }
    }

    /** Triggers win state when boss has no energy left. */
    checkBossDefeat() {
        if (this.boss.isDead()) {
            setTimeout(() => {
                this.triggerGameEnd('win');
            }, 1000);
        }
    }

    /** Sets game-over state and displays endscreen actions. */
    triggerGameEnd(type) {
        this.overlayType = type;
        this.gameOver = true;
        this.freezeGame();
        this.showEndscreenButtons();
    }

    /** Shows endscreen action buttons and updates aria state. */
    showEndscreenButtons() {
        let actionContainer = document.getElementById('endscreen-actions');
        if (actionContainer) {
            actionContainer.classList.add('visible');
            actionContainer.setAttribute('aria-hidden', 'false');
        }
    }

    /** Hides endscreen action buttons and updates aria state. */
    hideEndscreenButtons() {
        let actionContainer = document.getElementById('endscreen-actions');
        if (actionContainer) {
            actionContainer.classList.remove('visible');
            actionContainer.setAttribute('aria-hidden', 'true');
        }
    }

    /** Disposes world resources and stops rendering loop. */
    dispose() {
        this.isActive = false;
        this.freezeGame();
        this.hideEndscreenButtons();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /** Checks character collisions against all active enemies. */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            let didJumpOn = this.handleJumpOnEnemy(enemy);
            if (!didJumpOn) {
                this.handleCharacterHitByEnemy(enemy);
            }
            this.removeDeadEnemy(enemy);
        });
    }

    /** Handles jump-on-enemy collision behavior. */
    handleJumpOnEnemy(enemy) {
        if (enemy.isDead()) {
            return false;
        }
        if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0) {
            enemy.hit();
            this.character.speedY = 15;
            return true;
        }
        return false;
    }

    /** Handles enemy damage to character on collision. */
    handleCharacterHitByEnemy(enemy) {
        if (enemy.isDead()) {
            return;
        }
        if (this.character.isColliding(enemy) && !this.isJumpingOnEnemy()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            this.checkCharacterDeath();
        }
    }

    /** Returns true when character is currently jumping downward onto enemies. */
    isJumpingOnEnemy() {
        return this.character.isAboveGround() && this.character.speedY < 0;
    }

    /** Triggers lose state when character is dead. */
    checkCharacterDeath() {
        if (this.character.isDead()) {
            setTimeout(() => {
                this.triggerGameEnd('lose');
            }, 1000);
        }
    }

    /** Removes enemy after death animation timer threshold. */
    removeDeadEnemy(enemy) {
        if (enemy.deadtimer > 10) {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }
    }

    /** Starts boss animation once player reaches endboss area. */
    checkBossShouldMove() {
        if (this.character.x >= 3595 || this.boss.isHurt()) {
            this.boss.animate();
        }
    }

    /** Draws one full frame of the world and overlay states. */
    draw() {
        if (!this.isActive) {
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorldObjects();
        this.drawUI();
        this.drawCharacter();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
        if (this.gameOver) {
            this.drawOverlay();
        }
    }

    /** Draws all scrollable world objects in camera space. */
    drawWorldObjects() {
        this.ctx.translate(this.cameraX, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.coins);
        if (this.boss) { this.addToMap(this.boss.endbossBar); }
        this.addObjectToMap(this.throwableObject);
        this.ctx.translate(-this.cameraX, 0);
    }

    /** Draws all fixed UI status bars. */
    drawUI() {
        this.addObjectToMap(this.statusBars);
    }

    /** Draws the main character in camera space. */
    drawCharacter() {
        this.ctx.translate(this.cameraX, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.cameraX, 0);
    }

    /** Draws win/lose overlay or fallback text overlay. */
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

    /** Draws a simple text fallback overlay when image is unavailable. */
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

    /** Draws and fades in the win/lose overlay image. */
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

    /** Draws each object from an array into the world map. */
    addObjectToMap(objectArray) {
        objectArray.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /** Draws one map object including optional flip transform. */
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

    /** Flips the drawing context for mirrored sprites. */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /** Restores drawing context after sprite flip. */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }

    /** Checks coin pickups and updates collection progress. */
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

    /** Removes one collected coin by array index. */
    removeCoin(index) {
        this.level.coins.splice(index, 1);
    }

    /** Checks bottle pickups and updates collection progress. */
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

    /** Removes one collected bottle by array index. */
    removeBottle(index) {
        this.level.bottles.splice(index, 1);
    }
}