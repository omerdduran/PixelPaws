class Cat extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.5, 0.5, 0.5), {
            maxHealth: 90,
            moveSpeed: 0.25,
            attackCooldownTime: 0.3
        }, 'cat', vec2(1.2, 1.2));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('climb');
    }

    // ... rest of Cat-specific methods ...
} 