class Cat extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.5, 0.5, 0.5), {
            maxHealth: 90,
            moveSpeed: 0.25,
            attackCooldownTime: 0.3 // Faster attacks
        });
    }

    useSpecialAbility() {
        // Wall Climb
        const rightCheck = getTileCollisionData(this.pos.add(vec2(0.6, 0)));
        const leftCheck = getTileCollisionData(this.pos.add(vec2(-0.6, 0)));

        if (rightCheck || leftCheck) {
            this.velocity.y = this.jumpPower * 0.7;
            this.specialAbilityCooldown = 1;
        }
    }

    update() {
        super.update();
        // Update touchingWall state
        this.touchingWall = getTileCollisionData(
            this.pos.add(vec2(0.6 * this.facingDirection, 0))
        );
    }

    render() {
        super.render();
        if (this.touchingWall) {
            drawRect(
                this.pos.add(vec2(0.6 * this.facingDirection, 0)),
                vec2(0.1, 0.1),
                new Color(1, 1, 1, 0.5)
            );
        }
    }
} 