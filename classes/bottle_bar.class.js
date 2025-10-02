class BottleBar extends StatusBar {
    images_bottles = [
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/0.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/20.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/40.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/60.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/80.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottles/orange/100.png'
    ];
    percentage = 0;

    constructor() {
        super(this.images_bottles);
        this.setPercentage(0);
        this.x = 20;
        this.y = 160;
        this.width = 200;
        this.height = 60;
    }
}