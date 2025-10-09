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
    boss = this.level.enemies.find(e => e instanceof Endboss);

    statusBars = [this.healthBar, this.coinBar, this.bottleBar];
    throwableObject = [];
    canThrow = true;
    gameOver;

    /**
     * Konstruktor: Initialisiert die Welt mit Canvas und Keyboard.
     * English: Constructor: initializes the world with canvas and keyboard.
     * @param {HTMLCanvasElement} canvas
     * @param {object} keyboard
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Setzt die Referenz zur Welt im Charakter.
     * English: Sets the reference to this world on the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Startet die Spiel-Loop und ruft Prüfroutinen periodisch auf.
     * English: Starts the game loop and regularly calls check routines.
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
            
            this.checkBottleCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);
        setInterval(() => {
            this.checkBossShouldMove();
        }, 200);
    }

    /**
     * Prüft, ob der Spieler die Wurf-Taste drückt und erzeugt ThrowableObjects.
     * English: Checks if the player presses the throw key and spawns throwable objects.
     */
    checkThrowObjects() {
        if (this.keyboard.space && this.canThrow) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
            this.canThrow = false;
        }
        if (!this.keyboard.space) {
            this.canThrow = true;
        }
    }

    /**
     * Prüft Kollisionen zwischen geworfenen Objekten und Gegnern und entfernt getroffene Flaschen.
     * English: Checks collisions between thrown objects and enemies and removes hit bottles.
     */
    checkBottleCollisions() {
        this.throwableObject.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    enemy.hit();
                    this.throwableObject = this.throwableObject.filter(b => b !== bottle);
                }
                if (enemy.deadtimer > 20) {
                    this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                    if (enemy.isDead() instanceof Endboss) {
                    this.gameOver = true;
                    return;
                    
                }
                }
            });
        });
    }

    /**
     * Prüft Kollisionen zwischen Charakter und Gegnern und reagiert entsprechend (Hit / Stomp).
     * English: Checks collisions between character and enemies and reacts accordingly (hit / stomp).
     */
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
                    this.gameOver = true;
                }
            }
            if (enemy.deadtimer > 10) {
                this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                
            }
        });
    }

    /**
     * Prüft, ob der Boss sich bewegen soll (z.B. basierend auf Charakterposition).
     * English: Checks whether the boss should start moving (e.g. based on character position).
     */
    checkBossShouldMove() {
        if (this.character.x >= 3595) {
            this.level.enemies[0].animate();
            console.log('Boss is moving now!');
        }
    }

    /**
     * Zeichnet die gesamte Szene: Hintergrund, Clouds, Enemies, ThrowableObjects, Statusbars und Character.
     * English: Draws the entire scene: background, clouds, enemies, throwable objects, status bars and character.
     */
    draw() {
        if (this.gameOver) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        if (this.boss) {this.addToMap(this.boss.endbossBar);}
        this.addObjectToMap(this.throwableObject);
        this.ctx.translate(-this.camera_x, 0);
        this.addObjectToMap(this.statusBars);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Fügt ein Array von Objekten zur Karte hinzu (ruft addToMap für jedes Objekt).
     * English: Adds an array of objects to the map (calls addToMap for each object).
     * @param {Array} objectArray
     */
    addObjectToMap(objectArray) {
        objectArray.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /**
     * Zeichnet ein einzelnes Movable/Drawable Object auf das Canvas, inklusive horizontaler Spiegelung.
     * English: Draws a single movable/drawable object on the canvas, including horizontal flipping.
     * @param {object} mo
     */
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

    /**
     * Spiegel das Bild horizontal und passe die X-Position an.
     * English: Flips the image horizontally and adjusts the X position.
     * @param {object} mo
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Setzt die Spiegelung zurück und korrigiert die X-Position wieder.
     * English: Restores the flip and corrects the X position back.
     * @param {object} mo
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }
}
