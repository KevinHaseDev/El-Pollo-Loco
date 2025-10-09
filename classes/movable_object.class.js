class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;
    groundlevel = 215;

    /**
     * Wendet die Gravitation auf das Objekt an (wird in einem Intervall ausgeführt).
     * English: Applies gravity to the object (executed in an interval).
     */
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

    /**
     * Prüft, ob sich das Objekt über dem Boden befindet.
     * English: Checks if the object is above the ground.
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < this.groundlevel;
        }
    }

    /**
     * Lässt das Objekt springen, indem die vertikale Geschwindigkeit gesetzt wird.
     * English: Makes the object jump by setting the vertical speed.
     */
    jump() {
        this.speedY = 25
    }

    /**
     * Bewegt das Objekt nach rechts.
     * English: Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Bewegt das Objekt nach links.
     * English: Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Berechnet den tatsächlichen Kollisionsrahmen des Objekts (unter Berücksichtigung von Offsets).
     * English: Calculates the real collision frame of the object (taking offsets into account).
     */
    getRealFrame() {
        this.realX = this.x + this.offset.left;
        this.realY = this.y + this.offset.top;
        this.realWidth = this.width - this.offset.right - this.offset.left;
        this.realHeight = this.height - this.offset.bottom - this.offset.top;
    }

    /**
     * Prüft Kollision mit einem anderen MovableObject anhand der realen Rahmen.
     * English: Checks collision with another MovableObject using the real frames.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo) {
        return this.realX + this.realWidth > mo.realX &&
            this.realY + this.realHeight > mo.realY &&
            this.realX < mo.realX + mo.realWidth &&
            this.realY < mo.realY + mo.realHeight
    }

    /**
     * Reduziert die Energie des Objekts bei einem Treffer und setzt die Zeit des letzten Treffers.
     * English: Reduces the object's energy when hit and sets the time of the last hit.
     */
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

    /**
     * Prüft, ob das Objekt kürzlich getroffen wurde.
     * English: Checks if the object was recently hit
     * .
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 2000;
        return timepassed < 0.2;
    }

    /**
     * Prüft, ob das Objekt aufgebrauchte Energie hat (tot ist).
     * English: Checks if the object has depleted energy (is dead).
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Startet die Animation des Objekts und aktualisiert regelmäßig die realen Kollisionsrahmen.
     * English: Starts the object's animation and regularly updates the real collision frames.
     * @param {Array<string>} images
     * @param {number} interval
     */
    animate(images, interval = 1000 / 60) {
        setInterval(() => {
            this.playAnimation(images);
            this.getRealFrame();
        }, interval);
    }

    /**
     * Spielt eine Bildfolge ab, indem das aktuelle Bild aus dem Image-Cache gesetzt wird.
     * English: Plays a sequence of images by setting the current image from the image cache.
     * @param {Array<string>} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
