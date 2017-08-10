$()
{
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
        if(currentPlayer == playerModels.NOUGHT)
        {
            $(this).addClass("nought").text("O");
            gameBoard[$(this).index()] = "O";
        }
        else
        {
            $(this).addClass("cross").text("X");
            gameBoard[$(this).index()] = "X";
        }
        
        GetWinner(gameBoard);
        AIMove();
    });

    function GetWinner(board)
    {
        if(DoesPlayerWin("O", board))
        {
            alert("Nought wins.");
        }
        else if(DoesPlayerWin("X", board))
        {
            alert("Cross wins.");
        }
        else if (IsGameDraw(board))
        {
            alert("It's a draw.");
        }
    }

    function AIMove()
    {
        let cell = Minimax(gameBoard, 0, "X");
        $('#game-mat > div:eq(' + cell + ')').addClass('cross').text("X");
        gameBoard[cell] = "X";
    }

    function Minimax(gameBoardCopy, depth, playerChar)
    {       
        if(DoesPlayerWin("O", gameBoardCopy))
        {
            return depth - 10;
        }
        else if(DoesPlayerWin("X", gameBoardCopy))
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

                duplicateBoard[i] = playerChar;
                let recursionVal = Minimax(duplicateBoard, depth+1, (playerChar == "O") ? "X" : "O");
                automatedValues.push( { risk: recursionVal, cell: i } );
            }

            let optimalMove;
            if(playerChar == "O")
            {
                optimalMove = _.minBy(automatedValues, (m) => {return m.risk});
            }
            else
            { 
                optimalMove = _.maxBy(automatedValues, (m) => {return m.risk});
            }

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

    function DoesPlayerWin(playerChar, board)
    {
        let playerWins = false;
        for(let i = 0; i < winningCombinations.length; i++)
        {
            let foundValues = 0;

            for(let j = 0; j < 3; j++)
            {
                foundValues += (board[winningCombinations[i][j]] == playerChar)
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