class LevelManager {
    constructor() {
        this.currentLevelIndex = 0;
        this.groundWidth = 500;
        this.groundSegments = [];
        this.debugMode = false;
        this.debugTextSize = 20;
    }

    loadLevel(levelIndex) {
        const level = levels[levelIndex];
        if (!level) return;

        this.currentLevelIndex = levelIndex;
        engineObjects.length = 0;
        this.groundSegments = [];

        level.platforms.forEach((platform, index) => {
            if (index > 0) {
                new EnginePlatform(platform.pos, platform.size, platform.color);
            }
        });

        this.createInitialGround(level);
    }

    createInitialGround(level) {
        const groundY = level.data.groundY ?? 0;
        const groundHeight = level.data.groundHeight ?? 1;
        const groundColor = level.data.groundColor ?? new Color(0.4, 0.3, 0.9);

        for (let i = -5; i <= 5; i++) {
            this.createGroundSegment(i * this.groundWidth, groundY, groundHeight, groundColor);
        }
    }

    createGroundSegment(x, y, height, color) {
        const segment = new EngineObject(
            vec2(x + this.groundWidth/2, y + height/2),
            vec2(this.groundWidth + 1, height)
        );

        segment.color = color;
        segment.isStatic = true;
        segment.mass = 0;
        segment.gravityScale = 0;

        segment.setCollision(1);
        segment.friction = 0.8;
        segment.elasticity = 0;
        segment.angle = 0;
        segment.angleVelocity = 0;
        segment.damping = 0;

        segment.isGround = true;
        segment.groundX = x;
        
        segment.debugInfo = {
            id: Math.floor(Math.random() * 1000),
            createTime: Date.now()
        };

        this.groundSegments.push(segment);
        return segment;
    }

    update() {
        if (!camera || !levels[this.currentLevelIndex]) return;

        const level = levels[this.currentLevelIndex];
        const groundY = level.data.groundY ?? 0;
        const groundHeight = level.data.groundHeight ?? 1;
        const groundColor = level.data.groundColor ?? new Color(0.4, 0.3, 0.9);

        const cameraX = camera.pos.x;
        const minX = cameraX - this.groundWidth * 3;
        const maxX = cameraX + this.groundWidth * 3;

        for (let x = Math.floor(minX / this.groundWidth) * this.groundWidth; 
             x <= Math.ceil(maxX / this.groundWidth) * this.groundWidth; 
             x += this.groundWidth) {
            
            const exists = this.groundSegments.some(s => Math.abs(s.groundX - x) < 1);
            if (!exists) {
                this.createGroundSegment(x, groundY, groundHeight, groundColor);
            }
        }

        this.groundSegments = this.groundSegments.filter(segment => {
            const distance = Math.abs(segment.pos.x - cameraX);
            if (distance > this.groundWidth * 4) {
                segment.destroy();
                return false;
            }
            return true;
        });

        if (this.debugMode) {
            this.debugRender();
        }
    }

    debugRender() {
        overlayContext.save();
        overlayContext.fillStyle = 'rgba(0,0,0,0.5)';
        overlayContext.fillRect(10, 10, 300, 150);
        
        overlayContext.fillStyle = 'white';
        overlayContext.font = `${this.debugTextSize}px Arial`;
        let y = 40;
        
        overlayContext.fillText(`Ground Segments: ${this.groundSegments.length}`, 20, y);
        y += this.debugTextSize + 5;
        
        if (currentPlayer) {
            overlayContext.fillText(`Player Position: (${currentPlayer.pos.x.toFixed(1)}, ${currentPlayer.pos.y.toFixed(1)})`, 20, y);
            y += this.debugTextSize + 5;
            
            overlayContext.fillText(`Player Velocity: (${currentPlayer.velocity.x.toFixed(1)}, ${currentPlayer.velocity.y.toFixed(1)})`, 20, y);
            y += this.debugTextSize + 5;
            
            const nearestDist = this.findNearestGround(currentPlayer.pos);
            overlayContext.fillText(`Distance to Ground: ${nearestDist.toFixed(1)}`, 20, y);
            y += this.debugTextSize + 5;
        }

        this.groundSegments.forEach(segment => {
            const screenPos = worldToScreen(segment.pos);
            const screenSize = segment.size.scale(cameraScale);
            
            overlayContext.strokeStyle = segment.collision ? '#00ff00' : '#ff0000';
            overlayContext.lineWidth = 3;
            overlayContext.strokeRect(
                screenPos.x - screenSize.x/2,
                screenPos.y - screenSize.y/2,
                screenSize.x,
                screenSize.y
            );

            overlayContext.fillStyle = '#ffff00';
            overlayContext.font = '16px Arial';
            overlayContext.textAlign = 'center';
            overlayContext.fillText(
                `#${segment.debugInfo.id}`,
                screenPos.x,
                screenPos.y - screenSize.y/2 - 5
            );
        });

        if (currentPlayer) {
            const playerScreenPos = worldToScreen(currentPlayer.pos);
            const playerSize = currentPlayer.size.scale(cameraScale);
            
            overlayContext.strokeStyle = '#00ffff';
            overlayContext.lineWidth = 2;
            overlayContext.strokeRect(
                playerScreenPos.x - playerSize.x/2,
                playerScreenPos.y - playerSize.y/2,
                playerSize.x,
                playerSize.y
            );
        }

        overlayContext.restore();
    }

    findNearestGround(pos) {
        let minDist = Infinity;
        this.groundSegments.forEach(segment => {
            const dist = pos.distance(segment.pos);
            minDist = Math.min(minDist, dist);
        });
        return minDist;
    }

    render() {
        if (this.debugMode) {
            this.debugRender();
        }
    }
} 