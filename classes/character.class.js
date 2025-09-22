class Character extends MovableObject {
    y = 230;
    constructor() {
        super(120, 400).loadImage('../assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages([
            '../assets/img/2_character_pepe/2_walk/W-21.png',
            '../assets/img/2_character_pepe/2_walk/W-22.png',
            '../assets/img/2_character_pepe/2_walk/W-23.png',
            '../assets/img/2_character_pepe/2_walk/W-24.png',
            '../assets/img/2_character_pepe/2_walk/W-25.png',
            '../assets/img/2_character_pepe/2_walk/W-26.png'
        ]);
    }

    jump() {
    }

}