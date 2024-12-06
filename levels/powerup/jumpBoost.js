class JumpBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, 3, false); // 3 saniye süreli, normal resim kullanan powerup
    }s

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