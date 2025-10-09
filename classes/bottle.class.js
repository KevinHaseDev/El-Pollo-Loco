class Bottle extends DrawableObject {
  width = 70;
  height = 70;
  y = 355;
  constructor(x) {
    super();
    this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = x;
  }
}