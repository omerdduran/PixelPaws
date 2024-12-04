class Bear extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.6, 0.4, 0.2), {
            maxHealth: 150,
            moveSpeed: 0.15,
            attackDamage: 30,
            attackRange: 2,
            attackCooldownTime: 0.7
        }, 'bear', vec2(2, 2));

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 6,
            'run': 5,
            'attack': 7,
            'jump': 11,
            'hurt': 10,
            'die': 12
        };

        
        // this.loadAdditionalSprite('berserker');
        // this.berserkerMode = false;
    }

    useSpecialAbility() {
        if (!this.berserkerMode) {
            this.berserkerMode = true;
            this.attackDamage *= 2;
            this.specialAbilityDuration = 5;
            this.specialAbilityCooldown = 15;
            this.currentState = 'berserker';
            this.frameIndex = 0;
        }
    }
} 