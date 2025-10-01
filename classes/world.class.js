class World {
    character = new Character();
    level = level_one;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar(); // vielleicht mit einem array lösen
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
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.space) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObject.push(bottle);
        }
    }
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);

            }
        });
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
            this.addToMap(this.statusBar);
            this.ctx.translate(this.camera_x, 0);
            this.addToMap(this.character);
            this.ctx.translate(-this.camera_x, 0);
            let self = this;
            requestAnimationFrame(() => self.draw());
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

// zwei statusbars ( coins & bottles )
// game over screen
// sound effects
// background music
// throw bottles
// win screen
// game ends if he dies or wins
// endboss move towards character
// collect coins
// collect bottles
// statusbar endboss
// jump on enemys to kill them
// fix death animation
//  fix small chicken animation
