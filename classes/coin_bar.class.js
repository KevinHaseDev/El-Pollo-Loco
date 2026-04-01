class CoinBar extends StatusBar {
    static images_coins = [
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /**
     * Creates the coin progress bar.
     */
    constructor() {
        super(CoinBar.images_coins);
        this.setPercentage(0);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
    }
}