class MovingPlatform extends EngineObject {
    constructor(pos, distance = 4, vertical = false) {
        super(pos, vec2(3, 0.5), undefined, 0, new Color(.3, .3, .3));
        
        this.startPos = pos.copy();
        this.moveDistance = distance;
        this.moveSpeed = 0.02;
        this.direction = 1;
        this.vertical = vertical;
        
        // Disable physics
        this.gravityScale = 0;
        this.isStatic = true;
        
        // Enable collision for player to stand on
        this.setCollision(true);
        this.mass = 0;
        this.elasticity = 0;

        // Smooth movement
        this.progress = 0;
    }

    update() {
        super.update();
        
        const oldPos = this.pos.copy();
        
        // Smooth movement using sine wave
        this.progress += this.moveSpeed;
        if (this.progress > Math.PI * 2) {
            this.progress = 0;
        }

        if (this.vertical) {
            const offset = Math.sin(this.progress) * this.moveDistance;
            this.pos.y = this.startPos.y + offset;
        } else {
            const offset = Math.sin(this.progress) * this.moveDistance;
            this.pos.x = this.startPos.x + offset;
        }
        
        // Move player with platform if they're standing on it
        if (currentPlayer && currentPlayer.groundObject === this) {
            const delta = this.pos.subtract(oldPos);
            currentPlayer.pos = currentPlayer.pos.add(delta);
        }
        
        this.velocity = vec2(0, 0);
    }

    render() {
        super.render();
        
        const detail = new Color(.4, .4, .4);
        const detailSize = vec2(0.1, this.size.y);
        drawRect(this.pos.subtract(this.size.scale(0.3)), detailSize, detail);
        drawRect(this.pos.add(this.size.scale(0.3)), detailSize, detail);
    }
} 