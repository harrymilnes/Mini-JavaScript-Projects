$()
{
    let scoreBoard = {
        PlayerWins: 0,
        Draws: 0,
        CPUWins: 0
    }

    let boardMarkers = 
    {
        NOUGHT: 0,
        CROSS: 1,
        EMPTY: 2
    };

    let difficultyLevels = {
        BEATABLE: 3,
        IMPOSSIBLE: Infinity
    }
    let difficulty = difficultyLevels.BEATABLE;

    let humanPlayer = boardMarkers.NOUGHT;
    let currentTurn = humanPlayer;

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
    
    let gameBoard = [ boardMarkers.EMPTY, boardMarkers.EMPTY, boardMarkers.EMPTY,
                      boardMarkers.EMPTY, boardMarkers.EMPTY, boardMarkers.EMPTY,
                      boardMarkers.EMPTY, boardMarkers.EMPTY, boardMarkers.EMPTY ];

    $("#game-mat > div").on('click touch', function() 
    {
       MakeMove($(this).index());
    });

    function MakeMove(cell)
    {
        if(IsCellEmpty(cell, gameBoard))
        {
            let moveMarkerClass = (currentTurn == boardMarkers.NOUGHT) ? "nought" : "cross"; 
            $("#game-mat > div:eq(" + cell + ")").append("<div class=" + moveMarkerClass  + "></div");
            gameBoard[cell] = currentTurn;
            currentTurn = !currentTurn;
            if(!IsGameOver(gameBoard) && currentTurn != humanPlayer)
            {
                AIMove();
            }
        }
    }

    function IsGameOver(board)
    {
        if(DoesPlayerWin(humanPlayer, board))
        {
            alert("You Win.");
            scoreBoard.PlayerWins++;
        }
        else if(DoesPlayerWin(!humanPlayer, board))
        {
            alert("You Lose.");
            scoreBoard.CPUWins++;
        }
        else if (IsGameDraw(board))
        {
            alert("It's a draw.");
            scoreBoard.Draws++;
        }
        else
        {
            return false;
        }

        UpdateScoreUI();
        return true;
    }

    function UpdateScoreUI()
    {
        $('#player-wins').text(scoreBoard.PlayerWins);
        $('#draws').text(scoreBoard.Draws);
        $('#cpu-wins').text(scoreBoard.CPUWins);
    }

    function AIMove()
    {
        return MakeMove(Minimax(gameBoard, 0, currentTurn));
    }

    function Minimax(gameBoardCopy, depth, player)
    {       
        if(DoesPlayerWin(humanPlayer, gameBoardCopy))
        {
            return depth - 10;
        }
        else if(DoesPlayerWin(!humanPlayer, gameBoardCopy))
        {
            return 10 - depth;
        }
        else if(IsGameDraw(gameBoardCopy))
        {
            return 0;
        }
        else if(depth > difficulty)
        {
            return depth - difficulty;
        }
        else
        {
            let automatedValues = [];

            for(let i = 0; i < gameBoardCopy.length; i++)
            {
                let duplicateBoard = _.cloneDeep(gameBoardCopy);
            
                if(!IsCellEmpty(i, duplicateBoard))
                    continue;

                duplicateBoard[i] = player;
                let recursionVal = Minimax(duplicateBoard, depth+1, !player);
                automatedValues.push( { risk: recursionVal, cell: i } );
            }

            let optimalMove = (player != humanPlayer) ?  _.maxBy(automatedValues, (m) => {return m.risk}) : _.minBy(automatedValues, (m) => {return m.risk});
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
                foundValues += (board[winningCombinations[i][j]] == player)
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
        return board.indexOf(boardMarkers.EMPTY) === -1;
    }

    function IsCellEmpty(cell, board)
    {
        return board[cell] === boardMarkers.EMPTY;
    }

    function ResetGameBoard()
    {
        for(let c = 0; c < gameBoard.length; c++)
        {
            gameBoard[c] = boardMarkers.EMPTY;
        }
    }
}