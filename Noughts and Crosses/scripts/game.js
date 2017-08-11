$()
{
    let scoreBoard = {
        PlayerWins: 0,
        Draws: 0,
        CPUWins: 0
    }

    let playerModels = 
    {
        NOUGHT: 0,
        CROSS: 1
    };

    let currentPlayer = playerModels.NOUGHT;

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
    
    let gameBoard = [ "E", "E", "E",
                      "E", "E", "E",
                      "E", "E", "E" ];

    $("#game-mat > div").click(function() 
    {
       MakeMove($(this).index());
    });

    function MakeMove(cell)
    {
        if(currentPlayer == playerModels.NOUGHT)
        {
            $("#game-mat > div:eq(" + cell + ")").addClass("nought").text("O");
            gameBoard[cell] = playerModels.NOUGHT;
            currentPlayer = !currentPlayer;
            if(!IsGameOver(gameBoard))
            {
                AIMove();
            }
        }
        else
        {
            $("#game-mat > div:eq(" + cell + ")").addClass("cross").text("X");
            gameBoard[cell] = playerModels.CROSS;
            currentPlayer = !currentPlayer;
        }
    }

    function IsGameOver(board)
    {
        if(DoesPlayerWin(playerModels.NOUGHT, board))
        {
            alert("You Win.");
            scoreBoard.PlayerWins++;
        }
        else if(DoesPlayerWin(playerModels.CROSS, board))
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
        return MakeMove(Minimax(gameBoard, 0, playerModels.CROSS));
    }

    function Minimax(gameBoardCopy, depth, player)
    {       
        if(DoesPlayerWin(playerModels.NOUGHT, gameBoardCopy))
        {
            return depth - 10;
        }
        else if(DoesPlayerWin(playerModels.CROSS, gameBoardCopy))
        {
            return 10 - depth;
        }
        else if(IsGameDraw(gameBoardCopy))
        {
            return 0;
        }
        else
        {
            let automatedValues = [];

            for(let i = 0; i < gameBoardCopy.length; i++)
            {
                let duplicateBoard = _.cloneDeep(gameBoardCopy);
            
                if(duplicateBoard[i] != "E")
                    continue;

                duplicateBoard[i] = player;
                let recursionVal = Minimax(duplicateBoard, depth+1, (player == playerModels.NOUGHT) ? playerModels.CROSS : playerModels.NOUGHT);
                automatedValues.push( { risk: recursionVal, cell: i } );
            }

            let optimalMove = (player == playerModels.NOUGHT) ? _.minBy(automatedValues, (m) => {return m.risk}) :  _.maxBy(automatedValues, (m) => {return m.risk});
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
        return board.indexOf("E") === -1;
    }
}