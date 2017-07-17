function Puck()
{
    this.ballSpeedConst = 5;
    this.size = 10;
    this.xVel = 0;
    this.yVel = 0;
    this.xPos = 0;
    this.yPos = 0;
}

Puck.prototype.draw = function() 
{
    gameCore.ctx.beginPath();
    gameCore.ctx.rect(this.xPos, this.yPos, this.size, this.size);
    gameCore.ctx.fillStyle = "#FFF";
    gameCore.ctx.fill();
}

Puck.prototype.checkBoundary = function()
{
   if (this.yPos < 0 || this.yPos > gameCore.ctx.height - this.size) {
        this.yVel = this.yVel * -1;
    }
}

Puck.prototype.serve = function(direction)
{
    this.xPos = gameCore.ctx.width/2 - this.size/2;
    this.ballSpeedConst = 5;
    if(direction == null)
        direction = (generateRandomBit()) ? GameDirection.LEFT : GameDirection.RIGHT;

    if(direction == GameDirection.RIGHT)
    {
        this.xVel = this.ballSpeedConst;
    }
    else if(direction == GameDirection.LEFT)
    {
        this.xVel = this.ballSpeedConst * -1;
    }

    if(generateRandomBit() == 0)
    {
        this.yPos = this.size;
        this.yVel = (generateRandomBit()) ? this.ballSpeedConst : this.ballSpeedConst * 1;
    }
    else
    {
        this.yPos = (gameCore.canvas.height - this.size);
        this.yVel = (generateRandomBit()) ? this.ballSpeedConst : this.ballSpeedConst * 1;
    }
}

Puck.prototype.update = function()
{
    this.xPos -= this.xVel;
    this.yPos -= this.yVel;
	this.checkBoundary();
    this.draw();
}

function generateRandomBit()
{
    return Math.round(Math.random() * (1 - 0));
}