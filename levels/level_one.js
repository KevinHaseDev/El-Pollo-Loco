/**
 * Erzeugt beim Spielstart eine zufällige Liste von Gegnern (Chicken/SmallChicken) und fügt den Endboss hinzu.
 * @param {number} minCount - Minimale Anzahl an Gegnern.
 * @param {number} maxCount - Maximale Anzahl an Gegnern.
 * @returns {Array} Array mit Gegner-Instanzen.
 */
function generateEnemyList(minCount, maxCount) {
    let enemyList = [];
    let count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    for (let i = 0; i < count; i++) {
        // 40% Chance für Chicken, 60% für SmallChicken
        if (Math.random() < 0.4) {
            enemyList.push(new Chicken());
        } else {
            enemyList.push(new SmallChicken());
        }
    }
    // Endboss einmalig anhängen
    enemyList.push(new Endboss());
    return enemyList;
}

/**
 * Fügt während des Spiels zufällig ein neues Gegnerobjekt zur Liste hinzu.
 * @param {Array} enemyArray - Die bestehende Gegnerliste, in die hinzugefügt wird.
 */
function spawnRandomEnemy(enemyArray) {
    if (!enemyArray) {
        return;
    }
    // 60% Chicken, 40% SmallChicken
    if (Math.random() < 0.4) {
        enemyArray.push(new Chicken());
    } else {
        enemyArray.push(new SmallChicken());
    }
}

// Beispiel: beim Level-Setup verwenden
let enemies = generateEnemyList(8, 18); // zwischen 8 und 18 Gegner zufällig

const level_one = new Level(
    enemies,
    [
        new Cloud(),
        new Cloud()
    ],
    [
        new BackgroundObject('../assets/img/5_background/layers/air.png', -719),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', -719),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 719),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', 719),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 719*2),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 719*3),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', 719*3),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 719*4),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png', 719*4),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png', 719*4),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png', 719*4),
        new BackgroundObject('../assets/img/5_background/layers/air.png', 719*5),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/2.png', 719*5),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/2.png', 719*5),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/2.png', 719*5),
    ]
);



// Beispiel: während des Spiels alle 7 Sekunden ein neues zufälliges Huhn hinzufügen
let spawnIntervalId = setInterval(function() {
    spawnRandomEnemy(enemies);
    // Optional: Abbrechen, wenn eine Bedingung erfüllt ist, z.B. Endboss erreicht
}, 5000);

// ...existing code...