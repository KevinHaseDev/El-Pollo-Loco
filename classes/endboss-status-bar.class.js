class EndbossBar extends StatusBar {
  static endboss_healthbar = [
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
    'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
  ];

  percentage = 100;

  constructor(x, y) {
    super(EndbossBar.endboss_healthbar);
    this.x = x;
    this.y = y;
    this.width = 130;
    this.height = 30;
    this.visible = false;
    this.setPercentage(100);
  }

  setVisibility(isVisible) {
    this.visible = isVisible;
    if (!this.visible) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    } else {
      this.width = 130;
      this.height = 30;
    }
  }
}

