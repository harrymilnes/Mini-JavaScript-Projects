$(function() 
{
    let playerModels = {
        NOUGHT: 0,
        CROSS: 1
    };

    let playerModel = playerModels.NOUGHT;

    let winningCombinations = [
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
    
    let currentBoardCombination = [];

    $("#game-mat > div").click(function() 
    {
        if($.inArray($(this).index(), currentBoardCombination) === -1)
        {
            (playerModel === playerModels.NOUGHT) ? $(this).addClass("nought").text("O") : $(this).addClass("cross").text("X");
            currentBoardCombination.push($(this).index());
        }
    });
});