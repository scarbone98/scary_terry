/**
 * Created by scarbone on 11/11/17.
 */
let myGamePiece;
let myObstacles = [];
let myScore;
let interval = 150;
let globalInterval;
let isJumping = false;
let intervalCleared = false;
let screenWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

let screenHeight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;


function startGame() {
    myGamePiece = new component(47, 56, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = screenWidth / 1.00025;
        this.canvas.height = screenHeight / 1.10;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
        globalInterval = this.interval;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.update = function (image) {
        ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            if (image === "idle") {
                let sprite = new Image();
                sprite.src = "../assets/sprites/jump1.png";
                ctx.drawImage(sprite, this.x, this.y, 47, 56);
            }
            else if (image === "jump") {
                let sprite = new Image();
                sprite.src = "../assets/sprites/jump2.png";
                ctx.drawImage(sprite, this.x, this.y, 45, 67);
            }
            else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    };
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
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
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
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
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo === 1 || everyinterval(interval)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 80;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (let i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    if(isJumping) {
        myGamePiece.update("jump");
    }
    else{
        myGamePiece.update("idle");
    }
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
function getScore() {
    return myGameArea.frameNo;
}
function restartGame() {
    if (intervalCleared) {
        location.reload();
    }
}
document.addEventListener('keydown', function (event) {
    let spaceBar = 32;
    if (event.keyCode === spaceBar) {
        event.preventDefault();
        accelerate(-0.2);
    }
    isJumping = true;
});
document.addEventListener('keyup', function (event) {
    let spaceBar = 32;
    if (event.keyCode === spaceBar) {
        accelerate(0.05);
    }
    isJumping = false;
});