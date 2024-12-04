class Parrot extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(1, 0.2, 0.2), {
            maxHealth: 70,       // Lowest health
            moveSpeed: 0.25,
            gravityScale: 0.7    // Floaty
        }, "parrot", vec2(1.5, 1.5));
        this.flyEnergy = 100;

        // Load additional character-specific sprite
        this.loadAdditionalSprite('fly');
        this.isFlying = false;

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 6,
            'run': 6,
            'attack': 6,
            'jump': 8,
            'hurt': 12,
            'die': 10,
            'fly': 8
        };
    }

    useSpecialAbility() {
        this.isFlying = true;
        this.velocity.y = this.jumpPower * 0.5;
        this.currentState = 'fly';
        this.frameIndex = 0;
        this.specialAbilityCooldown = 2;
    }

    update() {
        super.update();
        if (this.groundObject) {
            this.isFlying = false;
        }
    }
} 