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
    lastAudioSync = 0;

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
        this.level.syncWorldReferences(this, this.throwableObject);
    }

    /** Initializes collectible progress counters and bars. */
    initializeCollectionProgress() {
        this.totalCoins = this.level.coins.length;
        this.totalBottles = this.level.bottles.length;
        this.collectedCoins = 0;
        this.collectedBottles = 0;
        this.coinBar.setCollectionProgress(this.collectedCoins, this.totalCoins);
        this.bottleBar.setCollectionProgress(this.collectedBottles, this.totalBottles);
    }

    /** Starts main world update loops. */
    run() {
        this.updateInterval = setInterval(() => {
            this.level.syncWorldReferences(this, this.throwableObject);
            this.checkCollisions();
            this.checkBottleCollisions();
            this.checkThrowObjects();
            this.checkCollisionCoin();
            this.checkCollisionBottle();
            this.syncAmbientEnemyAudio();
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
        this.keyboard.reset();
        this.frozen = true;
        if (window.gameSound && typeof window.gameSound.stopGameplayLoops === 'function') {
            window.gameSound.stopGameplayLoops();
        }
    }

    /** Stops globally registered spawn intervals if available. */
    stopSpawnIntervals() {
        if (typeof stopLevelOneSpawning === 'function') {
            stopLevelOneSpawning();
        }
    }

    /** Handles bottle throwing input and cooldown state. */
    checkThrowObjects() {
        let throwState = this.character.resolveThrowState(this.keyboard.space, this.canThrow);
        if (throwState.shouldThrow) {
            this.throwBottle();
        }
        this.canThrow = throwState.canThrow;
    }

    /** Creates and launches one throwable bottle object. */
    throwBottle() {
        let bottle = this.character.createThrowableBottle();
        bottle.world = this;
        this.throwableObject.push(bottle);
        this.character.bottleAmount -= 20;
        this.character.startThrowAnimation();
        this.collectedBottles = Math.max(0, this.collectedBottles - 1);
        this.bottleBar.setCollectionProgress(this.collectedBottles, this.totalBottles);
    }

    /** Checks collisions between throwable bottles and enemies. */
    checkBottleCollisions() {
        this.throwableObject = this.level.handleBottleEnemyCollisions(
            this.throwableObject,
            this.boss,
            () => {
                setTimeout(() => {
                    this.triggerGameEnd('win');
                }, 1000);
            }
        );
    }

    /** Sets game-over state and displays endscreen actions. */
    triggerGameEnd(type) {
        this.overlayType = type;
        this.gameOver = true;
        this.playEndSound(type);
        this.freezeGame();
        if (typeof showEndscreenActions === 'function') {
            showEndscreenActions();
        }
    }

    /**
     * Plays the matching end-state sound for win or lose.
     * @param {'win' | 'lose'} type End state.
     */
    playEndSound(type) {
        if (!window.gameSound) return;
        if (type === 'win' && typeof window.gameSound.onWin === 'function') {
            window.gameSound.onWin();
            return;
        }
        if (type === 'lose' && typeof window.gameSound.onLose === 'function') {
            window.gameSound.onLose();
        }
    }

    /** Disposes world resources and stops rendering loop. */
    dispose() {
        this.isActive = false;
        this.freezeGame();
        if (typeof hideEndscreenActions === 'function') {
            hideEndscreenActions();
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Synchronizes enemy walking ambience in fixed intervals.
     */
    syncAmbientEnemyAudio() {
        if (!window.gameSound) return;
        let now = Date.now();
        if (now - this.lastAudioSync < 250) return;
        this.lastAudioSync = now;
        let hasChicken = this.level.enemies.some((enemy) => {
            return typeof Chicken !== 'undefined' && enemy instanceof Chicken && !enemy.isDead();
        });
        let hasSmallChicken = this.level.enemies.some((enemy) => {
            return typeof SmallChicken !== 'undefined' && enemy instanceof SmallChicken && !enemy.isDead();
        });
        if (typeof window.gameSound.syncEnemyAmbience === 'function') {
            window.gameSound.syncEnemyAmbience(hasChicken, hasSmallChicken);
        }
    }

    /** Checks character collisions against all active enemies. */
    checkCollisions() {
        this.level.handleCharacterEnemyCollisions(
            this.character,
            (characterEnergy) => {
                this.healthBar.setPercentage(characterEnergy);
            },
            () => {
                setTimeout(() => {
                    this.triggerGameEnd('lose');
                }, 1000);
            }
        );
    }

    /** Starts boss animation once player reaches endboss area. */
    checkBossShouldMove() {
        if (this.boss.shouldStartMoving(this.character.x)) {
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
        let objectGroups = this.level.getScrollableObjectGroups(this.throwableObject, this.boss);
        objectGroups.forEach((group) => {
            this.addObjectToMap(group);
        });
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
            let text = this.overlayType === 'win' ? 'YOU WIN' : 'YOU LOST';
            DrawableObject.drawFallbackOverlay(this.ctx, this.canvas.width, this.canvas.height, text);
            this.ctx.restore();
            return;
        }
        this.overlayAlpha = Math.min(1, this.overlayAlpha + 0.02);
        DrawableObject.drawImageOverlay(this.ctx, img, this.canvas.width, this.canvas.height, this.overlayAlpha);
        this.ctx.restore();
    }

    /** Draws each object from an array into the world map. */
    addObjectToMap(objectArray) {
        objectArray.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /** Draws one map object including optional flip transform. */
    addToMap(mo) {
        mo.drawWithDirection(this.ctx);
    }

    /** Checks coin pickups and updates collection progress. */
    checkCollisionCoin() {
        this.level.collectCollidingCoins(this.character, () => {
            this.collectedCoins++;
            this.coinBar.setCollectionProgress(this.collectedCoins, this.totalCoins);
        });
    }

    /** Checks bottle pickups and updates collection progress. */
    checkCollisionBottle() {
        this.level.collectCollidingBottles(this.character, () => {
            this.collectedBottles++;
            this.bottleBar.setCollectionProgress(this.collectedBottles, this.totalBottles);
        });
    }
}
