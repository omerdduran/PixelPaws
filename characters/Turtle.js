class Turtle extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(0.2, 0.8, 0.2), {
            maxHealth: 200,
            moveSpeed: 0.12,
            attackDamage: 15,
            attackRange: 1.2
        }, 'turtle', vec2(1.8, 1.2));
    
        this.spriteYOffset = 1.3;
        this.spriteScale = vec2(1.3, 1.3);

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 8,
            'run': 8,
            'attack': 10,
            'jump': 14,
            'hurt': 12,
            'die': 10,
            'shield': 13,
            'sleep': 12
        };

        // Load additional character-specific sprite
        this.loadAdditionalSprite('shield');
        this.isShielding = false;
        this.reverseShieldAnimation = false;
        this.animationTimer = 0;
    }

    useSpecialAbility() {
        this.isShielding = true;
        this.moveSpeed = 0;
        this.currentState = 'shield';
        this.frameIndex = 0;
        this.animationTimer = 0;
        this.specialAbilityDuration = 3;
        this.specialAbilityCooldown = 8;
        this.reverseShieldAnimation = false;
    }

    takeDamage(amount) {
        if (this.isShielding) {
            amount *= 0.2;  // 80% damage reduction
        }
        super.takeDamage(amount);
    }

    update() {
        super.update();
        if (this.isShielding) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            
            // Shield animasyonunu burada yönet
            this.handleShieldAnimation();

            // Süre kontrolü
            if (!this.reverseShieldAnimation) {
                this.specialAbilityDuration -= 1/60;
                if (this.specialAbilityDuration <= 0) {
                    this.reverseShieldAnimation = true;
                }
            }
        }
    }

    handleShieldAnimation() {
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            
            if (!this.reverseShieldAnimation) {
                // İleri animasyon
                if (this.frameIndex < this.framesPerState.shield - 1) {
                    this.frameIndex++;
                }
            } else {
                // Geri animasyon
                if (this.frameIndex > 0) {
                    this.frameIndex--;
                } else {
                    // Geri animasyon bitti, normal duruma dön
                    this.isShielding = false;
                    this.moveSpeed = 0.12;
                    this.currentState = 'idle';
                    this.reverseShieldAnimation = false;
                }
            }
        }
    }

    render() {
        if (this.isShielding) {
            // Shield durumunda özel render
            const sprite = this.sprites['shield'];
            if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
                const frameCount = this.framesPerState.shield;
                const frameWidth = sprite.width / frameCount;
                const frameHeight = sprite.height;
                
                const screenPos = worldToScreen(this.pos);
                const scale = cameraScale * 2;
                
                overlayContext.save();
                overlayContext.imageSmoothingEnabled = false;
                
                const centerX = Math.round(screenPos.x);
                const centerY = Math.round(screenPos.y);
                
                const drawWidth = Math.round(scale * this.spriteScale.x);
                const drawHeight = Math.round(scale * this.spriteScale.y);
                
                const drawX = centerX - drawWidth / 2;
                const verticalOffset = this.size.y * 1.5 * cameraScale;
                const drawY = centerY - drawHeight / 2 + verticalOffset;
                
                const frameX = Math.floor(this.frameIndex) * frameWidth;
                
                overlayContext.translate(centerX, centerY);
                
                if (this.facingDirection < 0) {
                    overlayContext.scale(-1, 1);
                }
                
                overlayContext.drawImage(
                    sprite,
                    frameX, 0,
                    frameWidth, frameHeight,
                    -drawWidth/2, -drawHeight/this.spriteYOffset,
                    drawWidth, drawHeight
                );
                
                overlayContext.restore();
            }
        } else {
            // Normal render
            super.render();
        }
    }
} 