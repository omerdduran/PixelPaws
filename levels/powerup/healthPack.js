class HealthPack extends BasePowerUp {
    constructor(pos) {
        super(pos, 0, false); // Süresiz (0), normal resim kullanan powerup
        this.healAmount = 25;
    }

    applyEffect() {
        if (currentPlayer) {
            currentPlayer.health = Math.min(
                currentPlayer.maxHealth, 
                currentPlayer.health + this.healAmount
            );
        }
    }
}
