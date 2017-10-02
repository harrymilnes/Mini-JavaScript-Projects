let playerSymbols = {
    NOUGHT: 0,
    CROSS: 1
}

let boardMarkers =
{
    NOUGHT: 0,
    CROSS: 1,
    EMPTY: 2
}

let winningCombinations =
[
    //Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //Verticle
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //Diaganol
    [0, 4, 8],
    [2, 4, 6]
]

angular.module('root', [])
    .controller("game", ["$scope", function ($scope)
    {
        let difficultySetting = 1;

        $scope.selectionMenuIsOpen = true;
        $scope.playerSymbol = 0;
        $scope.currentTurn = undefined;
        $scope.impossibleModeToggled = false;

        $scope.playerScore = 0;
        $scope.totalTies = 0;
        $scope.cpuScore = 0;
        $scope.gameEndReason = "";
        $scope.showGameEndUI = false;

        $scope.selectPlayer = function(selectedPlayerSymbol)
        {
            $scope.playerSymbol = selectedPlayerSymbol;
            $scope.currentTurn = $scope.playerSymbol;
            $scope.selectionMenuIsOpen = false;
            difficultySetting = ($scope.impossibleModeToggled) ? 5 : 3;
        }

        $scope.gameBoard = [ { id: 0, value: boardMarkers.EMPTY }, { id: 1, value: boardMarkers.EMPTY }, { id: 2, value: boardMarkers.EMPTY },
                             { id: 3, value: boardMarkers.EMPTY }, { id: 4, value: boardMarkers.EMPTY }, { id: 5, value: boardMarkers.EMPTY },
                             { id: 6, value: boardMarkers.EMPTY }, { id: 7, value: boardMarkers.EMPTY }, { id: 8, value: boardMarkers.EMPTY } ];

        $scope.selectGameBoardCell = function()
        {
            MakeMove(this.cell.id);
        }

        function MakeMove(cell)
        {
            if(IsCellEmpty(cell, $scope.gameBoard))
            {
                $scope.gameBoard[cell].value = getCellClassFromPlayerSymbol($scope.currentTurn);
                $scope.currentTurn = !$scope.currentTurn;
                if(!IsGameOver($scope.gameBoard) && $scope.currentTurn != $scope.playerSymbol)
                {
                    AIMove();
                }
            }
        }

        function IsGameOver(board)
        {
            if(DoesPlayerWin($scope.playerSymbol, board))
            {
                $scope.gameEndReason = "You Win!";
                $scope.playerScore ++;
            }
            else if(DoesPlayerWin(!$scope.playerSymbol, board))
            {
                $scope.gameEndReason = "You Lose!";
                $scope.cpuScore++;
            }
            else if (IsGameDraw(board))
            {
                $scope.gameEndReason = "Draw!";
                $scope.totalTies++;
            }
            else
            {
                return false;
            }

            $scope.showGameEndUI = true;
            return true;
        }

        function getCellClassFromPlayerSymbol(playerSymbol)
        {
            return (playerSymbol == boardMarkers.NOUGHT) ? "nought" : "cross";
        }

        function AIMove()
        {
            return MakeMove(Minimax($scope.gameBoard, 0, $scope.currentTurn));
        }

        function Minimax(gameBoardCopy, depth, player)
        {
            if(DoesPlayerWin($scope.playerSymbol, gameBoardCopy))
            {
                return depth - 10;
            }
            else if(DoesPlayerWin(!$scope.playerSymbol, gameBoardCopy))
            {
                return 10 - depth;
            }
            else if(IsGameDraw(gameBoardCopy) || depth > difficultySetting)
            {
                return 0;
            }
            else
            {
                let automatedValues = [];
                for(let i = 0; i < gameBoardCopy.length; i++)
                {
                    let duplicateBoard = _.cloneDeep(gameBoardCopy);

                    if(!IsCellEmpty(i, duplicateBoard))
                        continue;

                    duplicateBoard[i].value = getCellClassFromPlayerSymbol(player);
                    let recursionVal = Minimax(duplicateBoard, depth+1, !player);
                    automatedValues.push( { risk: recursionVal, cell: i } );
                }
                
                let optimalMove = (player != $scope.playerSymbol) ?  _.maxBy(automatedValues, (m) => {return m.risk}) : _.minBy(automatedValues, (m) => {return m.risk});
                if(depth == 0)
                {
                    return optimalMove.cell;
                }
                else
                {
                    return optimalMove.risk;
                }
            }
        }

        function DoesPlayerWin(player, board)
        {
            let playerWins = false;
            for(let i = 0; i < winningCombinations.length; i++)
            {
                let foundValues = 0;

                for(let j = 0; j < 3; j++)
                {
                    foundValues += (board[winningCombinations[i][j]].value == getCellClassFromPlayerSymbol(player))
                }

                if(foundValues == 3)
                {
                    playerWins = true;
                    break;
                }
            }

            return playerWins;
        }

        function IsGameDraw(board)
        {
            return (board.filter(c => c.value == boardMarkers.EMPTY).length == 0);
        }

        function IsCellEmpty(cell, board)
        {
            return board[cell].value === boardMarkers.EMPTY;
        }

        $scope.resetGameBoard = function()
        {
            for(let c = 0; c < $scope.gameBoard.length; c++)
            {
                $scope.gameBoard[c].value = boardMarkers.EMPTY;
            }

            $scope.currentTurn = $scope.playerSymbol;
            $scope.showGameEndUI = false;
        }
    }]);