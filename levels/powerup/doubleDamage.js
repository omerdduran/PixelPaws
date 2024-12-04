class DoubleDamage extends BasePowerUp {
    constructor(pos) {
        super(pos, new Color(1, 0, 0), 10); // Red color, 10 seconds duration
    }

    applyEffect() {
        const originalDamage = currentPlayer.attackDamage;
        currentPlayer.attackDamage *= 2;
        
        setTimeout(() => {
            if (currentPlayer) {
                currentPlayer.attackDamage = originalDamage;
            }
        }, this.duration * 1000);
    }
} 