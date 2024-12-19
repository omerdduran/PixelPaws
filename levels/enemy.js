class Enemy extends EngineObject {
    constructor(pos, patrolDistance = 3, maxHealth = 100) {
        super(pos, vec2(1, 1), undefined, 0, new Color(1, 0, 0));
        
        this.startPos = pos.copy();
        this.patrolDistance = patrolDistance;
        this.moveSpeed = 0.05;
        this.direction = 1;
        
        // Disable gravity and make static
        this.gravityScale = 0;
        this.isStatic = true;

        // Stun properties
        this.stunned = false;
        this.stunnedTime = 0;
        this.originalColor = this.color;

        // Health properties
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        // Damage effect
        this.damageEffectTime = 0;
    }

    takeDamage(amount) {
        if (this.stunned) return;

        this.currentHealth -= amount;
        this.currentHealth = Math.max(0, this.currentHealth); // Clamp health to 0

        // Trigger damage effect
        this.damageEffectTime = 0.5; // 0.5 seconds of damage effect
        this.stunned = true;
        this.stunnedTime = 1; // Stunned for 1 second

        // Check for death
        if (this.currentHealth === 0) {
            this.destroy(); // Remove the enemy from the game
            console.log("Enemy destroyed!");
        }
    }

    update() {
        super.update();

        // Handle damage effect
        if (this.damageEffectTime > 0) {
            this.damageEffectTime -= 1 / 60;
            this.color = new Color(1, 0.5, 0.5); // Flash red when damaged
        } else if (!this.stunned) {
            this.color = this.originalColor;
        }

        // Handle stun state
        if (this.stunned) {
            this.stunnedTime -= 1 / 60;
            if (this.stunnedTime <= 0) {
                this.stunned = false;
            }
            return; // Don't move while stunned
        }
        
        // Patrol movement
        const nextPos = this.pos.add(vec2(this.moveSpeed * this.direction, -0.5));
        const tileAhead = getTileCollisionData(nextPos);
        if (!tileAhead || Math.abs(this.pos.x - this.startPos.x) > this.patrolDistance) {
            this.direction *= -1;
        }
        this.pos.x += this.moveSpeed * this.direction;

        // Keep enemy at original y position
        this.pos.y = this.startPos.y;
        this.velocity = vec2(0, 0);

        // Damage player on touch
        if (!this.stunned && currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            currentPlayer.takeDamage(10);
        }
    }

    render() {
        super.render();

        // Draw enemy facing direction
        const eyeOffset = vec2(0.2 * this.direction, 0.1);
        drawRect(this.pos.add(eyeOffset), vec2(0.2, 0.2), new Color(1, 1, 1));

        // Draw stun effect if stunned
        if (this.stunned) {
            drawRect(
                this.pos.add(vec2(0, 0.7)),
                vec2(0.3, 0.3),
                new Color(1, 1, 0, 0.5)
            );
        }

        // Draw health bar
        const healthBarWidth = 1.0; // Full width of the health bar
        const healthBarHeight = 0.1; // Height of the health bar
        const healthBarPos = this.pos.add(vec2(0, 1.2)); // Position above the enemy
        const healthFraction = this.currentHealth / this.maxHealth;

        // Background (gray)
        drawRect(
            healthBarPos,
            vec2(healthBarWidth, healthBarHeight),
            new Color(0.2, 0.2, 0.2)
        );

        // Current health (green)
        drawRect(
            healthBarPos.add(vec2(-0.5 * (1 - healthFraction) * healthBarWidth, 0)), // Adjust to fill based on health
            vec2(healthBarWidth * healthFraction, healthBarHeight),
            new Color(0.0, 1.0, 0.0)
        );
    }
}
