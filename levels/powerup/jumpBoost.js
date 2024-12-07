class JumpBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, 3, false); // 3-second duration
        this.jumpMultiplier = 1.5; // Set a reasonable multiplier
    }

    applyEffect() {
        if (!currentPlayer) {
            console.error('No current player found to apply the JumpBoost effect.');
            return;
        }

        // Validate jumpMultiplier
        if (typeof this.jumpMultiplier !== 'number' || this.jumpMultiplier <= 0) {
            console.error(`Invalid jumpMultiplier value: ${this.jumpMultiplier}`);
            return;
        }

        const originalJump = currentPlayer.jumpPower;
        currentPlayer.jumpPower *= this.jumpMultiplier;

        console.log(`JumpBoost applied: new jumpPower = ${currentPlayer.jumpPower}`);

        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.jumpPower = originalJump;
                console.log(`JumpBoost expired: restored jumpPower = ${currentPlayer.jumpPower}`);
            }
        }, this.duration * 1000);
    }
}
