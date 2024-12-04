class Dog extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.7, 0.5, 0.3), {
            maxHealth: 120,
            moveSpeed: 0.22,
            attackRange: 1.8
        });
    }

    useSpecialAbility() {
        // Bark stun
        let enemiesStunned = false;
        engineObjects.forEach(obj => {
            if (obj instanceof Enemy && obj.pos.distance(this.pos) < 5) {
                obj.stunned = true;
                obj.stunnedTime = 2;
                enemiesStunned = true;
            }
        });

        if (enemiesStunned) {
            this.specialAbilityCooldown = 10;
        }
    }

    render() {
        super.render();
        
        // Optional: Show bark range when ability is ready
        if (this.specialAbilityCooldown <= 0) {
            drawCircle(this.pos, 5, new Color(0.7, 0.5, 0.3, 0.1));
        }
    }
} 