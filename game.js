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
let availableCharacters = [Bear, Bunny, Cat, Dog, Parrot, Turtle];
let currentCharacterIndex = 0;
let gameUI;
let levelManager;
let transition;


// Sprite sheets konfigürasyonunu kaldır
const spriteSheets = []; // Boş array bırakalım, çünkü engineInit bir array bekliyor

function gameInit() {
    cameraScale = gameScale;
    gravity = -0.02;
    
    // Piksel-perfect rendering için canvas ayarları
    mainContext.imageSmoothingEnabled = false;
    overlayContext.imageSmoothingEnabled = false;
    
    background = new ParallaxBackground(mainCanvas, {
        get x() { return cameraPos.x },
        get y() { return cameraPos.y }
    }, currentLevel);
    gameUI = new GameUI();
    levelManager = new LevelManager();
    transition = new Transition();
}

function startGame() {
    gameState = 'playing';
    levelManager.loadLevel(0);
}

function loadNextLevel() {
    if (levelManager.currentLevelIndex < levelManager.levels.length - 1) {
        // Fade out
        transition.start('spiral', 0.7, () => {
            levelManager.nextLevel();

            background = new ParallaxBackground(mainCanvas, {
                get x() { return cameraPos.x },
                get y() { return cameraPos.y }
            }, levelManager.currentLevelIndex);
            // Fade in
            transition.start('spiral', 0.7, null, -1);
        }, 1);
    } else {
        gameState = 'completed';
        engineObjects.forEach(o => {
            if (o !== background) {
                o.destroy();
            }
        });
    }
}

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
    
    // Set the context properties for centering the text
    overlayContext.textAlign = 'center'; // Horizontally center the text
    overlayContext.textBaseline = 'middle'; // Vertically center the text

    // Draw the credits title
    overlayContext.font = '36px Arial';
    overlayContext.fillStyle = '#fff';
    overlayContext.fillText('Credits', mainCanvas.width / 2, mainCanvas.height / 4);

    // Draw the creators' names
    overlayContext.font = '24px Arial';
    overlayContext.fillText('Ömer Duran & Furkan Ünsalan', mainCanvas.width / 2, mainCanvas.height / 2);

    // Draw the return text
    overlayContext.font = '20px Arial';
    overlayContext.fillText('Press ESC to return', mainCanvas.width / 2, mainCanvas.height * 0.8);
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

function switchPlayer() {
    if (!currentPlayer) return;

    const pos = currentPlayer.pos;
    const health = currentPlayer.health;

    // Destroy the current player
    currentPlayer.destroy();

    // Switch to the next character
    currentCharacterIndex = (currentCharacterIndex + 1) % availableCharacters.length;
    const CharacterClass = availableCharacters[currentCharacterIndex];

    // Slightly raise the new character's position for a "switching in air" effect
    const airborneOffset = vec2(0, 0.5); // Adjust the Y offset as needed
    const newPos = pos.add(airborneOffset);

    currentPlayer = new CharacterClass(newPos);

    // Carry over health and activate the new player
    currentPlayer.health = health;
    currentPlayer.isActive = true;

    console.log('Transformed to:', CharacterClass.name);
}


function gameUpdate() {
    transition.update();
    
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
        case 'paused':
            background.render();
            
            // Draw current level platforms
            if (levelManager && levelManager.levels[levelManager.currentLevelIndex]) {
                const currentLevel = levelManager.levels[levelManager.currentLevelIndex];
                currentLevel.platforms.forEach(p => {
                    drawRect(
                        vec2(p.pos.x + p.size.x/2, p.pos.y + p.size.y/2),
                        p.size,
                        p.color || new Color(.5, .3, .2)
                    );
                });
            }

            // Draw game UI
            gameUI.render();
            
            if (gameState === 'paused') {
                drawPauseMenu();
            }
            break;
    }
    
    // Always render transition last
    transition.render();
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