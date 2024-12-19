const level2 = {
    platforms: [
        // Ana zemin platformları
        {pos: vec2(0,0), size: vec2(20,1), color: new Color(0.3, 0.2, 0.8)},
        // {pos: vec2(30,0), size: vec2(20,1), color: new Color(0.3, 0.2, 0.8)},
        {pos: vec2(60,0), size: vec2(20,1), color: new Color(0.3, 0.2, 0.8)},
        
        // Alt yol platformları (daha geniş aralıklarla)
        {pos: vec2(15,5), size: vec2(6,1), color: new Color(0.7, 0.5, 0.2)},
        {pos: vec2(35,8), size: vec2(8,1), color: new Color(0.8, 0.3, 0.2)},
        {pos: vec2(55,11), size: vec2(5,1), color: new Color(0.5, 0.7, 0.3)},
        
        // Üst yol platformları (daha yüksek ve geniş aralıklarla)
        {pos: vec2(20,10), size: vec2(6,1), color: new Color(0.7, 0.5, 0.2)},
        {pos: vec2(40,15), size: vec2(7,1), color: new Color(0.8, 0.3, 0.2)},
        {pos: vec2(60,20), size: vec2(5,1), color: new Color(0.5, 0.7, 0.3)},
        
        // Ortak bitiş platformu (daha yüksekte)
        {pos: vec2(75,17), size: vec2(8,1), color: new Color(0.9, 0.2, 0.5)},
    ],

    data: {
        startPosition: vec2(2, 2),
        portalPosition: vec2(78, 19),
        backgroundColor: new Color(0.1, 0.2, 0.3),
        difficulty: 7,
        name: "The Distant Paths"
    },

    objects: {
        coins: [
            // Alt yol coinleri
            vec2(16,6), 
            vec2(36,9), 
            vec2(56,12),
            
            // Üst yol coinleri 
            vec2(21,11),
            vec2(41,16),
            vec2(61,21),
            
            // Ortak alan coinleri
            vec2(76,18),
            vec2(78,18)
        ],
        
        enemies: [
            // Sabit platformlardaki düşmanlar
            {pos: vec2(18,6), distance: 3},  // İlk alt yol platformunda
            {pos: vec2(38,9), distance: 4},  // İkinci alt yol platformunda
            {pos: vec2(57,12), distance: 3}, // Üçüncü alt yol platformunda
            
            {pos: vec2(22,11), distance: 3}, // İlk üst yol platformunda
            {pos: vec2(42,16), distance: 4}, // İkinci üst yol platformunda
            {pos: vec2(62,21), distance: 3}  // Üçüncü üst yol platformunda
        ],
        
        healthPacks: [
            // Alt yol health pack'leri
            vec2(18,6),
            vec2(58,12),
            
            // Üst yol health pack'leri
            vec2(23,11),
            vec2(63,21)
        ],
        
        movingPlatforms: [
            // Alt yol dikey platformları
            {pos: vec2(25,6), distance: 4, vertical: true},
            {pos: vec2(45,9), distance: 5, vertical: true},
            
            // Üst yol dikey platformları
            {pos: vec2(30,12), distance: 5, vertical: true},
            {pos: vec2(50,17), distance: 4, vertical: true},
            
            // Yatay platformlar
            {pos: vec2(35,7), distance: 6, vertical: false},
            {pos: vec2(55,16), distance: 5, vertical: false}
        ],
        
        powerUps: [
            // Alt yoldaki power-up'lar
            { type: SpeedBoost, pos: vec2(37,9) },
            { type: JumpBoost, pos: vec2(57,12) },
            
            // Üst yoldaki power-up'lar
            { type: Invincibility, pos: vec2(42,16) },
            { type: SpeedBoost, pos: vec2(62,21) }
        ]
    },

    events: {
        onStart: () => {
            console.log("Choose your path wisely! The gaps are treacherous!");
        },
        onComplete: () => {
            console.log("Incredible! You've conquered The Distant Paths!");
        },
        onCoinCollect: (coinPos) => {
            console.log(`Coin collected at ${coinPos}!`);
        },
        onEnemyDefeat: (enemyPos) => {
            console.log(`Enemy defeated at position ${enemyPos}.`);
        }
    }
};