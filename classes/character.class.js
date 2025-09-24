class Character extends MovableObject {
    y = 230;

    images_walking = [
        '../assets/img/2_character_pepe/2_walk/W-21.png',
        '../assets/img/2_character_pepe/2_walk/W-22.png',
        '../assets/img/2_character_pepe/2_walk/W-23.png',
        '../assets/img/2_character_pepe/2_walk/W-24.png',
        '../assets/img/2_character_pepe/2_walk/W-25.png',
        '../assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    currentImage = 0;
    world;

    constructor() {
        super(120, 400).loadImage();
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);

        this.animate();
    }

    /**
     * Führt die Geh-Animation aus und bewegt die Figur nach links oder rechts.
     * (Deutsch: Prüft keyboard.right und keyboard.left in world und passt x sowie das angezeigte Bild an.)
     */
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.keyboard) return;

            // Wenn nach rechts gedrückt wird
            if (this.world.keyboard.right) {
                this.x += this.speed * 80;
                this.otherDirection = false;
                let i = this.currentImage % this.images_walking.length;
                let path = this.images_walking[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
            // Wenn nach links gedrückt wird
            else if (this.world.keyboard.left) {
                this.x -= this.speed * 80;
                this.otherDirection = true;
                let i = this.currentImage % this.images_walking.length;
                let path = this.images_walking[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
            this.world.camera_x = -this.x + 120;
        }, 4000/60);
    }

    jump() {
    }

}