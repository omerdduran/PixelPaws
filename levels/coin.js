class Coin extends EngineObject {
    constructor(pos) {
        super(pos, vec2(0.5, 0.5), undefined, 0, new Color(1, 1, 0)); // Gold color
        
        this.gravityScale = 0;
        this.isStatic = true;
        this.rotationSpeed = 0.1;
    }

    update() {
        super.update();
        this.angle += this.rotationSpeed; // Rotate coin

        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            currentPlayer.addCoin();
            this.destroy();
        }
    }
} 