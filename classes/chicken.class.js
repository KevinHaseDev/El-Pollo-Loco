class Chicken extends MovableObject {
    constructor() {
        super(100, 300).loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.width = 80;
        this.height = 80;
        this.x = 400 + Math.random() * 500; // Random x position between 400 and 900
        this.y = 350; // Ground level for chicken
    }
    
}