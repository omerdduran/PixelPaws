class HealthPack extends EngineObject {
    constructor(pos) {
        super(pos, vec2(0.7, 0.7), undefined, 0, new Color(0, 1, 0));
        
        this.gravityScale = 0;
        this.isStatic = true;
        this.healAmount = 25;
    }

    update() {
        super.update();
        
        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            currentPlayer.health = Math.min(currentPlayer.maxHealth, 
                                          currentPlayer.health + this.healAmount);
            this.destroy();
        }
    }
} 