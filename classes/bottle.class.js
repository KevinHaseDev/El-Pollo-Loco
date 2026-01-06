class Bottles extends MovableObject {
  images_bottles = [
    'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];
  width = 70;
  height = 70;
  y = 355;
  realX;
  realY;
  realWidth;
  realHeight;
  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };
  constructor(x) {
    super();
    this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = x;
    this.loadImages(this.images_bottles);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.getRealFrame();
      this.playAnimation(this.images_bottles);
    }, 200);
  }
}