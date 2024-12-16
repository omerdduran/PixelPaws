class JumpBoost extends BasePowerUp {
    constructor(pos) {
        super(pos, 3, false); // 3-second duration
        this.jumpMultiplier = 1.2; // Set a reasonable multiplier
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
        const originalFallDamage = currentPlayer.canTakeFallDamage;

        // Boost jump power and disable fall damage
        currentPlayer.jumpPower *= this.jumpMultiplier;
        currentPlayer.canTakeDamage = false;

        console.log(`JumpBoost applied: new jumpPower = ${currentPlayer.jumpPower}, fall damage disabled.`);

        setTimeout(() => {
            if (currentPlayer) {
                // Restore original jump power and re-enable fall damage
                currentPlayer.jumpPower = originalJump;
                currentPlayer.canTakeDamage = true;
                console.log(`JumpBoost expired: restored jumpPower = ${currentPlayer.jumpPower}, fall damage re-enabled.`);
            }
        }, this.duration * 1000);
    }
}
