class SingleTileComponent {
    constructor(gridX, gridY) {
        this.floorTile = gameArea.grid[gridY][gridX];
        this.gridX = gridX;
        this.gridY = gridY;
        this.canvasX = this.floorTile.tileCenter.canvasX;
        this.canvasY = this.floorTile.tileCenter.canvasY;
        this.radius = (this.floorTile.sideLength/2) - 5;
        this.color = '';
        this.moveSpeed = gameArea.gridideLength;
    }

    draw() {
        gameArea.context.beginPath();
        gameArea.context.fillStyle = this.color;
        gameArea.context.arc(this.canvasX, this.canvasY, this.radius, 0, 2 * Math.PI);
        gameArea.context.fill();
        gameArea.context.closePath();
    }
}

class Soldier extends SingleTileComponent {
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

    drawVisionCone() {
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

        gameArea.context.moveTo(this.canvasX, this.canvasY);
        this.visionCone.leftEye = (this.visionCone.currentOrientation - (this.visionCone.degrees/2))  / 180 * Math.PI;
        this.visionCone.rightEye = (this.visionCone.currentOrientation + (this.visionCone.degrees/2)) / 180 * Math.PI;
        gameArea.context.arc(this.canvasX, this.floorTile.canvasY, this.radius*this.visionCone.depth, this.visionCone.leftEye, this.visionCone.rightEye);
        gameArea.context.lineTo(this.canvasX, this.canvasY);
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
        let alerts = 0;

        gameArea.snake.sections.forEach((section) => {
            if(this.insideRadius(section)) {
                if(this.insideCone(section)) {
                    alerts++;
                }
            }
        });

        alerts > 0 ? this.alert() : this.idle();
    }

    insideRadius(snakeSection) {
        const soldierX = this.canvasX;
        const soldierY = this.canvasY;

        const snakeX = snakeSection.canvasX;
        const snakeY = snakeSection.canvasY;

        const distX = soldierX - snakeX;
        const distY = soldierY - snakeY;

        const distance = Math.sqrt(distX * distX + distY * distY);

        return distance <= ((this.radius*this.visionCone.depth) + snakeSection.radius);
    }

    insideCone(snakeSection) {
        const leftAngle = this.visionCone.leftEye;
        const rightAngle = this.visionCone.rightEye;

        const soldierX = this.canvasX;
        const soldierY = this.canvasY;

        const snakeX = snakeSection.canvasX;
        const snakeY = snakeSection.canvasY;

        const playerAngleToSoldier = Math.atan2(snakeY - soldierY, snakeX - soldierX);
        
        return (Math.min(leftAngle, rightAngle) < playerAngleToSoldier && playerAngleToSoldier < Math.max(leftAngle, rightAngle))
    }
}

class SnakeSection extends SingleTileComponent {
    constructor(direction, ...args) {
        super(...args);
        this.direction = direction;
        this.color = '#00bb00';
    }
}

class Snake {
    constructor(gridX, gridY, startingDirection) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.floorTile = gameArea.grid[gridX][gridY];
        this.radius = (this.floorTile.side/2) - 5;
        this.sections = [];
        this.direction = startingDirection;
        this.init();
    }

    init() {
        const head = new SnakeSection(this.direction, this.gridX, this.gridY);
        
        this.sections.push(head);
        for(let i = 0; i < 3; i++) {
            this.addNewSection();
        }
    }

    addNewSection() {
        const lastSection = this.sections[this.sections.length - 1];
        
        let newSectionGridX = lastSection.gridX;;
        let newSectionGridY = lastSection.gridY;
        
        switch(lastSection.direction) {
            case 'D':
                newSectionGridY--;
                break;
            case 'U':
                newSectionGridY++;
                break;
            case 'L':
                newSectionGridX++;
                break;
            case 'R':
                newSectionGridX--;
                break;
        }

        const newSection = new SnakeSection(lastSection.direction, newSectionGridX, newSectionGridY);

        this.sections.push(newSection);
    }

    draw() {
        this.drawHead();
        this.drawTail();
    }

    drawHead() {
        this.sections[0].draw();
    }

    drawTail() {
        for(let i = 1; i < this.sections.length; i++) {
            this.sections[i].draw();
        }
    }

    moveForward() {
        const currentHead = this.sections[0];
        const currentHeadX = currentHead.gridX;
        const currentHeadY = currentHead.gridY;

        let newHeadX = currentHeadX;
        let newHeadY = currentHeadY;

        const lastSectionX = this.sections[this.sections.length -1].gridX;
        const lastSectionY = this.sections[this.sections.length -1].gridY;

        switch(this.direction) {
            case 'D':
                newHeadY++;
                break;
            case 'U':
                newHeadY--;
                break;
            case 'L':
                newHeadX--;
                break;
            case 'R':
                newHeadX++;
                break;
        }

        if(newHeadX < 0 || newHeadX > gameArea.grid[0].length-1 || newHeadY < 0 || newHeadY > gameArea.grid.length-1) {
            gameArea.stop();
            return;
        }
        
        this.sections.forEach((section) => {
            if(section.gridX === newHeadX && section.gridY === newHeadY) {
                gameArea.stop();
                return;
            }
        });

        gameArea.soldiers.forEach((soldier) => {
            if(soldier.gridX === newHeadX && soldier.gridY === newHeadY) {
                gameArea.stop();
                return;
            }
        });

        gameArea.keyCards.forEach((keyCard) => {
            if(newHeadX === keyCard.gridX && newHeadY === keyCard.gridY && keyCard.status === 'uncollected')
                keyCard.collect();
        });

        const newSection = new SnakeSection(this.direction, newHeadX, newHeadY);
        
        this.sections.unshift(newSection);
        this.sections.pop();
    }

    turn(turnDirection) {
        if((this.direction === 'D' && turnDirection === 'U') || (this.direction === 'U' && turnDirection === 'D') || 
           (this.direction === 'L' && turnDirection === 'R') || (this.direction === 'R' && turnDirection === 'L')) {
               return;
           }
        
        this.direction = turnDirection;
    }
}

class FloorTile {
    constructor(gridX, gridY, sideLength) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.sideLength = sideLength;
        this.canvasX = this.gridX * this.sideLength;
        this.canvasY = this.gridY * this.sideLength;
        this.tileCenter = {canvasX: this.canvasX+(this.sideLength/2), canvasY: this.canvasY+(this.sideLength/2)};
        this.element = undefined;
    }

    draw() {
        gameArea.context.strokeStyle = "#fefefe";
        gameArea.context.lineWidth = 1;
        gameArea.context.strokeRect(this.canvasX, this.canvasY, this.sideLength, this.sideLength);
    }
}

class KeyCard extends SingleTileComponent {
    constructor(...args) {
        super(...args);
        this.color = '#fdd835';
        this.status = 'uncollected';
    }

    collect() {
        this.status = 'collected';
        gameArea.snake.addNewSection();
        gameArea.collectedKeyCards++;
    }
}