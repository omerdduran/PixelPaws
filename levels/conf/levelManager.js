class LevelManager {
    constructor() {
        this.levels = [level1, level2];
        this.currentLevelIndex = 0;
    }

    loadLevel(index) {
        const level = this.levels[index];
        if (!level) return false;

        // Clear current level
        engineObjects.forEach(o => o.destroy());
        initTileCollision(worldSize);

        // Load level data
        this.currentLevelIndex = index;
        
        // Call level start event
        level.events.onStart();

        // Create platforms
        level.platforms.forEach(p => {
            for (let x = 0; x < p.size.x; x++) {
                if (p.pos.x + x >= 0 && p.pos.x + x < worldSize.x && 
                    p.pos.y >= 0 && p.pos.y < worldSize.y) {
                    setTileCollisionData(vec2(p.pos.x + x, p.pos.y), 1);
                }
            }
        });

        // Create player
        currentPlayer = new Bear(level.data.startPosition);
        currentPlayer.isActive = true;
        currentCharacterIndex = 0;

        // Create portal
        new Portal(level.data.portalPosition);

        // Create objects
        level.objects.coins.forEach(pos => new Coin(pos));
        level.objects.enemies.forEach(data => new Enemy(data.pos, data.distance));
        level.objects.healthPacks.forEach(pos => new HealthPack(pos));
        level.objects.movingPlatforms.forEach(data => 
            new MovingPlatform(data.pos, data.distance, data.vertical));
        level.objects.powerUps.forEach(powerUp => new powerUp.type(powerUp.pos));

        return true;
    }

    nextLevel() {
        const currentLevel = this.levels[this.currentLevelIndex];
        currentLevel.events.onComplete();

        if (this.currentLevelIndex < this.levels.length - 1) {
            return this.loadLevel(this.currentLevelIndex + 1);
        }
        return false;
    }
} 