levels = [
    {
        levelIndex: 1,
        levelName: "Cargo Bay",
        snake: {gridX: 6, gridY: 1, direction: 'R', startingSize: 6},
        door: {gridX: 59, gridY: 59},
        enemies: {
            soldiers: [
                {gridX: 8, gridY: 10, orientation: 0},
                {gridX: 50, gridY: 32, orientation: 90},
                {gridX: 50, gridY: 50, orientation: 270},
            ],
            cameras: [
            ],
            mines: [
            ]
        },
        keyCards: [
            {gridX: 15, gridY: 10},
            {gridX: 50, gridY: 41},
        ],
    },
    {
        levelIndex: 2,
        levelName: "Weapons Storage",
        snake: {gridX: 58, gridY: 8, direction: 'D', startingSize: 8},
        door: {gridX: 0, gridY: 59},
        enemies: {
            soldiers: [
                {gridX: 19, gridY: 11, orientation: 115},
                {gridX: 8, gridY: 35, orientation: 90}, 
                {gridX: 19, gridY: 51, orientation: 270},
            ],
            cameras: [
                {gridX: 4, gridY: 4, orientation: 65},
                {gridX: 45, gridY: 6, orientation: 90},
                {gridX: 59, gridY: 59, orientation: 225},
                {gridX: 45, gridY: 33, orientation: 90},
            ],
            mines: [
            ]
        },
        keyCards: [
            {gridX: 15, gridY: 15},
            {gridX: 45, gridY: 20},
            {gridX: 49, gridY: 49},
        ],
    },
    {
        levelIndex: 3,
        levelName: "Mine Field",
        snake: {gridX: 48, gridY: 58, direction: 'L', startingSize: 11},
        door: {gridX: 0, gridY: 29},
        enemies: {
            soldiers: [
            ],
            cameras: [
            ],
            mines: [
                {gridX: 0, gridY: 16},
                {gridX: 3, gridY: 36},
                {gridX: 4, gridY: 4},
                {gridX: 5, gridY: 49},
                {gridX: 6, gridY: 43},
                {gridX: 7, gridY: 20},
                {gridX: 14, gridY: 33},
                {gridX: 9, gridY: 28},
                {gridX: 10, gridY: 10},
                {gridX: 14, gridY: 39},
                {gridX: 14, gridY: 50},
                {gridX: 17, gridY: 20},
                {gridX: 20, gridY: 5},
                {gridX: 20, gridY: 47},
                {gridX: 50, gridY: 18},
                {gridX: 28, gridY: 3},
                {gridX: 23, gridY: 24},
                {gridX: 29, gridY: 11},
                {gridX: 25, gridY: 35},
                {gridX: 25, gridY: 55},
                {gridX: 28, gridY: 28},
                {gridX: 31, gridY: 46},
                {gridX: 32, gridY: 40},
                {gridX: 32, gridY: 56},
                {gridX: 34, gridY: 24},
                {gridX: 40, gridY: 40},
                {gridX: 37, gridY: 5},
                {gridX: 38, gridY: 31},
                {gridX: 39, gridY: 56},
                {gridX: 40, gridY: 48},
                {gridX: 44, gridY: 3},
                {gridX: 44, gridY: 34},
                {gridX: 45, gridY: 14},
                {gridX: 47, gridY: 44},
                {gridX: 48, gridY: 8},
                {gridX: 50, gridY: 32},
                {gridX: 50, gridY: 54},
                {gridX: 54, gridY: 7},
                {gridX: 56, gridY: 54},
            ]
        },
        keyCards: [
            {gridX: 15, gridY: 7},
            {gridX: 51, gridY: 0},
            {gridX: 20, gridY: 35},
            {gridX: 15, gridY: 45},
        ]
    },
    {
        levelIndex: 4,
        levelName: "Vault",
        snake: {gridX: 44, gridY: 29, direction: 'L', startingSize: 15},
        door: {gridX: 48, gridY: 0},
        enemies: {
            soldiers: [
                {gridX: 59, gridY: 49, orientation: 180}, //ok
                {gridX: 24, gridY: 24, orientation: 45},
                {gridX: 15, gridY: 37, orientation: 80},
            ],
            cameras: [
                {gridX: 54, gridY: 0, orientation: 90}, //ok
                {gridX: 36, gridY: 59, orientation: 300},//ok
                {gridX: 14, gridY: 25, orientation: 75},
            ],
            mines: [
                {gridX: 3, gridY: 45, orientation: 0},
                {gridX: 20, gridY: 51, orientation: 75},
                {gridX: 5, gridY: 10, orientation: 75},
                {gridX: 10, gridY: 5, orientation: 75},
                {gridX: 45, gridY: 17, orientation: 75},
                {gridX: 30, gridY: 8, orientation: 75},
                {gridX: 7, gridY: 28, orientation: 75},
                {gridX: 47, gridY: 33, orientation: 75},
            ]
        },
        keyCards: [
            {gridX: 5, gridY: 5},
            {gridX: 54, gridY: 10},
            {gridX: 49, gridY: 49},
            {gridX: 15, gridY: 44},
            {gridX: 30, gridY: 30},
        ]
    },
]
