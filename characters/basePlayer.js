class BasePlayer extends EngineObject {
    constructor(pos, color, stats = {}) {
        super(pos, vec2(1, 1), undefined, 0, color);

        // Sprite properties
        this.spriteSheet = null;
        this.spriteSize = vec2(32, 32);
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.currentAnimation = 'idle';
        this.frameIndex = 0;
        this.frameTime = 0;
        this.frameDuration = 1/8;
        this.animations = {};

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

    loadSpriteSheet(imagePath, frameWidth, frameHeight, animationData) {
        this.spriteSheet = new Image();
        this.spriteSheet.src = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.animations = animationData;
    }

    setAnimation(animationName) {
        if (this.currentAnimation !== animationName && this.animations[animationName]) {
            this.currentAnimation = animationName;
            this.frameIndex = this.animations[animationName].startFrame;
            this.frameTime = 0;
        }
    }

    updateAnimation() {
        if (!this.animations[this.currentAnimation]) return;
        
        this.frameTime += 1/60;
        if (this.frameTime >= this.frameDuration) {
            this.frameTime = 0;
            this.frameIndex++;
            
            const anim = this.animations[this.currentAnimation];
            if (this.frameIndex > anim.endFrame) {
                this.frameIndex = anim.startFrame;
            }
        }
    }

    render() {
    if (this.spriteSheet) {
        let renderPos = this.pos;                    
        
        drawImage(
            this.spriteSheet,
            renderPos,
            this.spriteSize,
            0,
            vec2(0.5, 0.5), // Center the sprite
            this.facingDirection < 0,
            1,
            this.frameIndex,
            vec2(this.frameWidth / this.spriteSheet.width, this.frameHeight / this.spriteSheet.height),
            vec2(
                this.frameIndex * this.frameWidth / this.spriteSheet.width,
                0
            )
        );
    } else {
        super.render();
    }
}

    update() {
        super.update();
        this.updateAnimation();
        
        if (this.isActive) {
            this.handleMovement();
            this.handleAttack();
            
            // Update animation states
            if (this.isAttacking) {
                this.setAnimation('attack');
            } else if (!this.groundObject) {
                this.setAnimation('jump');
            } else if (Math.abs(this.velocity.x) > 0) {
                this.setAnimation('walk');
            } else {
                this.setAnimation('idle');
            }
        } else {
            this.velocity.x = 0;
        }

        this.handleFallDamage();
        if (this.attackCooldown > 0) {
            this.attackCooldown -= 1/60;
        }
    }

    addCoin() {
        this.coins++;
        console.log('Coins collected:', this.coins);
    }

    handleMovement() {
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

        if (keyWasPressed('KeyW') && this.groundObject) {
            this.velocity.y = this.jumpPower;
        }

        if (keyWasPressed('Space') && this.attackCooldown <= 0) {
            this.startAttack();
        }

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
        if (this.isAttacking) {
            const attackPos = this.pos.add(vec2(this.facingDirection * this.attackRange / 2, 0));
            engineObjects.forEach(obj => {
                if (obj instanceof Enemy && obj.pos.distance(attackPos) < this.attackRange) {
                    obj.destroy();
                }
            });
            this.attackDuration -= 1/60;
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
        // To be implemented by child classes
    }
}