class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;
    
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60);
    }

    isAboveGround() {
        return this.y < 213;
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) { // || this instanceof ThrowableObject für Flaschenwurf
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    isColliding(mo) {
    return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x + mo.width &&
        this.y < mo.y + mo.height
    }

    hit() {
    this.energy -= 5;
    if (this.energy < 0) {
        this.energy = 0;
        } else {
        this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // difference in ms
    timepassed = timepassed / 1000; // difference in s
    return timepassed < 0.2;
    }

    isDead() {
        return this.energy == 0;
    }

    animate(images, interval = 1000 / 60) {
        setInterval(() => {
            this.playAnimation(images);
        }, interval);
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 25
    }
}

// if (character.x + character.width > chicken.x &&
//     character.x < chicken.x + chicken.width &&
//     character.x < chicken.x &&
//     character.y + character.height > chicken.y &&
//     character.y < chicken.y + chicken.height) {
//     // collision detected!
    
// }

