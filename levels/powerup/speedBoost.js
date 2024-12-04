class SpeedBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, 5); // Pass position and duration to BasePowerUp
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
