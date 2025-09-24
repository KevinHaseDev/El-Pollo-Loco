class World {
    character = new Character();
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
    }

    /**
     * Setzt Referenzen, damit das Character-Objekt auf diese World zugreift.
     * (Deutsch: Dokumentation)
     */
    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear canvas

        this.ctx.translate(this.camera_x, 0); // Kamera verschieben

        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen




        // draw wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    addObjectToMap(object) {
        object.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        this.ctx.save();

        if (mo.otherDirection) {
            // nach links spiegeln
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
        } else {
            this.ctx.translate(mo.x, mo.y);
            this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
        }

        this.ctx.restore();
    }
}