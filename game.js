'use strict';

let gameScale = 25;
let worldSize = vec2(32, 32);

let currentLevel = 0;
let activePlayerIndex = 0;
let currentPlayer = null;
let background;

// Add game state tracking
let gameState = 'start'; // 'start', 'credits', 'playing', 'gameover'
let menuSelection = 0; // 0: Start, 1: Credits

// Add start screen background
let startScreenBackground = new Image();
startScreenBackground.src = '../assets/startscreen.png';

// Add at the top with other image loads
let textLogo = new Image();
textLogo.src = '../assets/text-logo.png';

function drawStartScreen() {
    // Draw the background image
    if (startScreenBackground.complete) {
        const scale = Math.max(
            mainCanvas.width / startScreenBackground.width,
            mainCanvas.height / startScreenBackground.height
        );
        
        const scaledWidth = startScreenBackground.width * scale;
        const scaledHeight = startScreenBackground.height * scale;
        
        const x = (mainCanvas.width - scaledWidth) / 2;
        const y = (mainCanvas.height - scaledHeight) / 2;
        
        overlayContext.drawImage(
            startScreenBackground,
            x, y,
            scaledWidth,
            scaledHeight
        );
    } else {
        overlayContext.fillStyle = '#1a1a33';
        overlayContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    }

    // Add semi-transparent overlay for better text readability
    overlayContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    overlayContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    if (textLogo.complete) {
        const logoWidth = mainCanvas.width * 0.4; // Adjust this value to change logo size
        const logoHeight = (logoWidth / textLogo.width) * textLogo.height;
        const logoX = (mainCanvas.width - logoWidth) / 2;
        const logoY = mainCanvas.height * 0.15; // Adjust this value to change vertical position
        
        overlayContext.drawImage(
            textLogo,
            logoX, logoY,
            logoWidth, logoHeight
        );
    }

    // Menu items
    overlayContext.textAlign = 'center';
    overlayContext.textBaseline = 'middle';
    overlayContext.fillStyle = '#fff';
    
    overlayContext.font = '24px Arial';
    const menuItems = ['Start Game', 'Credits'];
    const menuY = mainCanvas.height/2;
    const menuSpacing = 40;

    menuItems.forEach((item, index) => {
        if (index === menuSelection) {
            overlayContext.fillStyle = '#ffff00';
            overlayContext.fillText('> ' + item + ' <', mainCanvas.width/2, menuY + index * menuSpacing);
        } else {
            overlayContext.fillStyle = '#fff';
            overlayContext.fillText(item, mainCanvas.width/2, menuY + index * menuSpacing);
        }
    });
}

function drawCredits() {
    drawMenuBackground();
    
    overlayContext.font = '36px Arial';
    overlayContext.fillStyle = '#fff';
    overlayContext.fillText('Credits', mainCanvas.width/2, mainCanvas.height/4);

    overlayContext.font = '24px Arial';
    overlayContext.fillText('Ömer Duran & Furkan Ünsalan', mainCanvas.width/2, mainCanvas.height/2);
    
    overlayContext.font = '20px Arial';
    overlayContext.fillText('Press ESC to return', mainCanvas.width/2, mainCanvas.height * 0.8);
}

function drawMenuBackground() {
    // Reuse background drawing code
    if (startScreenBackground.complete) {
        const scale = Math.max(
            mainCanvas.width / startScreenBackground.width,
            mainCanvas.height / startScreenBackground.height
        );
        
        const scaledWidth = startScreenBackground.width * scale;
        const scaledHeight = startScreenBackground.height * scale;
        
        const x = (mainCanvas.width - scaledWidth) / 2;
        const y = (mainCanvas.height - scaledHeight) / 2;
        
        overlayContext.drawImage(
            startScreenBackground,
            x, y,
            scaledWidth,
            scaledHeight
        );
    }
    
    // Add overlay
    overlayContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    overlayContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function startGame() {
    gameState = 'playing';
    loadLevel(0);
}

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
    // Don't load level immediately - wait for player to start game
}

function gameUpdate() {
    if (gameState === 'start') {
        // Menu navigation
        if (keyWasPressed('ArrowUp')) {
            menuSelection = (menuSelection - 1 + 2) % 2;
        }
        if (keyWasPressed('ArrowDown')) {
            menuSelection = (menuSelection + 1) % 2;
        }
        if (keyWasPressed('Enter') || keyWasPressed('Space')) {
            switch(menuSelection) {
                case 0: // Start Game
                    startGame();
                    break;
                case 1: // Credits
                    gameState = 'credits';
                    break;
            }
        }
    } else if (gameState === 'credits') {
        if (keyWasPressed('Escape')) {
            gameState = 'start';
        }
    } else if (gameState === 'playing') {
        // Existing game update code
        if (keyWasPressed('Digit7')) {
            switchPlayer();
        }

        if (currentPlayer) {
            cameraPos = cameraPos.lerp(currentPlayer.pos, .1);
        }
    }
}

function gameRender() {
    switch(gameState) {
        case 'start':
            drawStartScreen();
            break;
        case 'credits':
            drawCredits();
            break;
        case 'playing':
            // Existing game render code
            background.render();
            
            levels[currentLevel].forEach(p => {
                drawRect(
                    vec2(p.pos.x + p.size.x/2, p.pos.y + p.size.y/2),
                    p.size,
                    p.color || new Color(.5, .3, .2)
                );
            });

            if (currentPlayer) {
                const arrowOffset = vec2(0, 1.5);
                const arrowSize = vec2(0.5, 0.5);
                drawRect(
                    currentPlayer.pos.add(arrowOffset),
                    arrowSize,
                    new Color(1, 1, 0)
                );
            }
            break;
    }
}

function gameUpdatePost() {}
function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);