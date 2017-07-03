var cellSize = 6;
var laCanvas;
var laAnt;
var world = [];

window.onload = function()
{
    laCanvas = new canvas();
    laAnt = new LangtonAnt();
    laCanvas.update();
};

function canvas()
{
    this.canvas = document.getElementById("langtonsant-board");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 800;
}

function LangtonAnt()
{
    this.col = laCanvas.canvas.width/2;
    this.row = laCanvas.canvas.height/2;
    this.movementIndex = 0;
    this.currentDirection = 0;
}

function Cell(col, row)
{
    this.col = col;
    this.row = row;
}

LangtonAnt.prototype.advance = function()
{
    var populatedCell = laAnt.isCurrentCellPopulated();
    if(populatedCell)
    {
        this.currentDirection = !this.currentDirection;
        this.move(this.movementIndex);
        world.splice(world.indexOf(populatedCell), 1);
    }
    else{
        world.push(new Cell(this.col, this.row));
        this.move(this.movementIndex);
    }
}

LangtonAnt.prototype.isCurrentCellPopulated = function()
{
    return (world.find(x =>  x.col == this.col && x.row == this.row));
}

LangtonAnt.prototype.move = function(movementIndex)
{
    this.movementIndex++;

    switch(movementIndex)
    {
        case 0:
            (!this.currentDirection) ? this.row-=cellSize : this.row+=cellSize;
        break;
        case 1:
            (!this.currentDirection) ? this.col+=cellSize : this.col-=cellSize;
        break;
        case 2:
            (!this.currentDirection) ? this.row+=cellSize : this.row-=cellSize;
        break;
        case 3:
            (!this.currentDirection) ? this.col-=cellSize : this.col+=cellSize;
            this.movementIndex = 0;
        break;
    }
}

canvas.prototype.update = function()
{
    var self = this;
    self.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    world.forEach(function(aliveCell) {
        self.ctx.beginPath();
        self.ctx.rect(aliveCell.col, aliveCell.row, cellSize, cellSize);
        self.ctx.fillStyle = "black";
        self.ctx.fill();
    });

    this.ctx.beginPath();
    this.ctx.rect(laAnt.col, laAnt.row, cellSize, cellSize);
    this.ctx.fillStyle = "green";
    this.ctx.fill();

    laAnt.advance();
    requestAnimFrame(this.update.bind(this));
}


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