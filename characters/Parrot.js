class Parrot extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(1, 0.2, 0.2), {
            maxHealth: 70,       // Lowest health
            moveSpeed: 0.25,
            gravityScale: 0.7    // Floaty
        });
        this.flyEnergy = 100;
    }

    handleMovement() {
        super.handleMovement();
        
        // Hold Q to fly
        if (keyIsDown('KeyQ') && this.flyEnergy > 0) {
            this.velocity.y = Math.max(this.velocity.y, 0.2);
            this.flyEnergy--;
        }
    }

    update() {
        super.update();
        if (this.groundObject) {
            this.flyEnergy = Math.min(this.flyEnergy + 2, 100);
        }
    }

    render() {
        super.render();
        // Draw fly energy bar
        const energyBarWidth = 1;
        const energyBarHeight = 0.1;
        const energyBarOffset = vec2(0, 0.9);
        const energyPercent = this.flyEnergy / 100;
        drawRect(
            this.pos.add(energyBarOffset),
            vec2(energyBarWidth * energyPercent, energyBarHeight),
            new Color(0, 0, 1, 0.5)
        );
    }
} 