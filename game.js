'use strict';

let gameScale = 25;
let worldSize = vec2(32, 32);

let currentLevel = 0;
let activePlayerIndex = 0;
let currentPlayer = null;
let background;

function switchPlayer() {
    if (!currentPlayer) return;
    
    const pos = currentPlayer.pos;
    const health = currentPlayer.health;
    
    currentPlayer.destroy();
    
    activePlayerIndex = (activePlayerIndex + 1) % 2;
    if (activePlayerIndex === 0) {
        currentPlayer = new RedPlayer(pos);
    } else {
        currentPlayer = new BluePlayer(pos);
    }
    
    currentPlayer.health = health;
    currentPlayer.isActive = true;
    
    console.log('Transformed to player:', activePlayerIndex);
}

function loadNextLevel() {
    if (currentLevel < levels.length - 1) {
        loadLevel(currentLevel + 1);
    } else {
        // TODO: Show game complete screen
        loadLevel(0);
    }
}

function loadLevel(levelIndex) {
    engineObjects.forEach(o => o.destroy());
    initTileCollision(worldSize);
    
    levels[levelIndex].forEach(p => {
        for (let x = 0; x < p.size.x; x++) {
            for (let y = 0; y < p.size.y; y++) {
                setTileCollisionData(vec2(p.pos.x + x, p.pos.y + y), 1);
            }
        }
    });
    
    // Create player at level start position
    currentPlayer = new RedPlayer(levelStartPositions[levelIndex]);
    currentPlayer.isActive = true;
    activePlayerIndex = 0;
    
    // Create portal
    new Portal(portalPositions[levelIndex]);
    
    // Create coins
    coinPositions[levelIndex].forEach(pos => new Coin(pos));
    
    // Create enemies
    enemyData[levelIndex].forEach(data => new Enemy(data.pos, data.distance));
    
    // Create health packs
    healthPackPositions[levelIndex].forEach(pos => new HealthPack(pos));
    
    // Create moving platforms
    movingPlatformData[levelIndex].forEach(data => 
        new MovingPlatform(data.pos, data.distance, data.vertical));
    
    currentLevel = levelIndex;
}

function gameInit() {
    cameraScale = gameScale;
    gravity = -0.02;
    background = new ParallaxBackground(mainCanvas, {
        get x() { return cameraPos.x },
        get y() { return cameraPos.y }
    });
    loadLevel(0);
}

function gameUpdate() {
    // Switch player when 7 is pressed
    if (keyWasPressed('Digit7')) {
        switchPlayer();
    }

    // Camera follow player
    if (currentPlayer) {
        cameraPos = cameraPos.lerp(currentPlayer.pos, .1);
    }
}

function gameRender() {
    // Draw background first
    background.render();
    
    // Draw platforms
    levels[currentLevel].forEach(p => {
        drawRect(
            vec2(p.pos.x + p.size.x/2, p.pos.y + p.size.y/2),
            p.size,
            p.color || new Color(.5, .3, .2)  // fallback color if none specified
        );
    });

    // Draw indicator for active player
    if (currentPlayer) {
        const arrowOffset = vec2(0, 1.5);
        const arrowSize = vec2(0.5, 0.5);
        drawRect(
            currentPlayer.pos.add(arrowOffset),
            arrowSize,
            new Color(1, 1, 0)  // Yellow indicator
        );
    }
}

function gameUpdatePost() {}
function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);