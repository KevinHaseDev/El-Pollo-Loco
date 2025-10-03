class BottleBar extends StatusBar {
    static images_bottles = [
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    constructor() {
        super(BottleBar.images_bottles);
        this.setPercentage(0);
        this.x = 460;
        this.y = 20;
        this.width = 200;
        this.height = 60;
    }
}