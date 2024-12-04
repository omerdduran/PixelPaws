// Level configurations

// TODO: Move the levels to the bottom of the screen and make them wider
const levels = [
    // Level 0
    [
        {pos: vec2(0,0), size: vec2(40,1), color: new Color(0.4, 0.3, 0.9)},    // brown ground
        {pos: vec2(4,3), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},     // lighter platforms
        {pos: vec2(8,6), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},
        {pos: vec2(12,9), size: vec2(3,1), color: new Color(0.8, 0.5, 0.2)},
    ],
    // Level 1
    [
        {pos: vec2(0,0), size: vec2(20,1)},    // ground
        {pos: vec2(5,4), size: vec2(2,1)},     // harder platforms
        {pos: vec2(10,8), size: vec2(2,1)},
        {pos: vec2(15,12), size: vec2(2,1)},
    ],
];

// Starting positions for each level
const levelStartPositions = [
    vec2(2, 5), 
    vec2(2, 5), 
];

// Portal positions for each level
const portalPositions = [
    vec2(12, 11),
    vec2(15, 14),
];

// Coin positions
const coinPositions = [
    [vec2(6,5), vec2(9,7), vec2(13,10)],  // Level 0 coins
    [vec2(7,5), vec2(11,9), vec2(16,13)],  // Level 1 coins
];

// Enemy positions and patrol distances
const enemyData = [
    [{pos: vec2(7,1), distance: 3}, {pos: vec2(14,9), distance: 2}],  // Level 0
    [{pos: vec2(8,1), distance: 4}, {pos: vec2(16,12), distance: 2}],  // Level 1
];

// Health pack positions
const healthPackPositions = [
    [vec2(10,7)],  // Level 0
    [vec2(12,9)],  // Level 1
];

// Moving platform data
const movingPlatformData = [
    [{pos: vec2(6,6), distance: 3, vertical: false}],  // Level 0
    [{pos: vec2(8,8), distance: 4, vertical: true}],   // Level 1
]; 