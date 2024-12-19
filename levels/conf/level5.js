const level5 = {
    // Platform configurations
    platforms: [
        {pos: vec2(0,0), size: vec2(30,1), color: new Color(0.3, 0.2, 0.8)},
        {pos: vec2(8,3), size: vec2(4,1), color: new Color(0.7, 0.5, 0.2)},
        {pos: vec2(16,6), size: vec2(3,1), color: new Color(0.8, 0.3, 0.2)},
        {pos: vec2(23,10), size: vec2(6,1), color: new Color(0.5, 0.7, 0.3)},
        {pos: vec2(32,14), size: vec2(3,1), color: new Color(0.9, 0.2, 0.5)},
        {pos: vec2(38,18), size: vec2(2,1), color: new Color(0.4, 0.6, 0.9)},
    ],

    // Level specific data
    data: {
        startPosition: vec2(2, 5),
        portalPosition: vec2(39, 20),
        backgroundColor: new Color(0.1, 0.2, 0.3),  // Dark navy for a mysterious vibe
        difficulty: 4,
        name: "The Marathon"
    },

    // Collectibles and obstacles
    objects: {
        coins: [
            vec2(10,4), 
            vec2(17,7), 
            vec2(25,11), 
            vec2(33,15), 
            vec2(38,19),
        ],
        
        enemies: [
            {pos: vec2(12,1), distance: 5},
            {pos: vec2(18,7), distance: 3},
            {pos: vec2(35,15), distance: 4},
            {pos: vec2(38,19), distance: 2},
        ],
        
        
        healthPacks: [
            vec2(9,4),
            vec2(26,11),
            vec2(36,18),
        ],
        
        movingPlatforms: [
            {pos: vec2(12,5), distance: 5, vertical: true},
            {pos: vec2(22,8), distance: 4, vertical: false},
            {pos: vec2(35,16), distance: 6, vertical: true},
        ],
        
        powerUps: [
            { type: SpeedBoost, pos: vec2(7, 3) },
            { type: Invincibility, pos: vec2(24, 11) },
            { type: JumpBoost, pos: vec2(31, 14) },
        ],
    },

    // Level specific events or triggers
    events: {
        onStart: () => {
            console.log("The Marathon begins. Stay focused!");
        },
        onComplete: () => {
            console.log("Congratulations! You conquered The Marathon!");
        },
        onCoinCollect: (coinPos) => {
            console.log(`Shiny coin collected at ${coinPos}!`);
        },
        onEnemyDefeat: (enemyPos) => {
            console.log(`Enemy defeated at position ${enemyPos}.`);
        }
    }
};
