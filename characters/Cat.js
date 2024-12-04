class Cat extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.5, 0.5, 0.5), {
            maxHealth: 90,
            moveSpeed: 0.25,
            attackCooldownTime: 0.3
        });
    }

  useSpecialAbility() {
    const rightCheck = getTileCollisionData(this.pos.add(vec2(0.6, 0)));
    const leftCheck = getTileCollisionData(this.pos.add(vec2(-0.6, 0)));

    if (rightCheck || leftCheck) {
      this.velocity.y = this.jumpPower * 0.7;
      this.specialAbilityCooldown = 1;
      this.setAnimation("wallClimb");
        }, 'cat', vec2(1.2, 1.2));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('climb');
    }
  }

  update() {
    super.update();

    // Update wall touching state
    this.touchingWall = getTileCollisionData(
      this.pos.add(vec2(0.6 * this.facingDirection, 0))
    );

    // Update animation for wall climbing
    if (this.touchingWall && Math.abs(this.velocity.y) > 0) {
      this.setAnimation("wallClimb");
    }
  }
