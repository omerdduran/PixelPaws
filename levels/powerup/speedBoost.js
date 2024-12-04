class SpeedBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, new Color(0, 0, 1), 5); // Blue color, 5 seconds duration
        this.speedMultiplier = 2;
    }

    applyEffect() {
        const originalSpeed = currentPlayer.moveSpeed;
        currentPlayer.moveSpeed *= this.speedMultiplier;
        
        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.moveSpeed = originalSpeed;
            }
        }, this.duration * 1000);
    }
} 