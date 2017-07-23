var game;
window.onload = function() 
{
    game = new Game();
}

var CellStatus = {
    PASSEDLIFE: 0,
    DEAD: 1,
    ALIVE: 2,
}

function Game()
{
    let self = this;
    
    let canvasElement = document.getElementById("gameoflife");
    self.canvas = canvasElement;
    self.ctx = self.canvas.getContext("2d");
    self.canvas.width = window.innerWidth;
    self.canvas.height = window.innerHeight;
    self.CellSize = 4;
    self.GenerationCounter = 0;
    self.AliveCellCounter = 0;
    self.IsPaused = false;
    self.IsDrawing = false;
    self.ColumnCount = Math.floor(canvasElement.clientWidth / self.CellSize);
    self.RowCount = Math.floor(canvasElement.clientHeight  / self.CellSize);
    self.RandomCellCount = Math.floor(self.ColumnCount * self.RowCount / self.CellSize /2);
    self.world = [];
    self.setupWorld();

    self.canvas.addEventListener("mousedown", function( event ) {
        self.IsDrawing = true;
        game.drawCells(event);
    }, false);

    self.canvas.addEventListener("mousemove", function( event ) {
        if(self.IsDrawing) {
            game.drawCells(event);
        }
    }, false);

    self.canvas.addEventListener("mouseup", function( event ) {
        self.IsDrawing = false;
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
    self.resetGenerationCounter();
    self.resetAliveCellCounter();
}

Game.prototype.drawCells = function (event)
{
    let canvasBounding = this.canvas.getBoundingClientRect();
    let relativeXPos = Math.floor((event.clientX - canvasBounding.left) / this.CellSize) * this.CellSize;
    let relativeYPos = Math.floor((event.clientY - canvasBounding.top) / this.CellSize) * this.CellSize;

    if(relativeXPos > 0 && relativeXPos < this.canvas.width 
        && relativeYPos > 0 && relativeYPos < this.canvas.height)
    {
        let columnIndex = Math.floor(this.ColumnCount - ((this.canvas.width - relativeXPos) / this.CellSize));
        let rowIndex = Math.floor(this.RowCount - ((this.canvas.height - relativeYPos) / this.CellSize));
        this.world[columnIndex][rowIndex] = CellStatus.ALIVE;
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
            nextGeneration[c][r] = CellStatus.PASSEDLIFE;
        }
    }

    this.resetAliveCellCounter();
    for(let c = 0; c < self.ColumnCount; c++)
    {
        for(let r = 0; r < self.RowCount; r++)
        {
            let neighbours = checkNeigbours(c, r);

            if(neighbours < 2 || neighbours > 3)
            {
                if(self.world[c][r] == CellStatus.ALIVE)
                {
                    nextGeneration[c][r] = CellStatus.PASSEDLIFE;
                }
                else
                {
                    nextGeneration[c][r] = CellStatus.DEAD;
                }
            }
            else if(neighbours == 3 || (self.world[c][r] == CellStatus.ALIVE && neighbours == 2))
            {
                nextGeneration[c][r] = CellStatus.ALIVE;
                this.increaseAliveCellCounter();
            }

        }
    }

    this.increaseGenerationCounter();
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
    
    if(!this.IsPaused && !this.IsDrawing)
    {
        this.updateWorld();
    }

    for(let c = 0; c < self.ColumnCount; c++)
    {
        for(let r = 0; r < self.RowCount; r++)
        {
            if(self.world[c][r] == CellStatus.ALIVE)
            {
                self.ctx.fillStyle = "black";
                self.ctx.fillRect(c * self.CellSize, r *self.CellSize, self.CellSize, self.CellSize);
            }
            else if(self.world[c][r] == CellStatus.PASSEDLIFE)
            {
                self.ctx.fillStyle = "red";
                self.ctx.fillRect(c * self.CellSize, r *self.CellSize, self.CellSize, self.CellSize);
            }
        }
    }
    requestAnimFrame(this.update.bind(this));
}

Game.prototype.resetGenerationCounter = function(){
    this.AliveCellCounter = 0;
    document.getElementById("gol-alivecellcounter").innerText = this.AliveCellCounter;
}

Game.prototype.increaseGenerationCounter = function(){
    this.GenerationCounter++;
    document.getElementById("gol-generationcounter").innerText = this.GenerationCounter;
}

Game.prototype.resetAliveCellCounter = function(){
    this.AliveCellCounter = 0;
    document.getElementById("gol-alivecellcounter").innerText = this.AliveCellCounter;
}

Game.prototype.increaseAliveCellCounter = function(){
    this.AliveCellCounter++;
    document.getElementById("gol-alivecellcounter").innerText = this.AliveCellCounter;
}

Game.prototype.generateRandomWorld = function(){
    var self = this;
    self.setupWorld();
    for (let r = 0; r < this.RandomCellCount; r++) {
        var colIndex = Math.floor(Math.random() * this.ColumnCount);
        var rowIndex = Math.floor(Math.random() * this.RowCount);
        self.world[colIndex][rowIndex] = CellStatus.ALIVE;
    }
}

window.addEventListener("keydown", function(event)
{
    if(event.key == [" "])
        game.IsPaused = !game.IsPaused;

    if(event.key == ["Delete"])
        game.setupWorld();

    if(event.key == ["r"])
        game.generateRandomWorld();

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