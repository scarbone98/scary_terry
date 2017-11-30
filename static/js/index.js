/**
 * Created by scarbone on 11/11/17.
 */
let myGamePiece;
let myObstacles = [];
let powerUps = [];
let interval = 200;
let globalInterval;
let isJumping = false;
let intervalCleared = false;
let screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

let screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
let sprite_idle;
let sprite_jump;
let background;
let backgroundX;
let coin;
let powerUpsIndex = 0;
let bonusScore = 0;
let updateSpeed = 15;
let mouseX;
let mouseY;
// let baseDifficulty = 2500;
function resizeCanvas() {
    let canvas = document.getElementById("mycanvas");
    if (canvas.width  < window.innerWidth)
    {
        canvas.width  = window.innerWidth;
    }

    if (canvas.height < window.innerHeight)
    {
        canvas.height = window.innerHeight / 1.10;
    }
}
function startGame() {
    backgroundX = 0;
    myGamePiece = new component(47, 56, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myGameArea.start();

}
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        sprite_idle = new Image();
        sprite_idle.src = "../assets/sprites/oldmanterry2.png";
        sprite_jump = new Image();
        sprite_jump.src = "../assets/sprites/oldmanterry1.png";
        background = new Image();
        background.src = "../assets/sprites/background.png";
        coin = new Image();
        coin.src = "../assets/sprites/spinning-coin.png";
        this.canvas.setAttribute("id","mycanvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = screenHeight / 1.10;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, updateSpeed);
        globalInterval = this.interval;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (backgroundX > 1920) {
            backgroundX = 0;
        }
        for (let i = 0; i < myGameArea.canvas.width + 1920; i += 1920) {
            this.context.drawImage(background, i - backgroundX, 0, 1920, myGameArea.canvas.clientHeight);
        }
        backgroundX++;
    }
};
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.ticks = 0;
    this.coinX = 0;
    this.update = function (image) {
        ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            if (image === "idle") {
                ctx.drawImage(sprite_idle, this.x, this.y, 32, 32);
            }
            else if (image === "jump") {
                ctx.drawImage(sprite_jump, this.x, this.y, 32, 32);
            }
            else if (image === "coin") {
                if (this.coinX > 5) {
                    this.coinX = 0;
                }
                ctx.drawImage(coin, (116.667 * this.coinX), 0, 116.667, 200, this.x, this.y, 30, 45);
                if (this.ticks > 15) {
                    this.coinX++;
                    this.ticks = 0;
                }
                this.ticks++;
            }
            else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    };
    this.newPos = function () {
        this.x = mouseX;
        this.y = mouseY;
        this.hitBottom();
        this.hitTop();
    };
    this.hitTop = function () {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    };
    this.hitBottom = function () {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function (otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    // if(myGameArea.frameNo > baseDifficulty){
    //     speedInterval -= 2;
    //     clearInterval(myGameArea.interval);
    //     myGameArea.interval = setInterval(updateGameArea,speedInterval);
    //     baseDifficulty += 2500;
    // }
    for (let i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            clearInterval(globalInterval);
            intervalCleared = true;
            twitterCall();
            if (getScore() > scores[scores.length - 1] || scores.length < 15) {
                toggleAddEntry();
            }
            else if (!leaderBoardOpen) {
                toggleLeaderboard();
            }
            return;
        }
        if (i < powerUps.length && i >= powerUpsIndex && myGamePiece.crashWith(powerUps[i])) {
            powerUpsIndex++;
            bonusScore += 250;
        }
    }
    myGameArea.clear();
    if (myGameArea.frameNo === 0) {
        let width = screenWidth / 2;
        while (width - interval/3 > 0) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 20;
            height = 60;
                //Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 80;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            let color = getRandomColor();
            let xspot = Math.random() * screenWidth;
            let yspot = screenHeight;
            let obs = new component(60, height, color, xspot, yspot);
            myObstacles.push(obs);
            //myObstacles.push(new component(20, x - height - gap, color, x - width, height + gap));
            width -= interval;
        }
    }
    else if (everyinterval(interval)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 20;
        height = 60;
            //Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 80;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        let color = getRandomColor();
        let xspot = Math.random() * screenWidth;
        let yspot = screenHeight;
        let obs = new component(60, height, color, xspot, yspot);
        /*
        for (i = 0; i < myObstacles.length; i++) {
            if (obs.crashWith(myObstacles[i])) {
                break;
            }
            myObstacles.push(obs);
        }
        if (myObstacles.length === 0) {
            myObstacles.push(obs);
        }
        */
        myObstacles.push(obs);
        //myObstacles.push(new component(20, x - height - gap, color, x, height + gap));
        let powerUp = Math.random() * 100;
        if (powerUp >= 60) {
            let randomHeight = Math.random() * interval;
            if (Math.random() * 2 > 1) {
                randomHeight *= -1;
            }
            powerUps.push(new component(30, 45, color, x - 5 + interval / 2, height + gap / 2 - 10 + randomHeight));
        }

    }
    myGameArea.frameNo += 1;
    for (let i = 0; i < myObstacles.length; i++) {
        myObstacles[i].y += -1;
        myObstacles[i].update();
        if (i < powerUps.length && i >= powerUpsIndex) {
            if(powerUps[i].x < 0){
                powerUpsIndex++;
            }
            else {
                powerUps[i].x += -1;
                powerUps[i].update("coin");
            }
        }
    }
    document.getElementById("scoreBoard").innerHTML = "Score: " + getScore();
    myGamePiece.newPos();
    if (isJumping) {
        myGamePiece.update("jump");
    }
    else {
        myGamePiece.update("idle");
    }
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}
function getScore() {
    return myGameArea.frameNo + bonusScore;
}
function restartGame() {
    if (intervalCleared) {
        location.reload();
    }
}