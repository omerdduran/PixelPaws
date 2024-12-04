class Coin extends EngineObject {
    constructor(pos) {
        super(pos, vec2(0.5, 0.5), undefined, 0, new Color(1, 1, 0)); // Default color
        
        this.gravityScale = 0;
        this.isStatic = true;
        this.rotationSpeed = 0.1;

        // Sprite properties
        this.sprite = new Image();
        this.sprite.onload = () => console.log('Coin sprite loaded');
        this.sprite.onerror = () => console.error('Failed to load coin sprite');
        this.sprite.src = '../../sprites/coin.png'; // Update with the correct path
        
        this.frameIndex = 0; // For animations
        this.animationSpeed = 0.15; // Speed of animation (frames per second)
        this.animationTimer = 0; // Timer for animation
        this.framesPerRow = 5; // Number of frames in a row in the sprite sheet
        this.totalFrames = 5; // Total number of frames in the sprite sheet (update as needed)
    }

    update() {
        super.update();

        // Update rotation
        this.angle += this.rotationSpeed;

        // Update animation
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        }

        // Check for collision with player
        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            currentPlayer.addCoin();
            this.destroy();
        }
    }

    render() {
        const context = overlayContext; // Assuming `overlayContext` is your canvas context
        if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
            // Calculate frame dimensions
            const frameWidth = this.sprite.width / this.framesPerRow;
            const frameHeight = this.sprite.height / Math.ceil(this.totalFrames / this.framesPerRow);

            // Calculate current frame's position in the sprite sheet
            const frameX = (this.frameIndex % this.framesPerRow) * frameWidth;
            const frameY = Math.floor(this.frameIndex / this.framesPerRow) * frameHeight;

            // Convert world position to screen position
            const screenPos = worldToScreen(this.pos);

            // Scale the coin size for better visibility
            const scaleMultiplier = 2;
            const scaledWidth = this.size.x * cameraScale * scaleMultiplier;
            const scaledHeight = this.size.y * cameraScale * scaleMultiplier;

            context.save();
            context.imageSmoothingEnabled = false;

            // Draw the animated sprite
            context.drawImage(
                this.sprite,
                frameX, frameY,                  // Source X, Y
                frameWidth, frameHeight,         // Source width and height
                screenPos.x - scaledWidth / 2,   // Destination X (centered)
                screenPos.y - scaledHeight / 2,  // Destination Y (centered)
                scaledWidth, scaledHeight        // Destination width and height
            );

            context.restore();
        } else {
            // Fallback: Draw a rectangle if the sprite is not loaded
            drawRect(this.pos, this.size, this.color);
        }
    }
}
