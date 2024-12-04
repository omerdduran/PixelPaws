class Turtle extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.2, 0.8, 0.2), {
            maxHealth: 200,
            moveSpeed: 0.12,
            attackDamage: 15,
            attackRange: 1.2
        }, 'turtle', vec2(1.8, 1.4));

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 8,
            'run': 8,
            'attack': 10,
            'jump': 14,
            'hurt': 12,
            'die': 10,
            'shield': 13
        };

        // Load additional character-specific sprite
        this.loadAdditionalSprite('shield');
        this.isShielding = false;
    }

    useSpecialAbility() {
        this.isShielding = true;
        this.moveSpeed *= 0.5;
        this.currentState = 'shield';
        this.frameIndex = 0;
        this.specialAbilityDuration = 3;
        this.specialAbilityCooldown = 8;
    }

    takeDamage(amount) {
        if (this.isShielding) {
            amount *= 0.2;  // 80% damage reduction
        }
        super.takeDamage(amount);
    }

    update() {
        super.update();
        if (this.isShielding) {
            this.specialAbilityDuration -= 1/60;
            if (this.specialAbilityDuration <= 0) {
                this.isShielding = false;
                this.moveSpeed *= 2;  // Restore normal speed
            }
        }
    }
} 