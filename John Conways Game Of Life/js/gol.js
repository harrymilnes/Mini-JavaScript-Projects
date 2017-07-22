var game;
window.onload = function() 
{
    game = new Game();
}

var CellStatus = {
    DEAD: 0,
    ALIVE: 1
}

function Game()
{
    let self = this;
    
    let canvasElement = document.getElementById("gameoflife");
    self.canvas = canvasElement;
    self.ctx = self.canvas.getContext("2d");
    self.canvas.width = canvasElement.clientWidth;
    self.canvas.height = canvasElement.clientHeight;
    self.CellSize = 3;
    self.GenerationCounter = 0;
    self.AliveCellCounter = 0;
    self.IsPaused = false;
    self.MouseDown = false;
    self.ColumnCount = Math.floor(canvasElement.clientHeight / self.CellSize);
    self.RowCount = Math.floor(canvasElement.clientWidth  / self.CellSize);

    self.world = [];
    self.setupWorld();

    self.canvas.addEventListener("mousedown", function( event ) {
        self.MouseDown = true;
        game.drawCells(event);
    }, false);

    self.canvas.addEventListener("mousemove", function( event ) {
        if(self.MouseDown) {
            game.drawCells(event);
        }
    }, false);

    self.canvas.addEventListener("mouseup", function( event ) {
        self.MouseDown = false;
    }, false);
}

Game.prototype.setupWorld = function()
{
    let self = this;

    self.world = new Array(self.ColumnCount);
    for(let c = 0; c < self.ColumnCount; c++)
    {
        self.world[c] = new Array(self.ColumnCount);
        
        for(let r = 0; r < self.RowCount; r++)
        {
            self.world[c][r] = CellStatus.DEAD;
        }
    }

    self.IsPaused = true;
    self.update();
}

Game.prototype.drawCells = function (event)
{
    let canvasBounding = this.canvas.getBoundingClientRect();
    let relativeXPos = Math.floor((event.clientX - canvasBounding.left) / this.CellSize) * this.CellSize;
    let relativeYPos = Math.floor((event.clientY - canvasBounding.top) / this.CellSize) * this.CellSize;

    if(relativeXPos > 0 && relativeXPos < this.canvas.width 
        && relativeYPos > 0 && relativeYPos < this.canvas.height)
    {
        let columnIndex = Math.floor(this.RowCount - ((this.canvas.width - relativeXPos) / this.CellSize));
        let rowIndex = Math.floor(this.ColumnCount - ((this.canvas.height - relativeYPos) / this.CellSize));
        this.world[columnIndex][rowIndex] = 1;
    }
}

Game.prototype.updateWorld = function()
{
    var self = this;
    let nextGeneration = new Array(self.ColumnCount);
    for(let c = 0; c < self.ColumnCount; c++)
    {
        nextGeneration[c] = new Array(self.ColumnCount);
        for(let r = 0; r < self.RowCount; r++)
        {
            nextGeneration[c][r] = CellStatus.DEAD;
        }
    }

    for(let c = 0; c < self.ColumnCount; c++)
    {
        for(let r = 0; r < self.RowCount; r++)
        {
            let neighbours = checkNeigbours(c, r);

            if(neighbours < 2 || neighbours > 3)
            {
                nextGeneration[c][r] = CellStatus.DEAD;
            }
            else if(neighbours == 3 || (self.world[c][r] && neighbours == 2))
            {
                nextGeneration[c][r] = CellStatus.ALIVE;
            }
        }
    }

    return this.world = nextGeneration;
}

function checkNeigbours(col, row)
{
    let aliveNeighbours = 0;

    for(let c = col - 1; c < col + 2; c ++)
    {
        for(let r = row - 1; r < row + 2; r ++)
        {
            if(c == col && r == row)
                continue;

            if(game.world[c] === undefined || game.world[c][r] === undefined)
                continue;

            if(game.world[c][r] == CellStatus.ALIVE)
                aliveNeighbours++;
        }
    }

    return aliveNeighbours;
}

Game.prototype.update = function()
{
    let self = this;    
    
    if(!this.IsPaused)
    {
        this.updateWorld();
    }

    self.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for(let c = 0; c < self.ColumnCount; c++)
    {
        for(let r = 0; r < self.RowCount; r++)
        {
            if(self.world[c][r] == CellStatus.ALIVE)
            {
                self.ctx.fillStyle = "black";
                self.ctx.fillRect(c * self.CellSize, r *self.CellSize, self.CellSize, self.CellSize);
            }
        }
    }
    requestAnimFrame(this.update.bind(this));
}

Game.prototype.increaseGenerationCounter = function(){
    this.GenerationCounter++;
    //add element to webpage and increment.
}

Game.prototype.increaseAliveCellCounter = function(){
    this.AliveCellCounter++;
    //add element to webpage and increment.
}

Game.prototype.generateRandomWorld = function(){
    this.setupWorld();
    //do some random shit to draw cells.
}

window.addEventListener("keydown", function(event)
{
    if(event.key == [" "])
        game.IsPaused = !game.IsPaused;

    if(event.key == ["Delete"])
        game.setupWorld();

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