class Turtle extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.2, 0.7, 0.2), {
            maxHealth: 200,      // Highest health
            moveSpeed: 0.12,     // Slowest
            attackDamage: 15
        });
        
        this.isShelled = false;
    }

    update() {
        // Call base update but skip movement handling
        EngineObject.prototype.update.call(this);
        
        if (this.isActive) {
            // Custom movement handling
            if (!this.isShelled) {
                // Normal movement only when not shelled
                if (keyIsDown('ArrowRight')) {
                    this.velocity.x = 0.12;
                    this.facingDirection = 1;
                }
                else if (keyIsDown('ArrowLeft')) {
                    this.velocity.x = -0.12;
                    this.facingDirection = -1;
                }
                else {
                    this.velocity.x = 0;
                }

                // Jump control
                if (keyWasPressed('KeyW') && this.groundObject) {
                    this.velocity.y = this.jumpPower;
                }
            } else {
                // Force stop when shelled
                this.velocity.x = 0;
            }

            // Handle attack and special ability
            this.handleAttack();
            
            if (keyWasPressed('KeyQ') && this.specialAbilityCooldown <= 0) {
                this.useSpecialAbility();
            }
        }

        // Update cooldowns and other mechanics
        this.handleFallDamage();
        if (this.attackCooldown > 0) {
            this.attackCooldown -= 1/60;
        }
        if (this.specialAbilityCooldown > 0) {
            this.specialAbilityCooldown -= 1/60;
        }
    }

    useSpecialAbility() {
        // Toggle shell mode
        this.isShelled = !this.isShelled;
        console.log('Shell mode:', this.isShelled ? 'ON' : 'OFF');
        
        this.specialAbilityCooldown = 0.2;
    }

    takeDamage(amount) {
        if (this.isShelled) {
            amount *= 0.2; // Only takes 20% damage while in shell
        }
        super.takeDamage(amount);
    }

    render() {
        super.render();
        if (this.isShelled) {
            drawRect(this.pos, this.size.scale(1.2), new Color(0.1, 0.5, 0.1, 0.5));
            // Add text indicator for shell mode
            drawText('SHELL', this.pos.add(vec2(0, 1.5)), 0.5, new Color(0.1, 0.5, 0.1));
        }
    }
} 