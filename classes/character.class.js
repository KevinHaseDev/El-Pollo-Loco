class Character extends MovableObject {
    images_idle = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    images_idle_long = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    images_walking = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    images_jumping = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png',

    ];
    images_hurt = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png'
    ];
    images_dead = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png'
    ];
    y = 213;
    currentImage = 0;
    world;
    speed = 5;
    realX;
    realY;
    realWidth;
    realHeight;
    offset = {
        top: 100,
        bottom: 0,
        left: 30,
        right: 30
    };
    energy = 100;
    deadtimer = 0;
    coinAmount = 0;
    bottleAmount = 0

    constructor() {
        super(120, 400)
        this.loadImage(this.images_idle[0]);
        this.loadImages(this.images_idle);
        this.loadImages(this.images_idle_long);
        this.loadImages(this.images_walking);
        this.loadImages(this.images_jumping);
        this.loadImages(this.images_dead);
        this.loadImages(this.images_hurt);
        this.applyGravity();
        this.animate();
        this.getRealFrame();
    }

    animate() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            this.getRealFrame();
            if (this.world.keyboard.right && this.x < this.world.level.level_end_x) {
                this.moveCharacterToRight();
            } else if (this.world.keyboard.left && this.x > 0) {
                this.moveCharacterToLeft();
            }
            if (this.world.keyboard.up && !this.isAboveGround()) {
                this.triggerJumpAction();
            }
            this.world.camera_x = -this.x + 120;
        }, 1000 / 60);

        this.idleStartTime = new Date().getTime();
        this.controlCharacterAnimation();
    }

    moveCharacterToRight() {
        this.moveRight();
        this.otherDirection = false;
        this.idleStartTime = new Date().getTime();
    }

    moveCharacterToLeft() {
        this.moveLeft();
        this.otherDirection = true;
        this.idleStartTime = new Date().getTime();
    }

    triggerJumpAction() {
        this.jump();
        this.idleStartTime = new Date().getTime();
    }

    controlCharacterAnimation() {
        setInterval(() => {
            if (this.world && this.world.frozen) return;
            let idleDuration = (new Date().getTime() - this.idleStartTime) / 1000;
            if (this.isHurt()) {
                this.hurtAnimation();
                return;
            }
            if (this.isDead()) {
                this.deadtimer++;
                this.deadAnimation();
                return;
            }
            if (this.isAboveGround()) {
                this.playAnimation(this.images_jumping);
                return;
            }
            this.selectAnimation(idleDuration);
        }, 100);
    }

    selectAnimation(idleDuration) {
        if (this.world.keyboard.right || this.world.keyboard.left) {
            this.playAnimation(this.images_walking);
        } else if (idleDuration > 5) {
            this.playAnimation(this.images_idle_long);
        } else {
            this.playAnimation(this.images_idle);
        }
    }

    hurtAnimation() {
        this.playAnimation(this.images_hurt);
    }

    deadAnimation() {

        this.playAnimation(this.images_dead);
    }

    collectCoin() {
        this.coinAmount += 20;
    }

    collectBottle() {
        this.bottleAmount += 20;
    }
}