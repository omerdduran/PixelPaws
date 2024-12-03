class BasePlayer extends EngineObject {
    constructor(pos, color) {
        super(pos, vec2(1, 1), undefined, 0, color);
        this.gravityScale = 1;
        this.jumpPower = 0.4;
        this.moveSpeed = 0.2;
        this.setCollision(true);
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.fallDamageThreshold = 0.4;
        this.wasGrounded = true;
        this.maxFallSpeed = 0;
        this.isActive = false;
        this.coins = 0;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackDuration = 0.2;
        this.attackCooldownTime = 0.5;
        this.attackDamage = 20;
        this.attackRange = 1.5;
        this.facingDirection = 1;
        this.lastDamageTime = 0; 
        this.damageCooldown = 2000
    }

    addCoin() {
        this.coins++;
        console.log('Coins collected:', this.coins);
    }

    render() {
        super.render();
        this.drawHealthBar();
        if (this.isActive) {
            const coinText = '🪙 ' + this.coins.toString();
            drawText(coinText, this.pos.add(vec2(0, 2)), 0.5, new Color(1, 1, 0));
        }
        if (this.isAttacking) {
            const attackPos = this.pos.add(vec2(this.facingDirection * this.attackRange / 2, 0));
            const attackSize = vec2(this.attackRange, 1);
            drawRect(attackPos, attackSize, new Color(1, 0, 0, 0.5));
        }
    }

    update() {
        super.update();
        if (this.isActive) {
            this.handleMovement();
            this.handleAttack();
        } else {
            this.velocity.x = 0;
        }
        this.handleFallDamage();
        if (this.attackCooldown > 0) {
            this.attackCooldown -= 1 / 60;
        }
    }

    handleMovement() {
    }

    handleFallDamage() {
        if (!this.groundObject) {
            this.wasGrounded = false;
            this.maxFallSpeed = Math.min(this.maxFallSpeed, this.velocity.y);
        } else if (!this.wasGrounded) {
            if (Math.abs(this.maxFallSpeed) > this.fallDamageThreshold) {
                const damage = Math.floor(Math.abs(this.maxFallSpeed) * 100);
                console.log('Fall damage:', damage, 'Fall speed:', this.maxFallSpeed);
                this.takeDamage(damage);
            }
            this.wasGrounded = true;
            this.maxFallSpeed = 0;
        }
        if (this.pos.y < -5) {
            this.takeDamage(50);
            loadLevel(currentLevel);
        }
    }

    takeDamage(amount) {
        const currentTime = Date.now();  // Get current time in milliseconds

        // Check if the cooldown has passed
        if (currentTime - this.lastDamageTime >= this.damageCooldown) {
            // Apply damage
            this.health = Math.max(0, this.health - amount);

            // If health is 0 or below, reload the level (or handle death logic)
            if (this.health <= 0) {
                this.health = this.maxHealth;  // Reset health to max
                loadLevel(currentLevel);  // Reload the level (or death handling)
            }

            // Update the last damage time
            this.lastDamageTime = currentTime;
        }
    }

    drawHealthBar() {
        const healthBarWidth = 1;
        const healthBarHeight = 0.1;
        const healthBarOffset = vec2(0, 0.7);
        drawRect(
            this.pos.add(healthBarOffset),
            vec2(healthBarWidth, healthBarHeight),
            new Color(1, 0, 0)
        );
        const healthPercent = this.health / this.maxHealth;
        drawRect(
            this.pos.add(healthBarOffset).add(vec2((healthPercent - 1) * healthBarWidth / 2, 0)),
            vec2(healthBarWidth * healthPercent, healthBarHeight),
            new Color(0, 1, 0)
        );
    }

    handleAttack() {
        if (keyWasPressed('Space') && this.attackCooldown <= 0) {
            this.startAttack();
        }
        if (this.isAttacking) {
            const attackPos = this.pos.add(vec2(this.facingDirection * this.attackRange / 2, 0));
            engineObjects.forEach(obj => {
                if (obj instanceof Enemy && obj.pos.distance(attackPos) < this.attackRange) {
                    obj.destroy();
                }
            });
            this.attackDuration -= 1 / 60;
            if (this.attackDuration <= 0) {
                this.endAttack();
            }
        }
    }

    startAttack() {
        this.isAttacking = true;
        this.attackDuration = 0.2;
        this.attackCooldown = this.attackCooldownTime;
    }

    endAttack() {
        this.isAttacking = false;
    }
}