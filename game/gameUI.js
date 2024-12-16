class GameUI {
    constructor() {
        this.padding = 20;
        this.colors = {
            background: 'rgba(0, 0, 0, 0.7)',
            text: '#ffffff',
            healthBar: {
                background: '#3d0000',
                fill: '#ff3333',
                border: '#ffffff'
            },
            energyBar: '#4444ff',
            coin: '#ffd700',
            highlight: '#ffff00'
        };

        // Preload health bar images
        this.healthBarBg = new Image();
        this.healthBarFill = new Image();

        this.healthBarBg.src = '../sprites/health_bar/health_bar_decoration.png'; // Update paths if necessary
        this.healthBarFill.src = '../sprites/health_bar/health_bar.png';
    }

    render() {
        if (gameState !== 'playing' && gameState !== 'paused') return;

        // Draw player info box in top left
        this.drawPlayerInfo();

        // Draw level info in top right
        this.drawLevelInfo();

        // Draw controls help in bottom left
        this.drawControlsHelp();

        // Draw special ability cooldown indicator
        if (currentPlayer) {
            this.drawAbilityCooldown();
        }
    }

    drawPlayerInfo() {
        if (!currentPlayer) return;
    
        const boxWidth = 250;
        const boxHeight = 120;
        const x = this.padding;
        const y = this.padding;
    
        // Draw background panel with border
        this.drawPanel(x, y, boxWidth, boxHeight);
    
        // Draw character name with icon
        overlayContext.font = 'bold 24px Arial';
        overlayContext.fillStyle = this.colors.text;
        overlayContext.textAlign = 'left';
        overlayContext.textBaseline = 'top';
        overlayContext.fillText(`${currentPlayer.constructor.name}`, x + 5, y + 15);
    
        const healthBarWidth = boxWidth - 30;
        const healthBarHeight = 35;
        const healthX = x + 15;
        const healthY = y + 45;
    
        // Slightly scale down the heart (background)
        const heartScale = 0.5; // Scale down to 50% of the original size
        const heartWidth = healthBarWidth * heartScale; 
        const heartHeight = heartWidth / (this.healthBarBg.width / this.healthBarBg.height); // Maintain aspect ratio
    
        // Correct positioning of the heart background
        const heartX = healthX - 10; // Align heart background with the health bar X position
        const heartY = healthY - ((heartHeight - healthBarHeight) / 2); // Center vertically relative to the health bar
    
        // Draw the heart (health bar background)
        overlayContext.drawImage(
            this.healthBarBg,
            0, 0, this.healthBarBg.width, this.healthBarBg.height, // Source dimensions
            heartX, heartY, heartWidth, heartHeight // Destination dimensions
        );
    
        // Calculate health percentage
        const healthPercent = currentPlayer.health / currentPlayer.maxHealth;
    
        // Draw health bar fill
        overlayContext.drawImage(
            this.healthBarFill,
            0, 0, this.healthBarFill.width * healthPercent, this.healthBarFill.height, // Crop fill image
            healthX, healthY, healthBarWidth * healthPercent, healthBarHeight          // Scale to fit health percentage
        );
    
        // Draw health text
        overlayContext.font = 'bold 16px Arial';
        overlayContext.fillStyle = this.colors.text;
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'middle';
        overlayContext.fillText(
            `${Math.ceil(currentPlayer.health)} / ${currentPlayer.maxHealth}`,
            healthX + healthBarWidth / 2,
            healthY + healthBarHeight / 2 + 1
        );
    
        // Draw coins with icon
        overlayContext.font = 'bold 20px Arial';
        overlayContext.fillStyle = this.colors.coin;
        overlayContext.textAlign = 'left';
        overlayContext.fillText(` ${currentPlayer.coins}`, x + 5, y + 95);

        overlayContext.font = 'bold 20px Arial';
        overlayContext.fillStyle = '#FFFFFF'
        overlayContext.textAlign = 'right';
        overlayContext.fillText(`Switches: ${currentPlayer.switchesLeft}`, x + 230, y + 95);
    }

    drawLevelInfo() {
        const boxWidth = 150;
        const boxHeight = 50;
        const x = mainCanvas.width - this.padding - boxWidth;
        const y = this.padding;
    
        // Ensure that currentLevelIndex is updated and correct
        const levelIndex = levelManager.currentLevelIndex; // Assuming you have a LevelManager instance called levelManager
        const levelText = `Level ${levelIndex + 1}`; // Level is 1-based, so add 1
    
        // Draw background panel
        this.drawPanel(x, y, boxWidth, boxHeight);
    
        // Draw level text
        overlayContext.font = 'bold 24px Arial';
        overlayContext.fillStyle = this.colors.text;
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'middle';
        overlayContext.fillText(levelText, x + boxWidth / 2, y + boxHeight / 2);
    }

    drawControlsHelp() {
        const boxWidth = 200;
        const boxHeight = 100;
        const x = this.padding;
        const y = mainCanvas.height - this.padding - boxHeight;

        // Draw background panel
        this.drawPanel(x, y, boxWidth, boxHeight);

        // Draw controls text
        overlayContext.textAlign = 'left';
        overlayContext.textBaseline = 'top';
        overlayContext.fillStyle = this.colors.text;
        overlayContext.textBaseline = 'middle';
        overlayContext.font = '16px Arial';

        const controls = [
            '← → - Move',
            'W - Jump',
            'Q - Special Ability',
            'SPACE - Attack',
            '7 - Switch Character'
        ];

        controls.forEach((text, index) => {
            overlayContext.fillText(text, x + 15, y + 15 + index * 18);
        });
    }

    drawAbilityCooldown() {
        if (currentPlayer.specialAbilityCooldown > 0) {
            const size = 40;
            const x = mainCanvas.width - this.padding - size;
            const y = mainCanvas.height - this.padding - size;

            // Draw cooldown circle
            overlayContext.beginPath();
            overlayContext.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
            overlayContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
            overlayContext.fill();

            // Draw cooldown progress
            const progress = currentPlayer.specialAbilityCooldown / 0.2; // Adjust based on cooldown time
            overlayContext.beginPath();
            overlayContext.moveTo(x + size/2, y + size/2);
            overlayContext.arc(x + size/2, y + size/2, size/2, -Math.PI/2, -Math.PI/2 + (1 - progress) * Math.PI * 2);
            overlayContext.lineTo(x + size/2, y + size/2);
            overlayContext.fillStyle = '#4444ff';
            overlayContext.fill();

            // Draw Q text
            overlayContext.font = 'bold 20px Arial';
            overlayContext.fillStyle = '#ffffff';
            overlayContext.textAlign = 'center';
            overlayContext.textBaseline = 'middle';
            overlayContext.fillText('Q', x + size/2, y + size/2);
        }
    }

    drawPanel(x, y, width, height) {
        // Draw panel background with rounded corners
        overlayContext.fillStyle = this.colors.background;
        overlayContext.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        overlayContext.lineWidth = 2;
        
        this.roundRect(x, y, width, height, 10);
        overlayContext.fill();
        overlayContext.stroke();
    }

    roundRect(x, y, width, height, radius) {
        overlayContext.beginPath();
        overlayContext.moveTo(x + radius, y);
        overlayContext.lineTo(x + width - radius, y);
        overlayContext.quadraticCurveTo(x + width, y, x + width, y + radius);
        overlayContext.lineTo(x + width, y + height - radius);
        overlayContext.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        overlayContext.lineTo(x + radius, y + height);
        overlayContext.quadraticCurveTo(x, y + height, x, y + height - radius);
        overlayContext.lineTo(x, y + radius);
        overlayContext.quadraticCurveTo(x, y, x + radius, y);
        overlayContext.closePath();
    }
} 