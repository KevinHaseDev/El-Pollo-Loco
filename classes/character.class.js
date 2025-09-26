class Character extends MovableObject {
    y = 80;
    images_walking = [
        '../assets/img/2_character_pepe/2_walk/W-21.png',
        '../assets/img/2_character_pepe/2_walk/W-22.png',
        '../assets/img/2_character_pepe/2_walk/W-23.png',
        '../assets/img/2_character_pepe/2_walk/W-24.png',
        '../assets/img/2_character_pepe/2_walk/W-25.png',
        '../assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    images_jumping = [
        '../assets/img/2_character_pepe/3_jump/J-31.png',
        '../assets/img/2_character_pepe/3_jump/J-32.png',
        '../assets/img/2_character_pepe/3_jump/J-33.png',
        '../assets/img/2_character_pepe/3_jump/J-34.png',
        '../assets/img/2_character_pepe/3_jump/J-35.png',
        '../assets/img/2_character_pepe/3_jump/J-36.png',
        '../assets/img/2_character_pepe/3_jump/J-37.png',
        '../assets/img/2_character_pepe/3_jump/J-38.png',
        '../assets/img/2_character_pepe/3_jump/J-39.png',

    ];
    currentImage = 0;
    world;
    speed = 10;

    constructor() {
        super(120, 400)
        this.loadImage(this.images_walking[0]);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.updateWalkingFrame(this.images_walking);
        this.applyGravity();
        this.animate(this.images_walking);
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.right && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            } else if (this.world.keyboard.left && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if ((this.world.keyboard.up || this.world.keyboard.space) && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 120;
        }, 2500 / 60);

        setInterval(() => {

            if (this.isAboveGround()) {
                this.updateWalkingFrame(this.images_jumping)
            }

            if ((this.world.keyboard.right || this.world.keyboard.left) && !this.isAboveGround())
                this.updateWalkingFrame(this.images_walking)
        }, 100);
    }
}