//Minimax algorithm based on that shared by Ahmad Abdolsaheb
// https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37


$(function() {
    var hum = "";
    var com = "";
    var board = [];
    var mode = "";
    var myTurn = true;
    var ended = false;
    $(".title, .intro1").fadeIn(1000);

    $(".intro1__options__com").click(function() {
        $(".intro1").fadeOut(1000);
        $(".intro2")
            .delay(1000)
            .fadeIn(1000);
    });

    $(".intro1__options__pl2").click(function() {
        setBoard("2P");
        $(".intro1, .title").fadeOut(1000);
        $(".board")
            .delay(1000)
            .fadeIn(1000);
    });

    $(".intro2__options__x").click(function() {
        setBoard("X");
        $(".intro2, .title").fadeOut(1000);
        $(".board")
            .delay(1000)
            .fadeIn(1000);
    });

    $(".intro2__options__o").click(function() {
        $(".title").fadeOut(1000);
        $(".intro2").fadeOut(1000, function() {
            setBoard("O");
        });
        $(".board")
            .delay(1000)
            .fadeIn(1000);
    });

    $(".board__square").click(function() {
        if (!ended) {
            if (mode === "2P") {
                if (myTurn) {
                    myTurn = false;
                    $(this).text(hum);
                    board[
                        $(this)
                        .attr("id")
                        .replace("pos-", "")
                    ] = hum;
                } else {
                    myTurn = true;
                    $(this).text(com);
                    board[
                        $(this)
                        .attr("id")
                        .replace("pos-", "")
                    ] = com;
                }
                isWinner();
            } else {
                if (myTurn) {
                    myTurn = false;
                    $(this).text(hum);
                    board[
                        $(this)
                        .attr("id")
                        .replace("pos-", "")
                    ] = hum;
                    isWinner();
                    setTimeout(function() {
                        playCom();
                    }, 1000);
                }
            }
        }
    });

    $(".bk-btn").click(function() {
        $(".board__result").fadeOut(1000);
        $(this)
            .parents(".main")
            .fadeOut(1000, function() {
                setBoard(mode);
            });
        $(".intro1, .title")
            .delay(1000)
            .fadeIn(1000);
    });

    $(".board__restart").click(function() {
        $(".board__result").fadeOut(1000);
        $(".board")
            .fadeOut(1000, function() {
                setBoard(mode);
            })
            .fadeIn(1000);
    });

    /////// MAKE COM MOVE //////////////////////
    function playCom() {
        if (!ended) {
            var index = getMove(hum, com, board).index;
            board[index] = com;
            $("#pos-" + index).text(com);
            myTurn = true;
            isWinner();
        }
    }

    ///////////// SEARCH FOR WINNER ////////////////
    function isWinner() {
        let text = "";
        let winHum = win(board, hum);
        let winCom = win(board, com);
        if (winHum[0]) {
            text = mode === "2P" ? "Player 1 Wins!" : "You Win!";
            $(".board__result")
                .fadeIn(1000)
                .text(text);
            $(
                "#pos-" +
                winHum[1][0] +
                ", #pos-" +
                winHum[1][1] +
                ", #pos-" +
                winHum[1][2]
            ).css("color", "red");
            ended = true;
        } else if (winCom[0]) {
            text = mode === "2P" ? "Player 2 Wins!" : "You Lose!";
            $(".board__result")
                .fadeIn(1000)
                .text(text);
            $(
                "#pos-" +
                winCom[1][0] +
                ", #pos-" +
                winCom[1][1] +
                ", #pos-" +
                winCom[1][2]
            ).css("color", "red");
            ended = true;
        } else if (emptyIndex(board).length === 0) {
            $(".board__result")
                .fadeIn(1000)
                .text("It's a Tie!");
            ended = true;
        }
        if (ended) $(".board__restart").fadeIn(1000);
    }

    ///////// SET BOARD //////////////////
    function setBoard(md) {
        mode = md;
        board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        ended = false;
        $(".board__square")
            .text(" ")
            .css("color", "black");
        if (mode === "O") {
            myTurn = false;
            hum = "O";
            com = "X";
            setTimeout(function() {
                playCom();
            }, 1000);
        } else {
            myTurn = true;
            hum = "X";
            com = "O";
        }
    }
});

////////// GET BEST MOVE /////////////////////////
function getMove(hum, com, board) {
    var minimax = function(cBoard, cTurn) {
        var empty = emptyIndex(cBoard);
        if (win(cBoard, hum)[0]) return { score: -1 };
        else if (win(cBoard, com)[0]) return { score: 1 };
        else if (empty.length === 0) return { score: 0 };
        var moves = [];

        for (let i = 0; i < empty.length; i++) {
            var move = {};
            move.index = cBoard[empty[i]];
            board[empty[i]] = cTurn;
            move.score =
                cTurn === com ? minimax(cBoard, hum).score : minimax(cBoard, com).score;
            board[empty[i]] = move.index;
            moves.push(move);
        }

        var bestMove = -1;
        if (cTurn === com) {
            var bestScore = -2;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 2;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };

    return minimax(board, com);
}

/////////GET EMPTY SPACES //////////////////////
function emptyIndex(board) {
    return board.filter(x => x !== "X" && x !== "O");
}

/////////////// CHECK WINNER //////////////////
function win(b, p) {
    var won = false;
    var cells = [];
    if (b[4] === p) {
        if (b[0] === p && b[8] === p) {
            won = true;
            cells = [0, 4, 8];
        } else if (b[2] === p && b[6] === p) {
            won = true;
            cells = [6, 4, 2];
        } else if (b[3] === p && b[5] === p) {
            won = true;
            cells = [3, 4, 5];
        } else if (b[1] === p && b[7] === p) {
            won = true;
            cells = [1, 4, 7];
        }
    } else if (b[0] === p) {
        if (b[1] === p && b[2] === p) {
            won = true;
            cells = [0, 1, 2];
        } else if (b[3] === p && b[6] === p) {
            won = true;
            cells = [0, 3, 6];
        }
    } else if (b[8] === p) {
        if (b[2] === p && b[5] === p) {
            won = true;
            cells = [2, 5, 8];
        } else if (b[6] === p && b[7] === p) {
            won = true;
            cells = [6, 7, 8];
        }
    }
    return [won, cells];
}