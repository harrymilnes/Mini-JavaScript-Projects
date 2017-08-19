var ballCanvas;

window.onload = function()
{
    ballCanvas = new Canvas();
    ballCanvas.redraw(window.innerWidth, window.innerHeight);
    ballCanvas.animate();
};

function Canvas() 
{
    this.bouncyBallList = [];
    this.canvas = document.getElementById("bouncyBall");
    this.ctx = this.canvas.getContext("2d");
}

Canvas.prototype.density = function(){
    return Math.sqrt((this.canvas.height, this.canvas.width) * 3);
}

Canvas.prototype.redraw = function(width, height)
{
    this.bouncyBallList = [];
    this.canvas.width = width;
    this.canvas.height = height;
    spawnBalls();
}

Canvas.prototype.animate = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ballCanvas.bouncyBallList.forEach(function(ball) {
        ball.update();
    });
    requestAnimFrame(this.animate.bind(this));
}

bouncyBall.prototype.seekLines = function(){
    for (var i = 0; i < ballCanvas.bouncyBallList.length; i++)
    {
        var dx = ballCanvas.bouncyBallList[i].spawnX - this.spawnX;
        var dy = ballCanvas.bouncyBallList[i].spawnY - this.spawnY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (ballCanvas.bouncyBallList[i] != this && ballCanvas.bouncyBallList[i].linkedbouncyBalls != null && distance < ballCanvas.density() && !this.linkedbouncyBalls.includes(ballCanvas.bouncyBallList[i])) 
        {
            ballCanvas.drawLine(this.spawnX, this.spawnY, ballCanvas.bouncyBallList[i].spawnX, ballCanvas.bouncyBallList[i].spawnY, distance);
            this.linkedbouncyBalls.push(ballCanvas.bouncyBallList[i]);
        }
    }
}

Canvas.prototype.drawLine = function(startX, startY, endX, endY, distance) 
{
    distance = ((1.0 / distance) * 20).toFixed(2);
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = "rgba(215, 215, 215," + distance + ")";
    this.ctx.lineWidth = 0.25;
    this.ctx.stroke();
}

Canvas.prototype.drawBall = function(ball){
    this.ctx.beginPath();
    this.ctx.arc(ball.spawnX, ball.spawnY, ball.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgb(215, 215, 215)";
    this.ctx.fill();
    this.ctx.strokeStyle = "rgb(215, 215, 215)";
    this.ctx.stroke();
}

function bouncyBall(spawnX, spawnY) 
{
    if (spawnX && spawnY) {
        this.spawnX = spawnX;
        this.spawnY = spawnY;
        this.wasSpawnedByClick = true;
    } else {
        this.spawnX = generateDecimalBetween(0, ballCanvas.canvas.width);
        this.spawnY = generateDecimalBetween(0, ballCanvas.canvas.height);
    }

    this.speedX = generateDecimalBetween(-2.25, 2.25);
    this.speedY = generateDecimalBetween(-2.25, 2.25);
    this.size = generateDecimalBetween(0.75, 2);
    ballCanvas.bouncyBallList.push(this);
}

bouncyBall.prototype.doesBallIntersectCanvasBoundary = function(){
    return this.spawnX < 0 + this.size || this.spawnX > ballCanvas.canvas.width - this.size 
    || this.spawnY < 0 + this.size || this.spawnY > ballCanvas.canvas.height - this.size;
}

bouncyBall.prototype.update = function(){
    this.spawnX = this.spawnX - this.speedX;
    this.spawnY = this.spawnY - this.speedY;
    
    if (this.doesBallIntersectCanvasBoundary() && this.wasSpawnedByClick) {
        ballCanvas.bouncyBallList.splice(ballCanvas.bouncyBallList.indexOf(this), 1);
        return;
    }
    if (this.spawnX < 0 + this.size || this.spawnX > ballCanvas.canvas.width - this.size) {
        this.speedX = this.speedX * -1;
    } else if (this.spawnY < 0 + this.size || this.spawnY > ballCanvas.canvas.height - this.size) {
        this.speedY = this.speedY * -1;
    }

    this.linkedbouncyBalls = [];
    this.seekLines();
    ballCanvas.drawBall(this);
}

function spawnBalls()
{
    for (var i = 0; i < ballCanvas.density(); i++) {
        new bouncyBall();
    }
}

function generateDecimalBetween(minimum, maximum) {
    return (Math.random() * (minimum - maximum) + maximum).toFixed(2);
};

window.addEventListener('resize', function(event) {
    ballCanvas.redraw(window.innerWidth, window.innerHeight);
});

document.addEventListener('click', function(evt) {
    for (var i = 0; i < 5; i++) {
        new bouncyBall(evt.x, evt.y);
    }
}, false);

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