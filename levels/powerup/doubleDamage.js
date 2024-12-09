class DoubleDamage extends BasePowerUp {
    constructor(pos) {
        super(pos, 10); // 10 seconds duration
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