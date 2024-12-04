class Parrot extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(1, 0.5, 0), {
            maxHealth: 70,
            moveSpeed: 0.35,
            jumpPower: 0.5,
            attackDamage: 10,
            gravityScale: 0.7
        }, 'parrot', vec2(1.1, 1.1));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('fly');
        this.isFlying = false;
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