class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;
    groundlevel = 215;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
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

    jump() {
        this.speedY = 25;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    getRealFrame() {
        this.realX = this.x + this.offset.left;
        this.realY = this.y + this.offset.top;
        this.realWidth = this.width - this.offset.right - this.offset.left;
        this.realHeight = this.height - this.offset.bottom - this.offset.top;
    }

    isColliding(mo) {
        return (
            this.realX + this.realWidth > mo.realX &&
            this.realY + this.realHeight > mo.realY &&
            this.realX < mo.realX + mo.realWidth &&
            this.realY < mo.realY + mo.realHeight
        );
    }

    hit() {
        let now = new Date().getTime();
        if (now - this.lastHit > 500) {
            this.energy -= 20;
            if (this.energy <= 0) {
                this.energy = 0;
            } else {
                this.lastHit = now;
            }
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 2000;
        return timepassed < 0.2;
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
}
