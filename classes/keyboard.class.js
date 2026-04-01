/**
 * Stores current keyboard input state.
 */
class Keyboard {
    left = false;
    right = false;
    up = false;
    down = false;
    space = false;

    /**
     * Setzt alle Eingaben auf `false` zurueck.
     */
    reset() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.space = false;
    }
}