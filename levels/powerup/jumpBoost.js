class JumpBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, new Color(1, 0.5, 0), 7); // Orange color, 7 seconds duration
        this.jumpMultiplier = 1.5;
    }

    applyEffect() {
        const originalJump = currentPlayer.jumpPower;
        currentPlayer.jumpPower *= this.jumpMultiplier;
        
        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.jumpPower = originalJump;
            }
        }, this.duration * 1000);
    }
} 