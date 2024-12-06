class Cat extends BasePlayer {
  constructor(pos) {
      super(pos, new Color(0.5, 0.5, 0.5), {
          maxHealth: 90,
          moveSpeed: 0.25,
          attackCooldownTime: 0.3
      }, 'cat', vec2(2, 1.5));
      this.specialAbilityCooldown = 0; // Initialize cooldown
      this.jumpPower = 5; // Set a jump power value
      this.touchingWall = false; // Initialize wall touching state
      
      this.spriteYOffset = 1.8;
      this.spriteScale = vec2(1.2, 1.2);

      this.framesPerState = {
        ...this.framesPerState,
        'idle': 14,
        'run': 7,
        'attack': 9,
        'jump': 13,
        'hurt': 7,
        'die': 15
    };
  }

//   useSpecialAbility() {
//       const rightCheck = getTileCollisionData(this.pos.add(vec2(0.6, 0)));
//       const leftCheck = getTileCollisionData(this.pos.add(vec2(-0.6, 0)));

//       if (rightCheck || leftCheck) {
//           this.velocity.y = this.jumpPower * 0.7;
//           this.specialAbilityCooldown = 1; // Set cooldown for the special ability
//           this.setAnimation("wallClimb");
//           this.loadAdditionalSprite('climb'); // Load additional character-specific sprite
//       }
//   }

  update() {
      super.update();

      // Update wall touching state
      this.touchingWall = getTileCollisionData(
          this.pos.add(vec2(0.6 * this.facingDirection, 0))
      );

      // Update animation for wall climbing
    //   if (this.touchingWall && Math.abs(this.velocity.y) > 0) {
    //       this.setAnimation("wallClimb");
    //   }
  }
}
