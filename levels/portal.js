class Portal extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1.5), undefined, 0, new Color(0.5, 0, 0.5)); // Default color
        
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
        this.sprite.src = '../sprites/portal/portal.png'; // Update with the correct path
        
        this.frameIndex = 0; // For animations
        this.animationSpeed = 0.15; // Speed of animation (frames per second)
        this.animationTimer = 0; // Timer for animation
        this.framesPerRow = 8; // Number of frames in a row in the sprite sheet
        this.totalFrames = 24; // Total number of frames in the sprite sheet
    }

    update() {
        super.update();
        
        // Update portal effect
        this.portalEffect += 0.1;

        // Update animation
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        }

        // Check for player interaction
        if (currentPlayer) {
            const distance = this.pos.distance(currentPlayer.pos);
            if (distance < 1) {
                if (!this.isPlayerInside) {
                    this.isPlayerInside = true;
                    this.timer = 5;
                } else {
                    // Timer'ı güncelle ama 0'ın altına düşmesini engelle
                    this.timer = Math.max(0, this.timer - 1/60);
                    
                    // Timer 0'a ulaştığında geçiş efektini başlat
                    if (this.timer <= 0 && !this.isTransitioning) {
                        this.isTransitioning = true;
                        // Önce fade-out efekti başlat, sonra yeni levele geç
                        transition.start('fade', 0.5, () => {
                            loadNextLevel();
                        });
                    }
                }
            } else {
                this.isPlayerInside = false;
                // Sadece aktif bir geçiş yoksa timer'ı resetle
                if (!this.isTransitioning) {
                    this.timer = 5;
                }
            }
        }
    }

    render() {
        const context = overlayContext; // Assuming `overlayContext` is your canvas context
        if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
            // Calculate frame dimensions
            const frameWidth = this.sprite.width / this.framesPerRow;
            const frameHeight = this.sprite.height / (this.totalFrames / this.framesPerRow);
            
            // Adjust frameIndex to only use frames from the first row
            const idleRow = 0; // First row (idle state)
            const frameX = (this.frameIndex % this.framesPerRow) * frameWidth;
            const frameY = idleRow * frameHeight;
        
            // Convert world position to screen position
            const screenPos = worldToScreen(this.pos);
        
            // Add a scaling factor to increase the size of the portal
            const scaleMultiplier = 2; // Increase this value to make the portal bigger
            const scaledWidth = this.size.x * cameraScale * scaleMultiplier;
            const scaledHeight = this.size.y * cameraScale * scaleMultiplier;
        
            context.save();
            context.imageSmoothingEnabled = false;
        
            // Draw the sprite
            context.drawImage(
                this.sprite,                 // The sprite image
                frameX, frameY,              // Source X, Y
                frameWidth, frameHeight,     // Source width and height
                screenPos.x - scaledWidth / 2,  // Destination X (centered)
                screenPos.y - scaledHeight / 2, // Destination Y (centered)
                scaledWidth,                 // Destination width
                scaledHeight                 // Destination height
            );
        
            context.restore();
        } else {
            // Fallback: Draw a rectangle if the sprite is not loaded
            const pulseSize = 1 + Math.sin(this.portalEffect) * 0.1;
            drawRect(this.pos, this.size.scale(pulseSize), this.color);
        }
        
        // Draw timer text if the player is inside
        if (this.isPlayerInside) {
            const timerText = Math.ceil(this.timer).toString();
            drawText(timerText, this.pos.add(vec2(0, 2)), 0.5, new Color(1, 1, 1));
        }
    }
    
    
    
}
