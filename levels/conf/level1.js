const level1 = {
    // Platform configurations
    platforms: [
        {pos: vec2(0,0), size: vec2(200,1), color: new Color(0.4, 0.3, 0.9)},    // ground
        {pos: vec2(4,3), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},     // platforms
        {pos: vec2(8,6), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},
        {pos: vec2(12,9), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},
    ],

    // Level specific data
    data: {
        startPosition: vec2(2, 5),
        portalPosition: vec2(12, 11),
        backgroundColor: new Color(0.5, 0.8, 1),  // Sky blue
        difficulty: 1,
        name: "Getting Started"
    },

    // Collectibles and obstacles
    objects: {
        coins: [
            vec2(6,5), 
            vec2(9,7), 
            vec2(13,10)
        ],
        
        enemies: [
            {pos: vec2(7,1), distance: 3},
            {pos: vec2(14,9), distance: 2}
        ],
        
        healthPacks: [
            vec2(10,7)
        ],
        
        movingPlatforms: [
            {pos: vec2(6,6), distance: 3, vertical: false}
        ],
        
        powerUps: [
            { type: SpeedBoost, pos: vec2(4, 4) },
            { type: JumpBoost, pos: vec2(8, 7) },
            { type: Invincibility, pos: vec2(12, 10) }
        ]
    },

    // Level specific events or triggers
    events: {
        onStart: () => {
            console.log("Level 1 started!");
        },
        onComplete: () => {
            console.log("Level 1 completed!");
        }
    }
}; 