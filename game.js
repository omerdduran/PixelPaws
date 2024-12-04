'use strict';

let gameScale = 25;
let worldSize = vec2(32, 32);

let currentLevel = 0;
let activePlayerIndex = 0;
let currentPlayer = null;
let background;

// Add game state tracking
let gameState = 'start'; // 'start', 'credits', 'playing', 'paused', 'completed', 'gameover'
let menuSelection = 0; // 0: Start, 1: Credits
let pauseMenuSelection = 0; // 0: Resume, 1: Main Menu

// Add start screen background
let startScreenBackground = new Image();
startScreenBackground.src = '../assets/startscreen.png';

// Add at the top with other image loads
let textLogo = new Image();
textLogo.src = '../assets/text-logo.png';

// Add at the top with other variables
let timeScale = 1;  // Replace engineUpdateEnabled with timeScale

// Add this function before engineInit
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
        // Oyun tamamlandığında
        gameState = 'completed';
        // Tüm oyun nesnelerini temizle
        engineObjects.forEach(o => {
            if (o !== background) {
                o.destroy();
            }
        });
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
        updateGameLogic();
    } else if (gameState === 'completed') {
        // Completed ekranından ana menüye dönüş
        if (keyWasPressed('Space')) {
            resetGame();
        }
    }
}

// Add new function to handle game logic updates
function updateGameLogic() {
    // Move all game logic here
    if (keyWasPressed('Digit7')) {
        switchPlayer();
    }

    if (currentPlayer) {
        cameraPos = cameraPos.lerp(currentPlayer.pos, .1);
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
        case 'completed':
            drawGameComplete();
            break;
        case 'playing':
        case 'paused': // Draw game state even when paused
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
            
            // Draw pause menu over the game if paused
            if (gameState === 'paused') {
                drawPauseMenu();
            }
            break;
    }
}

function gameUpdatePost() {
    // Handle pause state changes
    if (gameState === 'playing' && keyWasPressed('Escape')) {
        gameState = 'paused';
        pauseMenuSelection = 0;
    } else if (gameState === 'paused') {
        // Pause menu controls
        if (keyWasPressed('ArrowUp')) {
            pauseMenuSelection = (pauseMenuSelection - 1 + 2) % 2;
        }
        if (keyWasPressed('ArrowDown')) {
            pauseMenuSelection = (pauseMenuSelection + 1) % 2;
        }
        if (keyWasPressed('Enter') || keyWasPressed('Space')) {
            switch(pauseMenuSelection) {
                case 0: // Resume
                    gameState = 'playing';
                    break;
                case 1: // Main Menu
                    resetGame();
                    break;
            }
        }
        // Quick resume with ESC
        if (keyWasPressed('Escape')) {
            gameState = 'playing';
        }
    }

    // Use the engine's pause system
    setPaused(gameState === 'paused');
    
    if (gameState === 'paused') {
        engineObjects.forEach(object => {
            if (object !== background) {
                // Stop all movement
                object.velocity = vec2(0, 0);
                object.acceleration = vec2(0, 0);
                object.gravity = 0;
            }
        });
    }
}

// Add this new function to handle game reset
function resetGame() {
    // Destroy all game objects
    engineObjects.forEach(o => {
        if (o !== background) {
            o.destroy();
        }
    });
    
    // Reset game state
    gameState = 'start';
    menuSelection = 0;
    currentPlayer = null;
    currentLevel = 0;
    activePlayerIndex = 0;
    
    // Reset camera
    cameraPos = vec2(0, 0);
    
    // Clear tile collision data
    initTileCollision(worldSize);
}

function gameRenderPost() {}

function drawPauseMenu() {
    // Add dark overlay to show game is paused
    overlayContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    overlayContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // Draw pause menu text
    overlayContext.textAlign = 'center';
    overlayContext.textBaseline = 'middle';
    
    // Pause title
    overlayContext.font = '36px Arial';
    overlayContext.fillStyle = '#fff';
    overlayContext.fillText('PAUSED', mainCanvas.width/2, mainCanvas.height/3);
    
    // Menu items
    overlayContext.font = '24px Arial';
    const pauseItems = ['Resume', 'Main Menu'];
    const menuY = mainCanvas.height/2;
    const menuSpacing = 40;

    pauseItems.forEach((item, index) => {
        if (index === pauseMenuSelection) {
            overlayContext.fillStyle = '#ffff00';
            overlayContext.fillText('> ' + item + ' <', mainCanvas.width/2, menuY + index * menuSpacing);
        } else {
            overlayContext.fillStyle = '#fff';
            overlayContext.fillText(item, mainCanvas.width/2, menuY + index * menuSpacing);
        }
    });
}

// Oyun tamamlama ekranı için yeni fonksiyon
function drawGameComplete() {
    // Arka plan ve overlay
    drawMenuBackground();
    
    // Başlık
    overlayContext.textAlign = 'center';
    overlayContext.textBaseline = 'middle';
    overlayContext.fillStyle = '#fff';
    
    overlayContext.font = '48px Arial';
    overlayContext.fillText('Congratulations!', mainCanvas.width/2, mainCanvas.height/3);
    
    // Alt başlık
    overlayContext.font = '24px Arial';
    overlayContext.fillText('You have completed all levels!', mainCanvas.width/2, mainCanvas.height/2);
    
    // Yönlendirme metni
    overlayContext.font = '20px Arial';
    overlayContext.fillText('Press SPACE to return to main menu', mainCanvas.width/2, mainCanvas.height * 0.7);
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);