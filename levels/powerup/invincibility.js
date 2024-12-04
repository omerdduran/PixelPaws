class Invincibility extends BasePowerUp {
    constructor(pos) {
        super(pos, new Color(1, 1, 0), 3); // Yellow color, 3 seconds duration
    }

    applyEffect() {
        const originalDamage = currentPlayer.takeDamage;
        currentPlayer.takeDamage = () => {}; // No damage
        
        // Visual effect
        currentPlayer.color = new Color(1, 1, 1);
        
        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.takeDamage = originalDamage;
                currentPlayer.color = currentPlayer.constructor.defaultColor;
            }
        }, this.duration * 1000);
    }
} 