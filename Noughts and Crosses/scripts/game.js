$(function() 
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
        [2, 5, 8],
        //Verticle
        [0, 3, 6],
        [1, 4, 7],
        [6, 7, 8],
        //Diaganol
        [0, 4, 8],
        [2, 4, 6]
    ]
    
    let gameBoard = [ "E", "E", "E",
                      "E", "E", "E",
                      "E", "E", "E" ];

    let currentTurnCount = 0;

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
        
        currentPlayer = !currentPlayer;
        currentTurnCount ++;
        GetWinner();
    });

    function GetWinner()
    {
        if(DoesPlayerWin("O"))
        {
            alert("Nought wins.");
        }
        else if(DoesPlayerWin("X"))
        {
            alert("Cross wins.");
        }
        else if (currentTurnCount == 9)
        {
            alert("It's a draw.");
        }
    }

    function IsADraw()
    {
        return (gameBoard.indexOf("E") === -1);
    }

    function DoesPlayerWin(playerChar)
    {
        let playerWins = false;
        for(let i = 0; i < winningCombinations.length; i++)
        {
            let foundValues = 0;

            for(let j = 0; j < 3; j++)
            {
                foundValues += (gameBoard[winningCombinations[i][j]] == playerChar)
            }

            if(foundValues == 3)
            {
                playerWins = true;
                break;
            }
        }

        return playerWins;
    }
});