/**
 * Created by klemens on 18/12/15.
 */

var c = document.getElementById("c");
var ctx = c.getContext("2d");

// Levels section
var level = 1;
var inGame = 0;

// Points section
var points = 0;

var drawHud = function (points, level) {
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Level " + level, 10, 30);
    ctx.textAlign = "right";
    ctx.fillText(points, 990, 30);
};

// Paddle section
var paddleWidth = 100;
var paddleHeight = 10;
var paddleX = c.width / 2 - paddleWidth / 2;
var paddleY = c.height - paddleHeight;

// Ball section
var ballX = c.width / 2;
var ballY = c.height - 10;
var ballDX = getRandomArbitrary(-5, 5);
var ballDY = getRandomArbitrary(-5, -4);
var ballRadius = 7;
var ballOut = false;

// Blocks section
var blockWidth = 80;
var blockHeight = 20;

var blocksArrayLvl1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [1, 1, 2, 1, 1, 1, 1, 2, 1, 1]
];

var blocksArray = JSON.parse(JSON.stringify(blocksArrayLvl1));

var drawBlocks = function (blocksArray) {

    for (var y in blocksArray) {
        if (blocksArray.hasOwnProperty(y)) {
            var yPadding = 10;
            //console.log(blocksArray[y]);
            for (var x in blocksArray[y]) {
                if (blocksArray[y].hasOwnProperty(x)) {

                    var xPadding = 20;
                    if (x == 0) {
                        xPadding = 10;
                    }

                    var blockX = 10 + x * (blockWidth + xPadding);
                    var blockY = y * (10 + blockHeight) + yPadding + 40;
                    var type = blocksArray[y][x];

                    if (blocksArray[y][x] > 0) {


                        if (ballObjectVerticalCollision(ballX, ballY, ballRadius, ballDY, ballDX, blockX, blockY, blockWidth, blockHeight)) {
                            ballDY = -ballDY;
                            blocksArray[y][x]--;
                            points += 10;
                        }
                        if (ballObjectHorizontalCollision(ballX, ballY, ballRadius, ballDY, ballDX, blockX, blockY, blockWidth, blockHeight)) {
                            ballDX = -ballDX;
                            blocksArray[y][x]--;
                            points += 10;
                        }

                        block(blockX, blockY, blockWidth, blockHeight, type);
                    }


                }
            }
        }
    }
};

// Keys section
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


var gameLoop = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ball(ballX, ballY);
    if (ballX + ballDX > c.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    }

    if (ballY > c.height) {
        ballOut = true;
    }

    if (rightPressed && paddleX < c.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    ballY += ballDY;
    ballX += ballDX;

    // paddle collision
    if (ballObjectVerticalCollision(ballX, ballY, ballRadius, ballDY, ballDX, paddleX, paddleY, paddleWidth, paddleHeight)) {
        ballDY = -ballDY;
    }

    paddle(paddleX, paddleY, paddleWidth, paddleHeight);
    drawBlocks(blocksArray);
    drawHud(points, level);


    if (ballOut) {
        clearInterval(intervalId);
        loosingScreen();
    }
};

var ballObjectVerticalCollision = function (bx, by, br, bdy, bdx, ox, oy, ow, oh) {

    // ball from top collision
    if (
        ((by + br) <= oy + bdy / 2
        && (by + br) >= oy - bdy / 2)
        && bx >= ox && bx <= ox + ow
    ) {
        return true;
    }
    // ball from bottom collision
    else return !!(((by - br) <= oy + oh - bdy / 2 // ayyy lmao
    && (by - br) >= oy + oh + bdy / 2)
    && bx >= ox && bx <= ox + ow);
};

var ballObjectHorizontalCollision = function (bx, by, br, bdy, bdx, ox, oy, ow, oh) {

    // ball from left collision
    if (
        ((bx + br) <= ox + bdx / 2
        && (bx + br) >= ox - bdx / 2)
        && by >= oy && by <= oy + oh
    ) {
        return true;
    }
    // ball from right collision
    else return !!(((bx - br) <= ox + ow - bdx / 2
    && (bx - br) >= ox + ow + bdx / 2)
    && by >= oy && by <= oy + oh);
};

var loosingScreen = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "40px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText("NEXT TIME, GADGET!", c.width / 2, c.height / 2);
    ctx.fillText("PRESS R TO RESTART", c.width / 2, c.height / 2 + 100);
};

var ball = function (x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, 0);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
};


var paddle = function (x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
};

var block = function (x, y, width, height, type) {
    var color = "#FF0000";

    if (type == 1) {
        color = "#FF0000";
    } else if (type == 2) {
        color = "#3CD0CF";
    }

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 82 && ballOut) {
        restart();
    } else if (e.keyCode == 32 && !inGame) {
        startGame();
    }

    //console.log(e.keyCode);
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var startGame = function () {
    inGame = 1;
    ballX = c.width / 2;
    ballY = c.height - 10;
    ballDX = getRandomArbitrary(-5, 5);
    ballDY = getRandomArbitrary(-5, -4);
    clearInterval(intervalId);
    intervalId = setInterval(gameLoop, 10);
};

var restart = function () {
    points = 0;
    ballOut = false;
    ballX = c.width / 2;
    ballY = c.height - 11;
    ballDX = getRandomArbitrary(-5, 5);
    ballDY = getRandomArbitrary(-5, -4);
    paddleX = c.width / 2 - paddleWidth / 2;
    paddleY = c.height - paddleHeight;
    blocksArray = JSON.parse(JSON.stringify(blocksArrayLvl1));

    clearInterval(intervalId);
    intervalId = setInterval(gameLoop, 10);

};

var splashTitleX = c.width / 2;
var splashLoop = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("BEST ARKANOID GAME", splashTitleX + getRandomArbitrary(-5, 5), c.height / 2);
    ctx.fillText("(PLAY SPACE TO PRESS)", splashTitleX + getRandomArbitrary(-5, 5), c.height / 2 + 100);

    ball(ballX, ballY);
    if (ballX + ballDX > c.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY > c.height - ballRadius || ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    }

    ballY += ballDY;
    ballX += ballDX;
};

var intervalId = setInterval(splashLoop, 10);