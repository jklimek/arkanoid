/**
 * Created by klemens on 18/12/15.
 */


var cWidth = 1024, cHeight = 600;

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var ballX = cWidth / 2;
var ballY = cHeight - 10;
var paddleWidth = 100;
var paddleHeight = 10;
var paddleWidth2 = 10;
var paddleHeight2 = 100;
var paddleX = cWidth / 2 - paddleWidth / 2;
var paddleY = cHeight - paddleHeight;
var paddleX2 = cWidth / 2 - paddleWidth / 2;
var paddleY2 = cHeight - paddleHeight - 200;

var ballDX = getRandomArbitrary(-5, 5);
var ballDY = getRandomArbitrary(-5, -4);
var ballRadius = 10;

var ballOut = false;

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
        paddleX += 7; paddleX2 += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7; paddleX2 -= 7;
    }

    ballY += ballDY;
    ballX += ballDX;


    if (ballObjectCollision(ballX, ballY, ballRadius, ballDY, ballDX, paddleX, paddleY, paddleHeight, paddleWidth)) {
        ballDY = -ballDY;
    }
    if (ballObjectCollision(ballX, ballY, ballRadius, ballDY, ballDX, paddleX2, paddleY2, paddleHeight2, paddleWidth2)) {
        ballDY = -ballDY;
    }

    paddle(paddleX, paddleY, paddleWidth, paddleHeight);
    paddle(paddleX2, paddleY2, paddleWidth2, paddleHeight2);

    if (ballOut) {
        clearInterval(intervalId);
        loosingScreen();
        console.log("You loose");
    }
};

var ballObjectCollision = function(bx, by, br, bdy, bdx, ox, oy, oh, ow) {

    // ball from top collision
    if (
        ((by + br) <= oy+bdy/2
        && (by + br) >= oy-bdy/2)
        && bx >= ox && bx <= ox + ow
    ) {
        return true;
    }
    // ball from bottom collision
    else if (
        ((by - br) <= oy+oh-bdy/2 // ayyy lmao
        && (by - br) >= oy+oh+bdy/2)
        && bx >= ox && bx <= ox + ow
    ) {
        return true;
    } else {
        return false;
    }
};

var loosingScreen = function () {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "20px Arial";
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
    paddleX2 = cWidth / 2 - paddleWidth / 2;
    paddleY2 = cHeight - paddleHeight - 200;

    clearInterval(intervalId);
    intervalId = setInterval(loop, 10);

};

var intervalId = setInterval(loop, 10);