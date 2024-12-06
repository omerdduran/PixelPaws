'use strict';

let gameScale = 25;
let worldSize = vec2(200, 32);

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

let unlockedCharacters = [Bear, Bunny];  // Starting with Bear and Bunny unlocked
let lockedCharacters = [Cat, Dog, Parrot, Turtle];  // Other characters are locked

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

            // Unlock the next character after skipping a level
            if (lockedCharacters.length > 0) {
                const unlockedCharacter = lockedCharacters.shift();  // Get the next locked character
                unlockedCharacters.push(unlockedCharacter);  // Add to unlocked list
                console.log(`${unlockedCharacter.name} has been unlocked!`);
            }

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
    const menuItems = ['Start Game', 'Credits', 'Help'];
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

    // Switch to the next character (from the unlocked list)
    currentCharacterIndex = (currentCharacterIndex + 1) % unlockedCharacters.length;
    const CharacterClass = unlockedCharacters[currentCharacterIndex];

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
            menuSelection = (menuSelection - 1 + 3) % 3;
        }
        if (keyWasPressed('ArrowDown')) {
            menuSelection = (menuSelection + 1) % 3;
        }
        if (keyWasPressed('Enter') || keyWasPressed('Space')) {
            switch(menuSelection) {
                case 0: // Start Game
                    startGame();
                    break;
                case 1: // Credits
                    gameState = 'credits';
                    break;
                case 2: // Credits
                    gameState = 'help';
                    break;
            }
        }
    } else if (gameState === 'credits') {
        if (keyWasPressed('Escape')) {
            gameState = 'start';
        }
    } else if (gameState === 'help') {
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
        case 'help':
            drawHelp();
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
                        vec2(p.pos.x + p.size.x/2, p.pos.y + 0.5),
                        vec2(p.size.x, 1),
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
            pauseMenuSelection = (pauseMenuSelection - 1 + 3) % 3;
        }
        if (keyWasPressed('ArrowDown')) {
            pauseMenuSelection = (pauseMenuSelection + 1) % 3;
        }
        if (keyWasPressed('Enter') || keyWasPressed('Space')) {
            switch(pauseMenuSelection) {
                case 0: // Resume
                    gameState = 'playing';
                    break;
                case 1: // Main Menu
                    resetGame();
                    break;
                case 2: // Main Menu
                    gameState = 'help';
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
    
    // Reset background to the first level
    background = new ParallaxBackground(mainCanvas, {
        get x() { return cameraPos.x },
        get y() { return cameraPos.y }
    }, 0); // Use 0 for the first level's background
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
    const pauseItems = ['Resume', 'Main Menu', 'Help'];
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
    overlayContext.fillStyle = '#fff';
    overlayContext.fillText('Ömer Duran & Furkan Ünsalan', mainCanvas.width / 2, mainCanvas.height / 2);

    // Add the return instruction with a glowing effect
    overlayContext.font = '18px Arial';
    overlayContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
    overlayContext.fillText('Press ESC to return', mainCanvas.width / 2, mainCanvas.height * 0.95);
    
    // Optional: create some glow or subtle effect for the links
    applyGlowEffect(mainCanvas.width / 2, mainCanvas.height * 0.65, 'github.com/omerdduran/PixelPaws');
    applyGlowEffect(mainCanvas.width / 2, mainCanvas.height * 0.75, 'github.com/furkanunsalan');
    applyGlowEffect(mainCanvas.width / 2, mainCanvas.height * 0.85, 'github.com/omerdduran');
}

// Helper function for glow effect on links
function applyGlowEffect(x, y, text) {
    overlayContext.shadowColor = '#ffffff';
    overlayContext.shadowBlur = 10;
    overlayContext.fillText(text, x, y);
    overlayContext.shadowColor = 'transparent';  // Reset shadow after drawing
}

function drawHelp() {
    drawMenuBackground();

    // Set the base context properties
    overlayContext.textAlign = 'center';
    overlayContext.textBaseline = 'middle';
    overlayContext.fillStyle = '#fff';

    // Draw the Help Screen title with a larger font and shadow
    overlayContext.font = '48px Arial';
    overlayContext.shadowColor = '#000';
    overlayContext.shadowBlur = 4;
    overlayContext.fillStyle = '#FFD700'; // Golden color for the title
    overlayContext.fillText('Help Screen', mainCanvas.width / 2, mainCanvas.height / 10);

    // Reset shadow for the rest of the text
    overlayContext.shadowBlur = 0;
    overlayContext.fillStyle = '#fff';

    // Layout positions
    const column1X = mainCanvas.width / 4; // Controls and power-ups column
    const column2X = (mainCanvas.width * 3) / 4; // Character abilities column
    const startY = mainCanvas.height / 5;
    const lineHeight = 30;
    const sectionSpacing = 50; // Extra space between sections

    // Define the content
    const controls = [
        '← → - Move',
        'W - Jump',
        'Q - Special Ability',
        'SPACE - Attack',
        '7 - Switch Character',
    ];

    const abilities = {
        bear: 'Berserker',
        bunny: 'Double Jump',
        cat: 'Climb Walls',
        dog: 'Bark and Freeze Enemies',
        parrot: 'Limited Time Flying',
        turtle: 'Shield',
    };

    const powerUps = [
        'Double Damage - Increases attack power',
        'Health Pack - Restores 25 Health',
        'Invincibility - Temporary Immunity',
        'Jump Boost - Enhanced Jump Power',
        'Magnetic Field - Attracts Nearby Coins',
        'Speed Boost - Double Movement Speed',
    ];

    const allAbilities = Object.entries(abilities).map(
        ([character, ability]) =>
            `${character.charAt(0).toUpperCase() + character.slice(1)}: ${ability}`
    );

    // Draw Controls Section
    overlayContext.textAlign = 'center';
    overlayContext.font = '30px Arial';
    overlayContext.fillStyle = '#FF4500'; // Orange for headings
    overlayContext.fillText('Controls', column1X, startY);

    overlayContext.font = '22px Arial';
    overlayContext.fillStyle = '#fff';
    controls.forEach((control, index) => {
        overlayContext.fillText(control, column1X, startY + lineHeight * (index + 1));
    });

    // Draw Power-Ups Section
    const powerUpsStartY = startY + lineHeight * (controls.length + 2) + sectionSpacing;
    overlayContext.font = '30px Arial';
    overlayContext.fillStyle = '#FF4500';
    overlayContext.fillText('Power-Ups', column1X, powerUpsStartY);

    overlayContext.font = '22px Arial';
    overlayContext.fillStyle = '#fff';
    powerUps.forEach((powerUp, index) => {
        overlayContext.fillText(powerUp, column1X, powerUpsStartY + lineHeight * (index + 1));
    });

    // Draw Character Abilities Section
    overlayContext.textAlign = 'center';
    const abilitiesStartY = startY;
    overlayContext.font = '30px Arial';
    overlayContext.fillStyle = '#FF4500';
    overlayContext.fillText('Character Abilities', column2X, abilitiesStartY);

    overlayContext.font = '22px Arial';
    overlayContext.fillStyle = '#fff';
    allAbilities.forEach((ability, index) => {
        overlayContext.fillText(ability, column2X, abilitiesStartY + lineHeight * (index + 1));
    });

    // Draw Footer Instructions
    overlayContext.textAlign = 'center';
    overlayContext.font = '24px Arial';
    overlayContext.fillStyle = '#ADFF2F'; // Light green for footer text
    overlayContext.fillText('Press ESC to return', mainCanvas.width / 2, mainCanvas.height - 50);
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