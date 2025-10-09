class Coin extends MovableObject {
  width = 100;
  height = 100;

  images_coins = ['assets/img/8_coin/coin_1.png'];

  constructor(x, y) {
    super().loadImage('assets/img/8_coin/coin_1.png');
    this.loadImages(this.images_coins);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.images_coins);
    }, 200);
  }
}