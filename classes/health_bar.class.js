class HealthBar extends StatusBar {
    static images_health = [
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
    percentage = 100;

    /**
     * Creates the player health bar.
     */
    constructor() {
        super(HealthBar.images_health);
        this.setPercentage(100);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }
}