class Invincibility extends BasePowerUp {
    constructor(pos) {
        super(pos, 3, false); // 3 seconds duration
    }

    applyEffect() {
        if (!currentPlayer) {
            console.error('No current player found to apply the Invincibility effect.');
            return;
        }        

        // Make the player invincible
        currentPlayer.canTakeDamage = false;

        // Apply visual effect
        currentPlayer.color = new Color(1, 1, 1);

        // Revert invincibility after the duration
        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.canTakeDamage = true;
                currentPlayer.color = currentPlayer.constructor.defaultColor;
            }
        }, this.duration * 1000);
    }
}
