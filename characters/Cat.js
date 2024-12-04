class Cat extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.5, 0.5, 0.5), {
            maxHealth: 90,
            moveSpeed: 0.25,
            attackCooldownTime: 0.3
        });

        // Set correct sprite size relative to world units
        this.spriteSize = vec2(2, 2); // Make sprite larger than collision box
        
        // Initialize the sprite sheet with absolute path
        this.spriteSheet = new Image();
        this.spriteSheet.src = "/assets/characters/redPlayer.png"; // Use absolute path
        
        this.loadSpriteSheet(this.spriteSheet.src, 32, 32, {
            'idle': { startFrame: 0, endFrame: 4 },
            'walk': { startFrame: 0, endFrame: 6 },
            'jump': { startFrame: 2, endFrame: 2 },
            'attack': { startFrame: 3, endFrame: 4 },
            'wallClimb': { startFrame: 1, endFrame: 2 }
        });
        
        this.frameDuration = 1/12;
    }

  useSpecialAbility() {
    const rightCheck = getTileCollisionData(this.pos.add(vec2(0.6, 0)));
    const leftCheck = getTileCollisionData(this.pos.add(vec2(-0.6, 0)));

    if (rightCheck || leftCheck) {
      this.velocity.y = this.jumpPower * 0.7;
      this.specialAbilityCooldown = 1;
      this.setAnimation("wallClimb");
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
}
