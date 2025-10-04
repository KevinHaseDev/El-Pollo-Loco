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
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 215;
        }
    }

    isColliding(mo) {
    return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x + mo.width &&
        this.y < mo.y + mo.height
    }

    hit() {
        let now = new Date().getTime();
        if (now - this.lastHit > 500) {
            this.energy -= 20;
            if (this.energy < 0) {
                this.energy = 0;
                } else {
                this.lastHit = now;
                }
        }
    }

    isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // difference in ms
    timepassed = timepassed / 2000; // difference in s
    return timepassed <0.2;
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
