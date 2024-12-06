class Dog extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.7, 0.5, 0.3), {
            maxHealth: 120,
            moveSpeed: 0.22,
            attackRange: 1.8
        }, 'dog', vec2(2, 2));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('bark');
        this.spriteYOffset = 1.3;
        this.spriteScale = vec2(2.3, 2.3);

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 7,
            'run': 5,
            'attack': 16,
            'jump': 13,
            'hurt': 15,
            'die': 11,
            'bark': 12,
            'sleep': 8
        };
    }

    useSpecialAbility() {
        let enemiesStunned = false;
        engineObjects.forEach(obj => {
            if (obj instanceof Enemy && obj.pos.distance(this.pos) < 5) {
                obj.stunned = true;
                obj.stunnedTime = 2;
                enemiesStunned = true;
            }
        });

        if (enemiesStunned) {
            this.currentState = 'bark';
            this.frameIndex = 0;
            this.specialAbilityCooldown = 10;
        }
    }
} 