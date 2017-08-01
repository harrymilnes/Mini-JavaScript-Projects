$(function() 
{
    let playerModels = {
        NOUGHT: 0,
        CROSS: 1
    };

    let playerModel = playerModels.NOUGHT;

    $("#game-mat > .row > div").click(function() 
    {
        (playerModel === playerModels.NOUGHT) ? $(this).addClass("nought").text("O") : $(this).addClass("cross").text("X");
    });
});