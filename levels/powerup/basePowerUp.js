class BasePowerUp extends EngineObject {
    constructor(pos, duration = 5, useSprite = false) {
        const className = new.target.name;
        const basePath = useSprite ? '../../sprites' : '../../assets/powerups';
        const filePath = `${basePath}/${className.toLowerCase()}.png`;
        super(pos, vec2(0.7, 0.7), undefined, 0, new Color(1, 1, 1));

        this.gravityScale = 0;
        this.isStatic = true;
        this.duration = duration;
        this.pulseTime = 0;
        this.useSprite = useSprite;

        // Image/Sprite loading
        this.image = new Image();
        this.image.onload = () => console.log(`${className} ${useSprite ? 'sprite' : 'image'} loaded`);
        this.image.onerror = () => console.error(`Failed to load ${className} ${useSprite ? 'sprite' : 'image'}`);
        this.image.src = filePath;

        if (useSprite) {
            this.frameIndex = 0;
            this.animationSpeed = 0.15;
            this.animationTimer = 0;
            this.framesPerRow = 4;
            this.totalFrames = 16;
        }
    }

    update() {
        super.update();

        // Pulse animation
        this.pulseTime += 0.1;
        this.size = vec2(0.7 + Math.sin(this.pulseTime) * 0.1);

        // Update sprite animation if using sprites
        if (this.useSprite) {
            this.animationTimer += this.animationSpeed;
            if (this.animationTimer >= 1) {
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            }
        }

        if (currentPlayer && this.pos.distance(currentPlayer.pos) < 1) {
            this.applyEffect();
            this.destroy();
        }
    }

    render() {
        const context = overlayContext;
        if (this.image.complete && this.image.naturalWidth !== 0) {
            const screenPos = worldToScreen(this.pos);
            const scaleMultiplier = 1.5;
            const scaledWidth = this.size.x * cameraScale * scaleMultiplier;
            const scaledHeight = this.size.y * cameraScale * scaleMultiplier;

            context.save();
            context.imageSmoothingEnabled = false;

            if (this.useSprite) {
                // Draw sprite animation frame
                const frameWidth = this.image.width / this.framesPerRow;
                const frameHeight = this.image.height / Math.ceil(this.totalFrames / this.framesPerRow);
                const frameX = (this.frameIndex % this.framesPerRow) * frameWidth;
                const frameY = Math.floor(this.frameIndex / this.framesPerRow) * frameHeight;

                context.drawImage(
                    this.image,
                    frameX, frameY,
                    frameWidth, frameHeight,
                    screenPos.x - scaledWidth / 2,
                    screenPos.y - scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
            } else {
                // Draw static image
                context.drawImage(
                    this.image,
                    screenPos.x - scaledWidth / 2,
                    screenPos.y - scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
            }

            context.restore();
        } else {
            // Fallback: Draw a rectangle if the image is not loaded
            drawRect(this.pos, this.size, this.color);
        }
    }
}
