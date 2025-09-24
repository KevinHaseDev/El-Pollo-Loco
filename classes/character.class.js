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
        this.updateWalkingFrame();
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
            if (this.world.keyboard.right && this.x < this.world.level.level_end_x) {
                this.x += this.speed * 80;
                this.otherDirection = false;
                this.updateWalkingFrame();
                
            }
            // Wenn nach links gedrückt wird
            else if (this.world.keyboard.left && this.x > 0) {
                this.x -= this.speed * 80;
                this.otherDirection = true;
                this.updateWalkingFrame();
            }
            this.world.camera_x = -this.x + 120;
        }, 2500/60);
    }

    jump() {
    }

}