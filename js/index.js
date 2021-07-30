import { Soldier, Camera, Mine, Snake, FloorTile, KeyCard, Door } from './classes.js';
import { settings } from './settings.js';
import { levels } from './levels.js';
import { introConversation } from './intro.js';

const container = document.querySelector('#container');
const startBtn = document.querySelector('#start-game');

const gameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    interval: undefined,
    soldiers: [],
    cameras: [],
    mines: [],
    grid: [],
    snake: undefined,
    keyCards: [],
    door: undefined,
    clearedLevels: 0,
    collectedKeyCards: 0,
    gameRunning: false,
    introOver: false,
    introLineIndex: 0,
    introTextY: 5,
    allowInput: false,
    initCanvas: function() {
        this.canvas.width = settings.gameWidth;
        this.canvas.height = settings.gameHeight;
        this.context = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = settings.colors.background;
        container.appendChild(this.canvas);
    },
    start: function() {
        this.introOver = true;
        this.gameRunning = true;
        this.allowInput = true;
        this.duringIntro = false;
        this.frames = 0;
        
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
        this.clear();

        this.loadGrid();
        
        this.resetComponents();

        this.addSnake(new Snake(level.snake.gridX, level.snake.gridY, level.snake.startingSize, level.snake.direction));
        
        level.enemies.soldiers.forEach((soldier) => {
            this.addSoldier(new Soldier(soldier.orientation, soldier.gridX, soldier.gridY));
        });

        level.enemies.cameras.forEach((camera) => {
            gameArea.addCamera(new Camera(camera.orientation, camera.gridX, camera.gridY));
        });

        level.enemies.mines.forEach((mine) => {
            gameArea.addMine(new Mine(mine.gridX, mine.gridY));
        });

        level.keyCards.forEach((keyCard) => {
            this.addKeyCard(new KeyCard(keyCard.blueprint, keyCard.gridX, keyCard.gridY));
        });

        this.addDoor(new Door(level.door.gridX, level.door.gridY));
    },
    nextLevel: function() {
        this.clearedLevels++;
        if(this.clearedLevels < levels.length)
            this.loadLevel(levels[this.clearedLevels]);
        else
            this.endGame(2);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    },
    resetComponents() {
        this.snake = undefined;
        this.soldiers = [];
        this.cameras = [];
        this.mines = [];
        this.collectedKeyCards = 0;
        this.keyCards = [];
        this.door = undefined;
    },
    endGame: function(endType) {
        this.stop();
        this.gameRunning = false;
        this.allowInput = false;
        setTimeout(() => {
            this.resetComponents();
            this.clear();

            let message1 = "YOU WERE DETECTED";
            let message2 = "press ENTER to start from level 1";

            switch(endType) {
                case 0:
                    message1 = "YOU WERE DETECTED!";
                    message2 = "press ENTER to start from level 1";
                    this.clearedLevels = 0;
                    this.gameOverScreen(message1, message2);
                    break;
                case 1:
                    message1 = "YOU BUMPED INTO SOMETHING!";
                    message2 = "press ENTER to try this level again";
                    this.gameOverScreen(message1, message2);
                    break;
                case 2:
                    message1 = "YOU WON!";
                    message2 = "press ENTER to play again";
                    this.clearedLevels = 0;
                    this.gameWonScreen(message1, message2);
                    break;
            }
            
            this.allowInput = true;
        }, 1500);
    },
    gameOverScreen: function(message1, message2) {
        this.context.fillStyle = settings.colors.gameLostBackground;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.textAlign = 'center';
        const textX = this.canvas.width/2;
        const textY = this.canvas.height/2;
        this.context.fillStyle = settings.colors.gameLostText1;
        this.context.font = '36px Courier New';
        this.context.fillText(message1, textX, textY);
        this.context.fillStyle = settings.colors.gameLostText2;
        this.context.font = '16px Courier New';
        this.context.fillText(message2, textX, textY+40);
    },
    gameWonScreen: function(message1, message2) {
        this.context.fillStyle = settings.colors.gameWonBackground;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.textAlign = 'center';
        const textX = this.canvas.width/2;
        const textY = this.canvas.height/2;
        this.context.fillStyle = settings.colors.gameWonText1;
        this.context.font = '36px Courier New';
        this.context.fillText(message1, textX, textY);
        this.context.fillStyle = settings.colors.gameWonText2;
        this.context.font = '16px Courier New';
        this.context.fillText(message2, textX, textY+40);
    },
    introSequence: function() {
        this.stop();
        this.introOver = false;
        this.allowInput = true;
        this.gameRunning = false;

        this.context.fillStyle = settings.colors.introBackground;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.textBaseline = 'top';
        
        this.context.font = '16px Courier New';

        this.context.textAlign = 'center';
        this.context.fillStyle = settings.colors.introColText;
        this.context.fillText('press ENTER for next line', this.canvas.height / 2,  this.canvas.height-18);
        this.introTextY = 5;
        this.newIntroLine();
    },
    newIntroLine: function() {
        if(this.introLineIndex === introConversation.length) {
            this.start();
            return;
        }

        const line = introConversation[this.introLineIndex];
        let textX = 0;

        if(line.speaker === 'snake') {
            this.context.fillStyle = settings.colors.introSnakeText;
            textX = this.canvas.width - 5;
            this.context.textAlign = 'right';
        } else {
            this.context.fillStyle = settings.colors.introColText;
            textX = 5;
            this.context.textAlign = 'left';
        }
        
        this.context.fillText(line.text1, textX, this.introTextY);
        if(line.text2 !== '') {
            this.introTextY += 16;
            this.context.fillText(line.text2, textX, this.introTextY);
        }
        this.introTextY += 36;

        if(this.introTextY > this.canvas.height - 37) {
            this.introTextY = 5;
            this.introSequence();
        } else {
            this.introLineIndex++;
        }
    },
    loadStartScreen: function() {
        this.stop();
        this.clear();
        this.context.fillStyle = settings.colors.startScreenBackground;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const textX = this.canvas.width/2;
        const textY = this.canvas.height/2;
        this.context.fillStyle = settings.colors.startScreenText;
        this.context.textAlign = 'center';
        this.context.font = '56px sans';
        this.context.fillText('SFONAMI', textX, textY);
    }
};


gameArea.initCanvas();

function updateGameArea() {
    gameArea.clear();
    
    gameArea.snake.draw();
    if(gameArea.frames % settings.snakeFramesToMove === 0)
        gameArea.snake.moveForward();

    gameArea.soldiers.forEach((soldier) => {
        soldier.draw();
        soldier.surveillanceLoop();        
    });

    gameArea.cameras.forEach((camera) => {
        camera.draw();
        camera.surveillanceLoop();        
    });

    gameArea.mines.forEach((mine) => {
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
    if(gameArea.allowInput) {
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
            case "l":
                gameArea.nextLevel();
                break;
            case 'Enter':
                event.preventDefault();
                event.stopPropagation();
                if(gameArea.introOver) {
                    if(!gameArea.gameRunning) {
                        gameArea.start();
                    }
                } else {
                    gameArea.newIntroLine();
                }
                break;
        }
    }
});


startBtn.addEventListener('mousedown', function() {
    gameArea.introOver = false,
    gameArea.gameRunning = false,
    gameArea.introLineIndex = 0,
    gameArea.stop();
    gameArea.clear();
    gameArea.loadStartScreen();
    setTimeout(() => {
        gameArea.introSequence();
    }, 4000);
});

export { gameArea };