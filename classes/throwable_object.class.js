
class ThrowableObject extends MovableObject {
    speedX = 20;
    constructor(x, y) {
        super().loadImage('../assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.throw();
        


    }

    throw() {
        this.isThrown = true;
        this.speedY = 30  ;
        this.applyGravity();
        setInterval(() => {
            this.x += 10 ;
        }, 1000 / 60);
    }
}


