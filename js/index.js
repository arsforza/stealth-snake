const gameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    player: undefined,
    soldiers: [],
    floorTiles: [],
    start: function() {
        this.canvas.width = 640;
        this.canvas.height = 640;
        this.context = this.canvas.getContext('2d');
        this.canvas.style.backgroundColor = '#f7f7f7';
        this.floorTileSide = 32;
        document.body.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    addPlayer: function(character) {
        this.player = character;
    },
    addSoldier: function(character) {
        this.soldiers.push(character);
    },
    drawFloor: function(){
        for(let y = 0; y < 40; y++) {
            const row = []
            for(let x = 0; x < 40; x++) {
                const floorTile = new FloorTile(x, y, this.floorTileSide);
                row.push(floorTile);
                floorTile.draw();
            }
            this.floorTiles.push(row);
        }
    }
};

class Character {
    constructor(x, y) {
        this.floorTile = gameArea.floorTiles[y][x];
        this.x = x;
        this.y = y;
        this.radius = (this.floorTile.side/2) - 5;
        this.color = '';
        // this.moveSpeed = gameArea.floorTileSide;
    }

    moveRight() {
        this.x++;
        this.floorTile = gameArea.floorTiles[this.y][this.x];
    }

    moveLeft() {
        this.x--;
        this.floorTile = gameArea.floorTiles[this.y][this.x];
    }

    moveUp() {
        this.y--;
        this.floorTile = gameArea.floorTiles[this.y][this.x];
    }

    moveDown() {
        this.y++;
        this.floorTile = gameArea.floorTiles[this.y][this.x];
    }
}

class Player extends Character {
    constructor(...args) {
        super(...args);
        this.color = '#0000bb';
    }

    draw() {
        gameArea.context.beginPath();
        gameArea.context.fillStyle = this.color;
        gameArea.context.arc(this.floorTile.tileCenter.x, this.floorTile.tileCenter.y, this.radius, 0, 2 * Math.PI);
        gameArea.context.fill();
        gameArea.context.closePath();
    }
}

class Soldier extends Character {
    constructor(startOrientation, ...args) {
        super(...args);
        this.color = '#bb0000';
        this.alertStatus = 0;
        this.visionCone = {
            degrees: 80,
            depth: 15,
            currentOrientation: this.calculateOrientation(startOrientation),
            turnSpeed: 1,
            leftBoundary: this.calculateOrientation(startOrientation) - 45,
            rightBoundary: this.calculateOrientation(startOrientation) + 45,
            leftEye: 0,
            rightEye: 0
        };
    }

    draw() {
        gameArea.context.beginPath();
        switch(this.alertStatus) {
            case 0:
                gameArea.context.fillStyle = 'rgba(0, 100, 255, 0.15)';
                break;
            case 1:
                gameArea.context.fillStyle = 'rgba(255, 170, 0, 0.15)';
                break;
            case 2:
                gameArea.context.fillStyle = 'rgba(255, 0, 0, 0.15)';
                break;
        }
        gameArea.context.moveTo(this.floorTile.tileCenter.x, this.floorTile.tileCenter.y);
        this.visionCone.leftEye = (this.visionCone.currentOrientation - (this.visionCone.degrees/2))  / 180 * Math.PI;
        this.visionCone.rightEye = (this.visionCone.currentOrientation + (this.visionCone.degrees/2)) / 180 * Math.PI;
        gameArea.context.arc(this.floorTile.tileCenter.x, this.floorTile.tileCenter.y, this.radius*this.visionCone.depth, this.visionCone.leftEye, this.visionCone.rightEye);
        gameArea.context.lineTo(this.floorTile.tileCenter.x, this.floorTile.tileCenter.y);
        gameArea.context.fill();
        gameArea.context.closePath();

        gameArea.context.beginPath();
        gameArea.context.fillStyle = this.color;
        gameArea.context.arc(this.floorTile.tileCenter.x, this.floorTile.tileCenter.y, this.radius, 0, 2 * Math.PI);
        gameArea.context.fill();
        gameArea.context.closePath();
    }

    calculateOrientation(orientation) {
        let degrees = orientation;
        if(orientation > 180)
            degrees = orientation-360;

        return degrees;
    }

    alert() {
        this.alertStatus = 2;
    }

    searching() {
        this.alertStatus = 1;
    }

    idle() {
        this.alertStatus = 0;
    }

    turnLeft() {
        this.visionCone.currentOrientation -= this.visionCone.turnSpeed;
    }

    turnRight() {
        this.visionCone.currentOrientation += this.visionCone.turnSpeed;
    }

    surveillanceLoop() {
        if(gameArea.frames % 400 < 200) {
            if(this.visionCone.currentOrientation >= this.visionCone.leftBoundary)
                this.turnLeft();
        } else {
            if(this.visionCone.currentOrientation <= this.visionCone.rightBoundary)
                this.turnRight();
        }

        this.surveillanceReport();
    }

    surveillanceReport() {
        const soldierX = this.floorTile.tileCenter.x;
        const soldierY = this.floorTile.tileCenter.y;

        const playerX = gameArea.player.floorTile.tileCenter.x;
        const playerY = gameArea.player.floorTile.tileCenter.y;

        const distX = soldierX - playerX;
        const distY = soldierY - playerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance <= ((this.radius*this.visionCone.depth) + gameArea.player.radius)) {
            const leftAngle = this.visionCone.leftEye;
            const rightAngle = this.visionCone.rightEye;            
            const playerAngleToSoldier = Math.atan2(playerY - soldierY, playerX - soldierX);
            
            if(Math.min(leftAngle, rightAngle) < playerAngleToSoldier && playerAngleToSoldier < Math.max(leftAngle, rightAngle, leftAngle, rightAngle)) {
                
                this.alert();
            } else {
                this.idle();
            }
                
        } else {
            this.idle();
        }
    }
}

class FloorTile {
    constructor(x, y, side) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.canvasX = this.x * this.side;
        this.canvasY = this.y * this.side;
        this.tileCenter = {x: this.canvasX+(this.side/2), y: this.canvasY+(this.side/2)};
    }

    draw() {
        gameArea.context.strokeStyle = "#000000";
        gameArea.context.lineWidth = 1;
        gameArea.context.strokeRect(this.canvasX, this.canvasY, this.side, this.side);
    }
}

gameArea.start();
gameArea.drawFloor();
gameArea.addPlayer(new Player(1, 1));
gameArea.addSoldier(new Soldier(0, 5, 7));
gameArea.addSoldier(new Soldier(270, 19, 2));
gameArea.addSoldier(new Soldier(75, 10, 10));

function updateGameArea() {
    gameArea.clear();
    gameArea.drawFloor();
    gameArea.player.draw();


    gameArea.soldiers.forEach((soldier) => {
        soldier.draw();
        soldier.surveillanceLoop();        
    });

    gameArea.frames++;
}



document.addEventListener('keydown', function(event){
    switch(event.key) {
        case "ArrowRight":
            gameArea.player.moveRight();
            break;
        case "ArrowLeft":
            gameArea.player.moveLeft();
            break;
        case "ArrowDown":
            gameArea.player.moveDown();
            break;
        case "ArrowUp":
            gameArea.player.moveUp();
            break;
    }
});
