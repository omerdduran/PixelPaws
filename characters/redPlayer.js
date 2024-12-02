class RedPlayer extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(1, 0, 0));
    }

    handleMovement() {
        if (keyIsDown('ArrowLeft')) {
            this.velocity.x = -this.moveSpeed;
            this.facingDirection = -1;
        }
        else if (keyIsDown('ArrowRight')) {
            this.velocity.x = this.moveSpeed;
            this.facingDirection = 1;
        }
        else {
            this.velocity.x = 0;
        }
            
        if (this.groundObject && keyIsDown('ArrowUp')) {
            this.velocity.y = this.jumpPower;
        }
    }
} 