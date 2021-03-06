const settings = {
    gameWidth: 600,
    gameHeight: 600,
    gridTileSideLength: 10,
    frameInterval: 20,
    snakeFramesToMove: 4,
    surveillanceLoopFrames: 400,
    visionCones: {
        soldierDegrees: 80,
        solderTilesDepth: 8,
        cameraDegrees: 20,
        cameraTilesDepth: 16,
        mineTilesDepth: 3,
    },
    colors: {
        background: '#ecf0f1',
        snake1: '#16a085',
        snake2: '#1abc9c',
        soldier: '#95a5a6',
        camera: '#95a5a6',
        mine: '#95a5a6',
        keyCard: '#f39c12',
        blueprint: '#3498db',
        doorFrame: "#7f8c8d",
        doorLocked: '#e74c3c',
        doorUnlocked: '#2ecc71',
        idle: 'rgba(127, 140, 141, 0.35)',
        alert: 'rgba(192, 57, 43, 0.35)',
        gameLostBackground: '#323232',
        gameLostText1: '#c0392b',
        gameLostText2: '#ecf0f1',
        gameWonBackground: '#bdc3c7',
        gameWonText1: '#27ae60',
        gameWonText2: '#2c3e50',
        introBackground: '#ecf0f1',
        introSnakeText: '#3498db',
        introColText: '#2c3e50',
        startScreenBackground: '#ecf0f1',
        startScreenText: '#990014',
    }
}

export { settings };