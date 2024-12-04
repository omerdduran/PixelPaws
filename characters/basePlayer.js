class BasePlayer extends EngineObject {
    constructor(pos, color, stats = {}) {
        super(pos, vec2(1, 1), undefined, 0, color);
        
        // Base stats that can be overridden
        this.gravityScale = stats.gravityScale ?? 1;
        this.jumpPower = stats.jumpPower ?? 0.4;
        this.moveSpeed = stats.moveSpeed ?? 0.2;
        this.maxHealth = stats.maxHealth ?? 100;
        this.attackDamage = stats.attackDamage ?? 20;
        this.attackRange = stats.attackRange ?? 1.5;
        this.attackCooldownTime = stats.attackCooldownTime ?? 0.5;
        
        // Initialize other properties
        this.setCollision(true);
        this.health = this.maxHealth;
        this.fallDamageThreshold = 0.4;
        this.wasGrounded = true;
        this.maxFallSpeed = 0;
        this.isActive = false;
        this.coins = 0;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackDuration = 0.2;
        this.facingDirection = 1;
        this.lastDamageTime = 0;
        this.damageCooldown = 2000;

        // Special ability properties
        this.specialAbilityCooldown = 0;
        this.specialAbilityDuration = 0;
        this.isUsingSpecialAbility = false;
    }

    addCoin() {
        this.coins++;
        console.log('Coins collected:', this.coins);
    }

    render() {
        super.render();
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
        // Basic movement controls for all characters
        if (keyIsDown('ArrowRight')) {
            this.velocity.x = this.moveSpeed;
            this.facingDirection = 1;
        }
        else if (keyIsDown('ArrowLeft')) {
            this.velocity.x = -this.moveSpeed;
            this.facingDirection = -1;
        }
        else {
            this.velocity.x = 0;
        }

        // Jump control
        if (keyWasPressed('KeyW') && this.groundObject) {
            this.velocity.y = this.jumpPower;
        }

        // Attack control
        if (keyWasPressed('Space') && this.attackCooldown <= 0) {
            this.startAttack();
        }

        // Special ability control
        if (keyWasPressed('KeyQ') && this.specialAbilityCooldown <= 0) {
            this.useSpecialAbility();
        }
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
            levelManager.loadLevel(levelManager.currentLevelIndex);
        }
    }

    takeDamage(amount) {
        const currentTime = Date.now();

        if (currentTime - this.lastDamageTime >= this.damageCooldown) {
            this.health = Math.max(0, this.health - amount);

            if (this.health <= 0) {
                this.health = this.maxHealth;
                levelManager.loadLevel(levelManager.currentLevelIndex);
            }

            this.lastDamageTime = currentTime;
        }
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

    useSpecialAbility() {
    }
}