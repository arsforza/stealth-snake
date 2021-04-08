const gameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    soldiers: [],
    cameras: [],
    mines: [],
    grid: [],
    snake: undefined,
    keyCards: [],
    door: undefined,
    clearedLevels: 0,
    collectedKeyCards: 0,
    start: function() {
        this.canvas.width = settings.gameWidth;
        this.canvas.height = settings.gameHeight;
        this.context = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = settings.colors.background;
        document.body.appendChild(this.canvas);
        
        this.gridTileSideLength = settings.gridTileSideLength;
        this.collectedKeyCards = 0;
        
        gameArea.loadGrid();
        gameArea.loadLevel(levels[this.clearedLevels]);
        this.interval = setInterval(updateGameArea, settings.frameInterval);
    },
    loadGrid: function(){
        this.grid = [];
        for(let y = 0; y < this.canvas.height / this.gridTileSideLength; y++) {
            const row = []
            for(let x = 0; x < this.canvas.width / this.gridTileSideLength; x++) {
                const floorTile = new FloorTile(x, y, this.gridTileSideLength);
                row.push(floorTile);
            }
            this.grid.push(row);
        }
    },
    loadLevel: function(level) {
        gameArea.clear();

        gameArea.loadGrid();
        
        this.snake = undefined;
        this.addSnake(new Snake(level.snake.gridX, level.snake.gridY, level.snake.startingSize, level.snake.direction));
        
        this.soldiers = [];
        level.enemies.soldiers.forEach((soldier) => {
            this.addSoldier(new Soldier(soldier.orientation, soldier.gridX, soldier.gridY));
        });

        this.cameras = [];
        level.enemies.cameras.forEach((camera) => {
            gameArea.addCamera(new Camera(camera.orientation, camera.gridX, camera.gridY));
        });

        this.mines = [];
        level.enemies.mines.forEach((mine) => {
            gameArea.addMine(new Mine(mine.gridX, mine.gridY));
        });

        this.collectedKeyCards = 0;
        this.keyCards = [];
        level.keyCards.forEach((keyCard) => {
            this.addKeyCard(new KeyCard(keyCard.gridX, keyCard.gridY));
        });

        this.door = undefined;
        this.addDoor(new Door(level.door.gridX, level.door.gridY));
    },
    nextLevel: function() {
        this.clearedLevels++;
        this.loadLevel(levels[this.clearedLevels]);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    addSoldier: function(element) {
        this.soldiers.push(element);
    },
    addCamera: function(element) {
        this.cameras.push(element);
    },
    addMine: function(element) {
        this.mines.push(element);
    },
    addSnake: function(element) {
        this.snake = element;
    },
    addKeyCard: function(element) {
        this.keyCards.push(element);
    },
    addDoor: function(element) {
        this.door = element;
    }
};

gameArea.start();

function updateGameArea() {
    gameArea.clear();
    
    gameArea.snake.draw();
    if(gameArea.frames % settings.snakeFramesToMove === 0)
        gameArea.snake.moveForward();

    gameArea.soldiers.forEach((soldier) => {
        soldier.drawVisionCone();
        soldier.draw();
        soldier.surveillanceLoop();        
    });

    gameArea.cameras.forEach((camera) => {
        camera.drawVisionCone();
        camera.draw();
        camera.surveillanceLoop();        
    });

    gameArea.mines.forEach((mine) => {
        mine.drawVisionCone();
        mine.draw();
        mine.surveillanceLoop();        
    });

    gameArea.keyCards.forEach((keyCard) => {
        if(!keyCard.collected)
            keyCard.draw();        
    });

    gameArea.door.draw();

    gameArea.frames++;
}

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case "ArrowRight":
            gameArea.snake.turn('R');
            break;
        case "ArrowLeft":
            gameArea.snake.turn('L');
            break;
        case "ArrowDown":
            gameArea.snake.turn('D');
            break;
        case "ArrowUp":
            gameArea.snake.turn('U');
            break;
    }
});