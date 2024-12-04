class MagneticField extends BasePowerUp {
    constructor(pos) {
        super(pos, new Color(0.7, 0, 1), 8); // Purple color, 8 seconds duration
        this.radius = 5;
    }

    applyEffect() {
        const magnetInterval = setInterval(() => {
            if (!currentPlayer) {
                clearInterval(magnetInterval);
                return;
            }

            engineObjects.forEach(obj => {
                if (obj instanceof Coin && obj.pos.distance(currentPlayer.pos) < this.radius) {
                    const dir = obj.pos.subtract(currentPlayer.pos).normalize();
                    obj.pos = obj.pos.subtract(dir.scale(0.2));
                }
            });
        }, 16);

        setTimeout(() => clearInterval(magnetInterval), this.duration * 1000);
    }
} 