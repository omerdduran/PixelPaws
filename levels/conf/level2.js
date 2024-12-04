const level2 = {
    platforms: [
        {pos: vec2(0,0), size: vec2(20,1)},    // ground
        {pos: vec2(5,4), size: vec2(2,1)},     // platforms
        {pos: vec2(10,8), size: vec2(2,1)},
        {pos: vec2(15,12), size: vec2(2,1)},
    ],

    data: {
        startPosition: vec2(2, 5),
        portalPosition: vec2(15, 14),
        backgroundColor: new Color(0.6, 0.4, 0.8),  // Purple-ish
        difficulty: 2,
        name: "The Challenge"
    },

    objects: {
        coins: [
            vec2(7,5), 
            vec2(11,9), 
            vec2(16,13)
        ],
        
        enemies: [
            {pos: vec2(8,1), distance: 4},
            {pos: vec2(16,12), distance: 2}
        ],
        
        healthPacks: [
            vec2(12,9)
        ],
        
        movingPlatforms: [
            {pos: vec2(8,8), distance: 4, vertical: true}
        ],
        
        powerUps: [
            { type: DoubleDamage, pos: vec2(5, 5) },
            { type: MagneticField, pos: vec2(10, 9) },
            { type: HealthPack, pos: vec2(15, 13) }
        ]
    },

    events: {
        onStart: () => {
            console.log("Level 2 started!");
        },
        onComplete: () => {
            console.log("Level 2 completed!");
        }
    }
}; 