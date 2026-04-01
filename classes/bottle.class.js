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
    top: 5,
    bottom: 5,
    left: 10,
    right: 5
  };

  /**
   * Creates one bottle collectible at a random or fixed x position.
   * @param {number} x Horizontal world position.
   */
  constructor(x) {
    super();
    this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = x;
    this.loadImages(this.images_bottles);
    this.animate();
  }

  /**
   * Starts the bottle idle animation loop.
   */
  animate() {
    setInterval(() => {
      if (this.world && this.world.frozen) return;
      this.getRealFrame();
      this.playAnimation(this.images_bottles);
    }, 200);
  }
}