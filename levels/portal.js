class Portal extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1.5), undefined, 0, new Color(0.5, 0, 0.5));
        
        // Disable physics completely
        this.gravityScale = 0;
        this.friction = 0;
        this.mass = 0;
        this.elasticity = 0;
        this.isStatic = true;

        this.timer = 0;
        this.isPlayerInside = false;
        this.portalEffect = 0;
        this.isTransitioning = false;

        // Portal sprite properties
        this.sprite = new Image();
        this.sprite.onload = () => console.log('Portal sprite loaded');
        this.sprite.onerror = () => console.error('Failed to load portal sprite');
        this.sprite.src = '../sprites/portal/portal.png';
        
        // Animation properties
        this.frameIndex = 0;
        this.animationSpeed = 0.15;
        this.animationTimer = 0;
        this.framesPerRow = 14;         // Total number of frames in a row
        this.usableFrames = 5;          // Number of actual frames that are usable in a row
        this.rowToUse = 1;              // Index of the row that will be used to portal
    }

    update() {
        super.update();
        
        this.portalEffect += 0.1;

        // Update animation - only cycling through the usable frames
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % this.usableFrames; // Only cycle through usable frames
        }

        // Rest of the update logic remains the same
        if (currentPlayer) {
            const distance = this.pos.distance(currentPlayer.pos);
            if (distance < 1) {
                if (!this.isPlayerInside) {
                    this.isPlayerInside = true;
                    this.timer = 5;
                } else {
                    this.timer = Math.max(0, this.timer - 1/60);
                    
                    if (this.timer <= 0 && !this.isTransitioning) {
                        this.isTransitioning = true;
                        transition.start('fade', 0.5, () => {
                            loadNextLevel();
                        });
                    }
                }
            } else {
                this.isPlayerInside = false;
                if (!this.isTransitioning) {
                    this.timer = 5;
                }
            }
        }
    }

    render() {
        const context = overlayContext;
        if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
            // Calculate frame dimensions
            const frameWidth = this.sprite.width / this.framesPerRow;
            const frameHeight = this.sprite.height / 3; // Assuming 3 rows in the sprite sheet
            
            // Calculate source coordinates - always using the middle row
            const frameX = this.frameIndex * frameWidth;
            const frameY = this.rowToUse * frameHeight; // Always use middle row
        
            const screenPos = worldToScreen(this.pos);
            const scaleMultiplier = 2;
            const scaledWidth = this.size.x * cameraScale * scaleMultiplier;
            const scaledHeight = this.size.y * cameraScale * scaleMultiplier;
        
            context.save();
            context.imageSmoothingEnabled = false;
        
            context.drawImage(
                this.sprite,
                frameX, frameY,
                frameWidth, frameHeight,
                screenPos.x - scaledWidth / 2,
                screenPos.y - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
        
            context.restore();
        } else {
            // Fallback drawing
            const pulseSize = 1 + Math.sin(this.portalEffect) * 0.1;
            drawRect(this.pos, this.size.scale(pulseSize), this.color);
        }
        
        if (this.isPlayerInside) {
            const timerText = Math.ceil(this.timer).toString();
            drawText(timerText, this.pos.add(vec2(0, 2)), 0.5, new Color(1, 1, 1));
        }
    }
}