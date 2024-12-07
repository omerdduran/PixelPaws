class BasePlayer extends EngineObject {
    static totalCoins = 0;

    constructor(pos, color, stats = {}, characterType = '', size = vec2(1.5, 1.5)) {
        super(pos, size, undefined, 0, color);
        
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
        this.coins = BasePlayer.totalCoins;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackDuration = 0.2;
        this.facingDirection = 1;
        this.lastDamageTime = 0;
        this.damageCooldown = 2000;
        this.canTakeDamage = true;

        // Special ability properties
        this.specialAbilityCooldown = 0;
        this.specialAbilityDuration = 0;
        this.isUsingSpecialAbility = false;

        // Animation properties
        this.characterType = characterType.toLowerCase();
        this.sprites = {};
        this.loadedSprites = 0;
        this.currentState = 'idle';
        this.frameIndex = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.15;
        this.lastState = 'idle';
        this.framesPerState = {
            'idle': 0,
            'run': 0,
            'attack': 0,
            'jump': 0,
            'hurt': 0,
            'die': 0,
            'sleep': 0
        };

        // Sprite properties
        this.spriteScale = vec2(1, 1);  // Varsayılan sprite ölçeği
        this.spriteYOffset = 1.3;       // Varsayılan Y offset
        
        // Load sprites if character type is provided
        if (this.characterType) {
            this.loadSprites();
        }

        // Idle durumu için sayaç ekleyelim
        this.idleTimer = 0;
        this.idleTimeToSleep = 3; // 3 saniye hareketsiz kalınca sleep'e geçecek
    }

    loadSprites() {
        // Define base sprite states that all characters share
        const baseStates = ['idle', 'run', 'attack', 'jump', 'hurt', 'die', 'sleep'];
        
        // Load each sprite
        baseStates.forEach(state => {
            const img = new Image();
            img.onload = () => {
                this.loadedSprites++;
                console.log(`Loaded ${state} sprite for ${this.characterType}`);
            };
            img.onerror = () => {
                console.error(`Failed to load ${state} sprite for ${this.characterType} at path: sprites/${this.characterType}/${state}.png`);
            };
            img.src = `sprites/${this.characterType}/${state}.png`;
            this.sprites[state] = img;
        });
    }

    // Add a method to load additional character-specific sprites
    loadAdditionalSprite(stateName) {
        const img = new Image();
        img.onload = () => {
            console.log(`Loaded ${stateName} sprite for ${this.characterType}`);
        };
        img.onerror = () => {
            console.error(`Failed to load ${stateName} sprite for ${this.characterType}`);
        };
        img.src = `sprites/${this.characterType}/${stateName}.png`;
        this.sprites[stateName] = img;
    }

    render() {
        // Determine current state
        let newState = 'idle';
        
        // Önce hasar durumunu kontrol et - süreyi artıralım
        if (Date.now() - this.lastDamageTime < 500) { // 200ms'den 500ms'e çıkardık
            newState = 'hurt';
            this.idleTimer = 0;
        } 
        // Eğer hurt değilse diğer durumları kontrol et
        else {
            // Hareket var mı kontrol edelim
            const isMoving = Math.abs(this.velocity.x) > 0.01 || 
                            !this.groundObject || 
                            this.isAttacking ||
                            keyIsDown('ArrowRight') || 
                            keyIsDown('ArrowLeft') || 
                            keyIsDown('KeyW') || 
                            keyIsDown('Space');

            if (isMoving) {
                this.idleTimer = 0; // Hareket varsa sayacı sıfırla
                
                if (this.isAttacking) {
                    newState = 'attack';
                } else if (Math.abs(this.velocity.x) > 0.01) {
                    newState = 'run';
                } else if (!this.groundObject) {
                    newState = 'jump';
                }
            } else {
                // Hareket yoksa sayacı artır
                this.idleTimer += 1/60; // Her frame'de 1/60 saniye ekle
                
                if (this.idleTimer >= this.idleTimeToSleep) {
                    newState = 'sleep';
                }
            }
        }

        // State change handling with smooth transitions
        if (newState !== this.currentState) {
            // Sadece bazı durumlarda anında değiştir
            const instantTransitions = ['hurt', 'attack'];
            if (instantTransitions.includes(newState) || 
                instantTransitions.includes(this.currentState)) {
                this.frameIndex = 0;
                this.animationTimer = 0;
            }
            this.currentState = newState;
        }

        // Update animation with precise timing
        this.updateAnimation();

        // Draw the current sprite
        const sprite = this.sprites[this.currentState];
        if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
            // Her durum için frame sayısını al
            const frameCount = this.framesPerState[this.currentState] || 4;
            const frameWidth = sprite.width / frameCount;
            const frameHeight = sprite.height;
            
            // Dünya koordinatlarını ekran koordinatlarına çevir ve tam sayıya yuvarla
            const screenPos = worldToScreen(this.pos);
            const scale = cameraScale * 2;
            
            overlayContext.save();
            overlayContext.imageSmoothingEnabled = false;
            
            // Sprite'ın merkez noktasını hesapla
            const centerX = Math.round(screenPos.x);
            const centerY = Math.round(screenPos.y);
            
            // Sprite'ın boyutlarını hesapla (spriteScale ile güncellendi)
            const drawWidth = Math.round(scale * this.spriteScale.x);
            const drawHeight = Math.round(scale * this.spriteScale.y);
            
            // Sprite'ın çizim pozisyonunu hesapla
            const drawX = centerX - drawWidth / 2;
            const verticalOffset = this.size.y * 1.5 * cameraScale;
            const drawY = centerY - drawHeight / 2 + verticalOffset;
            
            // Frame indeksini tam sayıya yuvarla
            const frameX = Math.floor(this.frameIndex) * frameWidth;
            
            overlayContext.translate(centerX, centerY);
            
            if (this.facingDirection < 0) {
                overlayContext.scale(-1, 1);
            }
            
            try {
                overlayContext.drawImage(
                    sprite,
                    frameX, 0,                    // Source X, Y
                    frameWidth, frameHeight,      // Source Width, Height
                    -drawWidth/2, -drawHeight/this.spriteYOffset,  // Destination X, Y
                    drawWidth, drawHeight         // Destination Width, Height (spriteScale ile güncellendi)
                );
            } catch (error) {
                console.error('Error drawing sprite:', error);
            }
            
            overlayContext.restore();
        } else {
            drawRect(this.pos, vec2(1), this.color);
        }
    }

    addCoin() {
        BasePlayer.totalCoins++;
        this.coins = BasePlayer.totalCoins;
        console.log('Coins collected:', BasePlayer.totalCoins);
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
            this.specialAbilityCooldown = this.specialAbilityCooldownTime;
        }

        // Special ability cooldown güncellemesi
        if (this.specialAbilityCooldown > 0) {
            this.specialAbilityCooldown -= 1/60;
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
            this.takeDamage(20);
            levelManager.loadLevel(levelManager.currentLevelIndex);
        }
    }

    takeDamage(amount) {
        const currentTime = Date.now();

        // Prevent damage if the player is invincible
        if (!this.canTakeDamage) {
            console.log('Player is invincible, no damage taken.');
            return;
        }

        // Ensure damage cooldown is respected
        if (currentTime - this.lastDamageTime >= this.damageCooldown) {
            this.health = Math.max(0, this.health - amount);
            this.lastDamageTime = currentTime;

            // Hurt animation
            this.currentState = 'hurt';
            this.frameIndex = 0;
            this.animationTimer = 0;

            // Handle player death
            if (this.health <= 0) {
                this.health = this.maxHealth; // Reset health
                levelManager.loadLevel(levelManager.currentLevelIndex); // Restart level
            }
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

    // Update animation frame with precise timing
    updateAnimation() {
        // Hurt animasyonu için özel hız ayarı
        const currentSpeed = this.currentState === 'hurt' ? 
            this.animationSpeed * 1.5 : // Hurt animasyonunu biraz hızlandır
            this.animationSpeed;
        
        this.animationTimer += currentSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            const maxFrames = this.framesPerState[this.currentState] || 4;
            this.frameIndex = (this.frameIndex + 1) % maxFrames;
        }
    }
}