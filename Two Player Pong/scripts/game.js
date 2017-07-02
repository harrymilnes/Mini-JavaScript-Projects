var gameCore;
var puck;
var leftPaddle;
var rightPaddle;
var gameKeysHeld = {};

var GameDirection = 
{
    UP: 1,
    DOWN : 2,
    LEFT: 3,
    RIGHT: 4
};

window.onload = function()
{
    GameInit();
};

function GameInit()
{
    gameCore = new GameCore();
    puck = new Puck();
    leftPaddle = new Paddle(false);
    rightPaddle = new Paddle(true);
    gameCore.update();
    gameCore.drawSplashScreen();
}

function GameCore() 
{
    this.splashScreenIsVisible = true;
    this.canvas = document.getElementById("pong-gameboard");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = 700;
    this.canvas.width = 1000;
    this.ctx.height = this.canvas.height;
    this.ctx.width = this.canvas.width;
}

GameCore.prototype.update = function()
{
    if(!this.splashScreenIsVisible)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBoard();
        puck.update();
        leftPaddle.update();
        rightPaddle.update();
        this.checkPaddles(puck, leftPaddle, rightPaddle);
    }

    requestAnimFrame(this.update.bind(gameCore));
    this.trackControls();
}

GameCore.prototype.trackControls = function()
{
    if (gameKeysHeld["w"]) {
        leftPaddle.move(GameDirection.UP);
    }

    if (gameKeysHeld["s"]) {
        leftPaddle.move(GameDirection.DOWN);
    }

    if(gameKeysHeld["ArrowUp"]) {
        rightPaddle.move(GameDirection.UP);
    }

    if (gameKeysHeld["ArrowDown"]) {
        rightPaddle.move(GameDirection.DOWN);
    }

    if(this.splashScreenIsVisible)
    {
        if (gameKeysHeld[" "]) {
            this.splashScreenIsVisible = false;
            puck.serve();
        }  
    }
}

GameCore.prototype.drawSplashScreen = function(paddle)
{
    this.splashScreenIsVisible = true;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#CCC';
    this.ctx.font = "45px Orbitron";

    if(paddle != null)
    {
        var victoryString = (!paddle.isRightPaddle) ? "Player one wins!" : "Player two wins!";
        this.ctx.fillText(victoryString, 300, 300); 
    }

    this.ctx.fillText("Please press Spacebar to start.", 120, 450);

    leftPaddle.score = 0;
    rightPaddle.score = 0;
}

GameCore.prototype.drawBoard = function()
{
    this.ctx.beginPath();
    this.ctx.setLineDash([25,20]);
    this.ctx.moveTo(this.ctx.width/2, 0);
    this.ctx.lineTo(this.ctx.width/2, this.ctx.height);
    this.ctx.strokeStyle = "#CCC";
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    this.ctx.fillStyle = '#CCC';
    this.ctx.font = "45px Orbitron";
    this.ctx.fillText(leftPaddle.score, (this.ctx.width/2)/2, 75);
    this.ctx.fillText(rightPaddle.score, (this.ctx.width/2)*1.5, 75);
}

GameCore.prototype.checkPaddles = function(puck, leftPaddle, rightPaddle)
{
    if ((puck.yPos > rightPaddle.yPos) && (puck.yPos < rightPaddle.yPos + rightPaddle.height)) 
    {
        if((puck.xPos + puck.size*2) > rightPaddle.xPos + rightPaddle.width)
        {
            var intersectionNormalization = (((rightPaddle.yPos + (rightPaddle.height/2)) - puck.yPos) / (rightPaddle.height/2));
            puck.xVel = (puck.ballSpeedConst * Math.cos(intersectionNormalization));
            puck.yVel = (puck.ballSpeedConst * Math.sin(intersectionNormalization));
        }
    }
    else if(puck.xPos > gameCore.ctx.width + puck.size*2)
    {
        puck.serve(GameDirection.LEFT);
        this.IncrementScore(leftPaddle);
    }

    if ((puck.yPos > leftPaddle.yPos) && (puck.yPos < leftPaddle.yPos + leftPaddle.height)) 
    {
        if(puck.xPos - puck.size < leftPaddle.xPos) 
        {
            var intersectionNormalization = (((leftPaddle.yPos + (leftPaddle.height/2)) - puck.yPos) / (leftPaddle.height/2)) *-1;
            puck.xVel = (puck.ballSpeedConst *- Math.cos(intersectionNormalization));
            puck.yVel = (puck.ballSpeedConst *- Math.sin(intersectionNormalization));
        }
    }
    else if(puck.xPos < 0 - puck.size*2)
    {
        puck.serve(GameDirection.RIGHT);
        this.IncrementScore(rightPaddle);
    }
}

GameCore.prototype.IncrementScore = function(paddle)
{
    paddle.score++;
    if(paddle.score == 10)
        this.drawSplashScreen(paddle);
}

window.addEventListener("keydown", function(event)
{
    gameKeysHeld[event.key] = true;
});

window.addEventListener("keyup", function(event)
{
    gameKeysHeld[event.key] = false;
});

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame || 

    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();