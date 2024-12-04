class BasePowerUp extends EngineObject {
    constructor(pos, color, duration = 5) {
        super(pos, vec2(0.7, 0.7), undefined, 0, color);
        
        this.gravityScale = 0;
        this.isStatic = true;
        this.duration = duration;
        this.pulseTime = 0;
    }

    update() {
        super.update();
        
        // Pulse animation
        this.pulseTime += 0.1;
        this.size = vec2(0.7 + Math.sin(this.pulseTime) * 0.1);
        
        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            this.applyEffect();
            this.destroy();
        }
    }

    applyEffect() {
        // Override in subclasses
    }
} 