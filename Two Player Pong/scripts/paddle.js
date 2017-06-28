function Paddle(right)
{
    this.isRightPaddle = right;
    this.width = 10;
    this.height = 100;
    this.score = 0;
    this.xPos = ((right) ? gameCore.ctx.width - this.width*2 : this.xPos = 0 + this.width);
    this.yPos = gameCore.ctx.height/2 - this.height/2;
}

Paddle.prototype.move = function(movementDirection)
{
    if(movementDirection == GameDirection.UP && this.yPos > 0 + (this.height * 0.3))
    {
        this.yPos -= 7;
    }

    if(movementDirection == GameDirection.DOWN && this.yPos < gameCore.ctx.height - (this.height / 0.7))
    {
        this.yPos += 7;
    }
}

Paddle.prototype.draw = function() 
{
    gameCore.ctx.beginPath();
    gameCore.ctx.rect(this.xPos, this.yPos, this.width, this.height);
    gameCore.ctx.fillStyle = "#FFF";
    gameCore.ctx.fill();
}

Paddle.prototype.update = function()
{
    this.draw();
}