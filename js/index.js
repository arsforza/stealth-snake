const gameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    soldiers: [],
    grid: [],
    snake: undefined,
    keyCards: [],
    start: function() {
        this.canvas.width = 720;
        this.canvas.height = 720;
        this.context = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = '#f7f7f7';
        this.gridideLength = 24;
        document.body.appendChild(this.canvas);
        gameArea.drawGrid();
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    addSoldier: function(element) {
        this.soldiers.push(element);
        this.grid[element.gridY][element.gridX] = element;
    },
    addSnake: function(element) {
        this.snake = element;
    },
    addKeycard: function(element) {
        this.keyCards.push(element);
    },
    drawGrid: function(){
        this.grid = [];
        for(let y = 0; y < this.canvas.height / this.gridideLength; y++) {
            const row = []
            for(let x = 0; x < this.canvas.width / this.gridideLength; x++) {
                const floorTile = new FloorTile(x, y, this.gridideLength);
                row.push(floorTile);
                floorTile.draw();
            }
            this.grid.push(row);
        }
    }
};

gameArea.start();

gameArea.addSoldier(new Soldier(0, 5, 7));
gameArea.addSoldier(new Soldier(270, 19, 2));
gameArea.addSoldier(new Soldier(75, 10, 10));
gameArea.addSnake(new Snake(4, 7, 'D'));
gameArea.addKeycard(new KeyCard(4, 25));
gameArea.addKeycard(new KeyCard(10, 28));
gameArea.addKeycard(new KeyCard(16, 8));
gameArea.addKeycard(new KeyCard(21, 2));

function updateGameArea() {
    gameArea.clear();
    gameArea.drawGrid();
    gameArea.snake.draw();
    if(gameArea.frames % 6 === 0)
        gameArea.snake.moveForward();

    gameArea.soldiers.forEach((soldier) => {
        soldier.draw();
        soldier.drawVisionCone();
        soldier.surveillanceLoop();        
    });

    gameArea.keyCards.forEach((keyCard) => {
        if(keyCard.status === 'uncollected')
            keyCard.draw();
    });

    gameArea.frames++;
}



document.addEventListener('keydown', function(event){
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
