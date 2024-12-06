class Parrot extends BasePlayer {
    constructor(pos) {
        super(pos, new Color(1, 0.2, 0.2), {
            maxHealth: 70,
            moveSpeed: 0.25,
            gravityScale: 0.7
        }, "parrot", vec2(1, 1));
        
        // Uçuş özellikleri
        this.flyEnergy = 100;
        this.maxFlyEnergy = 100;
        this.flyRechargeRate = 0.1;
        this.normalGravity = 0.7;
        this.flyingGravity = 0.1; // Uçarken daha hafif yerçekimi
        this.flyPower = 0.1; // Yukarı çıkış gücü
        
        // Sprite ayarları
        this.loadAdditionalSprite('fly');
        this.spriteYOffset = 2;
        this.spriteScale = vec2(0.5, 0.5);

        this.framesPerState = {
            ...this.framesPerState,
            'idle': 6,
            'run': 6,
            'attack': 6,
            'jump': 8,
            'hurt': 12,
            'die': 10,
            'fly': 8,
            'sleep': 8
        };
    }

    handleMovement() {
        super.handleMovement();
        
        // Uçuş kontrolü
        if (keyIsDown('KeyQ') && this.flyEnergy > 0) {
            if (!this.isFlying) {
                // Uçuşa başlarken
                this.isFlying = true;
                this.gravityScale = this.flyingGravity;
            }
            
            // Sürekli yukarı itme uygula
            this.velocity.y = this.flyPower;
            this.flyEnergy--;
        } else if (this.isFlying) {
            // Q tuşu bırakıldığında sadece yerçekimini ayarla
            // ama isFlying durumunu değiştirme
            this.gravityScale = this.normalGravity;
        }
    }

    update() {
        super.update();
        
        // Yerdeyken enerjiyi doldur ve uçuşu sonlandır
        if (this.groundObject) {
            this.flyEnergy = Math.min(this.flyEnergy + this.flyRechargeRate, this.maxFlyEnergy);
            this.gravityScale = this.normalGravity;
            this.isFlying = false; // Yere değdiğinde uçuşu sonlandır
        }
    }

    render() {
        // Önce hasar durumunu kontrol et
        if (Date.now() - this.lastDamageTime < 500) {
            this.currentState = 'hurt';
            this.idleTimer = 0;
        }
        // Değilse diğer durumları kontrol et
        else if (!this.isFlying) {
            if (this.isAttacking) {
                this.currentState = 'attack';
            } else if (!this.groundObject) {
                this.currentState = 'jump';
            } else if (Math.abs(this.velocity.x) > 0.01) {
                this.currentState = 'run';
            } else {
                this.currentState = 'idle';
            }
        }

        // Sprite'ı belirle
        const sprite = this.sprites[this.isFlying ? 'fly' : this.currentState];
        
        if (sprite && sprite.complete && sprite.naturalWidth !== 0) {
            // Her durum için frame sayısını al
            const frameCount = this.framesPerState[this.isFlying ? 'fly' : this.currentState] || 4;
            const frameWidth = sprite.width / frameCount;
            const frameHeight = sprite.height;
            
            // Dünya koordinatlarını ekran koordinatlarına çevir
            const screenPos = worldToScreen(this.pos);
            const scale = cameraScale * 2;
            
            overlayContext.save();
            overlayContext.imageSmoothingEnabled = false;
            
            // Sprite'ın merkez noktasını hesapla
            const centerX = Math.round(screenPos.x);
            const centerY = Math.round(screenPos.y);
            
            // Sprite'ın boyutlarını hesapla
            const drawWidth = Math.round(scale * this.spriteScale.x);
            const drawHeight = Math.round(scale * this.spriteScale.y);
            
            // Frame indeksini hesapla
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
        } else {
            drawRect(this.pos, vec2(1), this.color);
        }

        // Animasyon güncelleme
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            const maxFrames = this.framesPerState[this.isFlying ? 'fly' : this.currentState] || 4;
            this.frameIndex = (this.frameIndex + 1) % maxFrames;
        }
        
        // Enerji barını çiz
        const energyBarWidth = 1;
        const energyBarHeight = 0.1;
        const energyBarOffset = vec2(0, 0.9);
        const energyPercent = this.flyEnergy / this.maxFlyEnergy;
        drawRect(
            this.pos.add(energyBarOffset),
            vec2(energyBarWidth * energyPercent, energyBarHeight),
            new Color(0, 0, 1, 0.5)
        );
    }
} 