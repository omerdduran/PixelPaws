class Enemy extends EngineObject {
    constructor(pos, patrolDistance = 3) {
        super(pos, vec2(1, 1), undefined, 0, new Color(1, 0, 0));
        
        this.startPos = pos.copy();
        this.patrolDistance = patrolDistance;
        this.moveSpeed = 0.05;
        this.direction = 1;
        
        // Disable gravity and make static
        this.gravityScale = 0;
        this.isStatic = true;
    }

    update() {
        super.update();
        
        // Check for edge before moving
        const nextPos = this.pos.add(vec2(this.moveSpeed * this.direction, -0.5));
        const tileAhead = getTileCollisionData(nextPos);
        
        // Change direction if there's no ground ahead or hit patrol limit
        if (!tileAhead || Math.abs(this.pos.x - this.startPos.x) > this.patrolDistance) {
            this.direction *= -1;
        }
        
        // Patrol movement
        this.pos.x += this.moveSpeed * this.direction;

        // Keep enemy at original y position
        this.pos.y = this.startPos.y;
        this.velocity = vec2(0, 0);

        // Damage player on touch
        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            currentPlayer.takeDamage(10);
        }
    }

    render() {
        super.render();
        
        // Draw enemy facing direction
        const eyeOffset = vec2(0.2 * this.direction, 0.1);
        drawRect(this.pos.add(eyeOffset), vec2(0.2, 0.2), new Color(1, 1, 1));
    }
} 