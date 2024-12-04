class Bunny extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.8, 0.8, 0.8), {
            maxHealth: 80,       // Less health
            moveSpeed: 0.3,      // Faster
            jumpPower: 0.6,      // Higher jumps
            attackDamage: 15     // Less damage
        });
        this.doubleJumpAvailable = true;
    }

    handleMovement() {
        super.handleMovement();
        
        // Double jump with W key (separate from special ability)
        if (keyWasPressed('KeyW') && !this.groundObject && this.doubleJumpAvailable) {
            this.velocity.y = this.jumpPower;
            this.doubleJumpAvailable = false;
        }
    }

    update() {
        super.update();
        if (this.groundObject) {
            this.doubleJumpAvailable = true;
        }
    }
} 