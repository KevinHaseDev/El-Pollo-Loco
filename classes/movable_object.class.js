class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;
    groundlevel = 215; // y-Position des Bodens

    getRealFrame() {
        this.realX = this.x + this.offset.left; 
        this.realY = this.y + this.offset.top;
        this.realWidth = this.width - this.offset.right - this.offset.left;
        this.realHeight = this.height - this.offset.bottom - this.offset.top;
    }
    
    applyGravity() {
    setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            // Charakter ist auf dem Boden
            this.y = this.groundlevel;
            this.speedY = 0;
        }
    }, 1000 / 60);
}

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundlevel;
        }
    }

    isColliding(mo) {
    return this.realX + this.realWidth > mo.realX &&
        this.realY + this.realHeight > mo.realY &&
        this.realX < mo.realX + mo.realWidth &&
        this.realY < mo.realY + mo.realHeight
    }

    hit() {
        let now = new Date().getTime();
        if (now - this.lastHit > 500) {
            this.energy -= 10;
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
        return this.energy <= 0;
    }

    animate(images, interval = 1000 / 60) {
        setInterval(() => {
            this.playAnimation(images);
            this.getRealFrame();
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
