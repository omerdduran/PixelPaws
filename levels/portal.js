class Portal extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1.5), undefined, 0, new Color(.5, 0, .5)); // Purple portal
        
        // Disable physics completely
        this.gravityScale = 0;
        this.friction = 0;
        this.mass = 0;
        this.elasticity = 0;
        this.isStatic = true;
        
        this.timer = 0;
        this.isPlayerInside = false;
        this.portalEffect = 0;
    }

    update() {
        super.update();
        
        this.portalEffect += 0.1;
        this.color = new Color(
            0.5 + Math.sin(this.portalEffect) * 0.2,
            0,
            0.5 + Math.cos(this.portalEffect) * 0.2
        );

        // Keep portal fixed at its position
        this.velocity = vec2(0, 0);
        
        if (currentPlayer) {
            const distance = this.pos.distance(currentPlayer.pos);
            if (distance < 1) {
                if (!this.isPlayerInside) {
                    this.isPlayerInside = true;
                    this.timer = 5;
                }
            } else {
                this.isPlayerInside = false;
                this.timer = 5;
            }
        }

        if (this.isPlayerInside) {
            this.timer -= 1/60;
            if (this.timer <= 0) {
                loadNextLevel();
            }
        }
    }

    render() {
        super.render();
        
        const pulseSize = 1 + Math.sin(this.portalEffect) * 0.1;
        drawRect(this.pos, this.size.scale(pulseSize), this.color);
        
        if (this.isPlayerInside) {
            const timerText = Math.ceil(this.timer).toString();
            drawText(timerText, this.pos.add(vec2(0, 2)), .5, new Color(1,1,1));
        }
    }
} 