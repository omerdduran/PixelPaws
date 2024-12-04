class Bear extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.6, 0.4, 0.2), {
            maxHealth: 150,      // More health
            moveSpeed: 0.15,     // Slower
            attackDamage: 30,    // Higher damage
            attackRange: 2,      // Longer attack range
            attackCooldownTime: 0.7 // Slower attacks
        });
        this.berserkerMode = false;
    }

    useSpecialAbility() {
        // Berserker Mode
        if (!this.berserkerMode) {
            this.berserkerMode = true;
            this.attackDamage *= 2;
            this.specialAbilityDuration = 5;
            this.specialAbilityCooldown = 15;
        }
    }

    update() {
        super.update();
        if (this.berserkerMode && this.specialAbilityDuration > 0) {
            this.specialAbilityDuration -= 1/60;
            if (this.specialAbilityDuration <= 0) {
                this.berserkerMode = false;
                this.attackDamage /= 2;
            }
        }
    }
} 