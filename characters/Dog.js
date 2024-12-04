class Dog extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.7, 0.5, 0.3), {
            maxHealth: 120,
            moveSpeed: 0.22,
            attackRange: 1.8
        }, 'dog', vec2(1.5, 1.5));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('bark');
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