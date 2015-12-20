/**
 * Created by klemens on 18/12/15.
 */


var cWidth = 1000, cHeight = 600;

var c = document.getElementById("c");
var ctx = c.getContext("2d");

// Levels section
var level = 1;

// Points section
var points = 0;

var drawHud = function(points, level) {
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Level "+level , 10, 30);
    ctx.textAlign = "right";
    ctx.fillText(points , 990, 30);
};

// Paddle section
var paddleWidth = 100;
var paddleHeight = 10;
var paddleX = cWidth / 2 - paddleWidth / 2;
var paddleY = cHeight - paddleHeight;

// Ball section
var ballX = cWidth / 2;
var ballY = cHeight - 10;
var ballDX = getRandomArbitrary(-5, 5);
var ballDY = getRandomArbitrary(-5, -4);
var ballRadius = 10;
var ballOut = false;

// Blocks section
var blockWidth = 80;
var blockHeight = 20;

var blocksArray = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
    [1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [1, 1, 2, 1, 1, 1, 1, 2, 1, 1]
];

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


var loop = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ball(ballX, ballY);
    if (ballX + ballDX > c.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    }

    if (ballY + ballRadius > c.height) {
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

    // test block collisions
    //if (ballObjectVerticalCollision(ballX, ballY, ballRadius, ballDY, ballDX, cWidth / 2, c.height / 2, 100, 100)) {
    //    ballDY = -ballDY;
    //}
    //if (ballObjectHorizontalCollision(ballX, ballY, ballRadius, ballDY, ballDX, cWidth / 2, c.height / 2, 100, 100)) {
    //    ballDX = -ballDX;
    //}

    paddle(paddleX, paddleY, paddleWidth, paddleHeight);
    drawBlocks(blocksArray);
    drawHud(points, level);


    if (ballOut) {
        clearInterval(intervalId);
        loosingScreen();
        console.log("You loose");
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
    else if (
        ((by - br) <= oy + oh - bdy / 2 // ayyy lmao
        && (by - br) >= oy + oh + bdy / 2)
        && bx >= ox && bx <= ox + ow
    ) {
        return true;
    } else {
        return false;
    }
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
    else if (
        ((bx - br) <= ox + ow - bdx / 2
        && (bx - br) >= ox + ow + bdx / 2)
        && by >= oy && by <= oy + oh
    ) {
        return true;
    } else {
        return false;
    }
};

var loosingScreen = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("You fucked up mate!", cWidth / 4 * 2, cHeight / 4 * 3);
    ctx.fillText("Pres R to restart!", cWidth / 4 * 2, cHeight / 4 * 3 + 24);
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

    if (type == 1) {
        var color = "#FF0000";
    } else if (type == 2) {
        var color = "#3CD0CF";
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

var restart = function () {
    ballOut = false;
    ballX = cWidth / 2;
    ballY = cHeight - 11;
    ballDX = getRandomArbitrary(-5, 5);
    ballDY = getRandomArbitrary(-5, -4);
    paddleX = cWidth / 2 - paddleWidth / 2;
    paddleY = cHeight - paddleHeight;

    clearInterval(intervalId);
    intervalId = setInterval(loop, 10);

};
drawBlocks(blocksArray);
var intervalId = setInterval(loop, 10);