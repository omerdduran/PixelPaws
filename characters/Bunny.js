class Bunny extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.8, 0.8, 0.8), {
            maxHealth: 80,
            moveSpeed: 0.3,
            jumpPower: 0.6,
            attackDamage: 15
        }, 'bunny', vec2(1.3, 1.3));

        // Load additional character-specific sprite
        this.loadAdditionalSprite('doubleJump');
        this.doubleJumpAvailable = true;

        this.framesPerState = {
            'idle': 8,
            'run': 5,
            'attack': 7,
            'jump': 11,
            'hurt': 3,
            'die': 9
        };
    }

    handleMovement() {
        super.handleMovement();
        
        // Double jump with W key
        if (keyWasPressed('KeyW') && !this.groundObject && this.doubleJumpAvailable) {
            this.velocity.y = this.jumpPower;
            this.doubleJumpAvailable = false;
            this.currentState = 'doubleJump';
            this.frameIndex = 0;
        }
    }

    update() {
        super.update();
        if (this.groundObject) {
            this.doubleJumpAvailable = true;
        }
    }
} 