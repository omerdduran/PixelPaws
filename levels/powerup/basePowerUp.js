class BasePowerUp extends EngineObject {
    constructor(pos, duration = 5) {
        const className = new.target.name; // Get the name of the subclass
        const spritePath = `../../sprites/${className.toLowerCase()}.png`; // Generate sprite path
        super(pos, vec2(0.7, 0.7), undefined, 0, new Color(1, 1, 1)); // Default color for placeholder

        this.gravityScale = 0;
        this.isStatic = true;
        this.duration = duration;
        this.pulseTime = 0;

        // Animation properties
        this.sprite = new Image();
        this.sprite.onload = () => console.log(`${className} sprite loaded`);
        this.sprite.onerror = () => console.error(`Failed to load ${className} sprite`);
        this.sprite.src = spritePath;

        this.frameIndex = 0; // Current animation frame
        this.animationSpeed = 0.15; // Speed of animation (frames per second)
        this.animationTimer = 0; // Timer for frame updates

        this.framesPerRow = 4; // Number of frames in a row in the spritesheet
        this.totalFrames = 16; // Total number of frames in the spritesheet
    }

    update() {
        super.update();

        // Pulse animation
        this.pulseTime += 0.1;
        this.size = vec2(0.7 + Math.sin(this.pulseTime) * 0.1);

        // Update animation frame
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        }

        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            this.applyEffect();
            this.destroy();
        }
    }

    applyEffect() {
        // Override in subclasses
    }

    render() {
        const context = overlayContext; // Assuming `overlayContext` is your canvas context
        if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
            // Calculate frame dimensions
            const frameWidth = this.sprite.width / this.framesPerRow;
            const frameHeight = this.sprite.height / Math.ceil(this.totalFrames / this.framesPerRow);

            // Determine which frame to draw
            const frameX = (this.frameIndex % this.framesPerRow) * frameWidth;
            const frameY = Math.floor(this.frameIndex / this.framesPerRow) * frameHeight;

            // Convert world position to screen position
            const screenPos = worldToScreen(this.pos);

            const scaleMultiplier = 1.5; // Adjust scale as needed
            const scaledWidth = this.size.x * cameraScale * scaleMultiplier;
            const scaledHeight = this.size.y * cameraScale * scaleMultiplier;

            context.save();
            context.imageSmoothingEnabled = false;

            // Draw the specific animation frame
            context.drawImage(
                this.sprite,
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
            drawRect(this.pos, this.size, this.color);
        }
    }
}
