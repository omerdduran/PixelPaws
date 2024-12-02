class BluePlayer extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0, 0, 1));
        this.jumpPower = 0.9;
        this.maxHealth = 50;
    }

    handleMovement() {
        if (keyIsDown('KeyA')) {
            this.velocity.x = -this.moveSpeed;
            this.facingDirection = -1;
        }
        else if (keyIsDown('KeyD')) {
            this.velocity.x = this.moveSpeed;
            this.facingDirection = 1;
        }
        else {
            this.velocity.x = 0;
        }
            
        if (this.groundObject && keyIsDown('KeyW')) {
            this.velocity.y = this.jumpPower;
        }
    }
} 