class CoinBar extends StatusBar {
    images_coins = [
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/0.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/20.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/40.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/60.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/80.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coins/blue/100.png'
    ];
    percentage = 0;

    constructor() {
        super(this.images_coins);
        this.setPercentage(0);
        this.x = 20;
        this.y = 90;
        this.width = 200;
        this.height = 60;
    }
}