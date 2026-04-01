class Coins extends MovableObject {
  width = 100;
  height = 100;

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
  images_coins = [
    'assets/img/8_coin/coin_1.png',
    'assets/img/8_coin/coin_2.png'
  ];

  /**
   * Creates one coin collectible.
   * @param {number} x Horizontal world position.
   * @param {number} y Vertical world position.
   */
  constructor(x, y) {
    super().loadImage('assets/img/8_coin/coin_1.png');
    this.loadImages(this.images_coins);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the coin animation loop.
   */
  animate() {
    setInterval(() => {
      if (this.world && this.world.frozen) return;
      this.getRealFrame();
      this.playAnimation(this.images_coins);
    }, 100);
  }
}