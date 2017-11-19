/**
 * Created by scarbone on 11/11/17.
 */
let myGamePiece;
let myObstacles = [];
let powerUps = [];
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
let sprite_idle;
let sprite_jump;
let background;
let backgroundX;
function startGame() {
    backgroundX = 0;
    myGamePiece = new component(47, 56, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    // myScore = new component("30px", "Consolas", "black", 280, 40, "text");
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
        sprite_idle = new Image();
        sprite_idle.src = "../assets/sprites/jump1.png";
        sprite_jump = new Image();
        sprite_jump.src = "../assets/sprites/jump2.png";
        background = new Image;
        background.src = "../assets/sprites/background.png";
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
        // this.context.fillStyle = 'rgba(0,0,0,0.8)';
        // this.context.fillRect(0,0,window.innerWidth,window.innerHeight);
        if(backgroundX > 1920){
            backgroundX = 0;
        }
        for(let i = 0; i < myGameArea.canvas.width + 1920; i+=1920){
            this.context.drawImage(background, i - backgroundX, 0, 1920,myGameArea.canvas.clientHeight);
        }
        backgroundX++;
        // this.context.drawImage(background, 0, 0, 600,450);
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
                ctx.drawImage(sprite_idle, this.x, this.y, 47, 56);
            }
            else if (image === "jump") {
                ctx.drawImage(sprite_jump, this.x, this.y, 45, 67);
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
    // for(let i = 0; i < powerUps.length; i++){
    //     if(myGamePiece.crashWith(powerUps[i])){
    //         powerUps.splice(i, 1);
    //         myGameArea.frameNo += 100;
    //     }
    // }
    myGameArea.clear();
    if(myGameArea.frameNo === 0){
        let width = screenWidth/2;
        while(width - interval > 0){
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = 80;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            let color = getRandomColor();
            myObstacles.push(new component(10, height, color, x - width, 0));
            myObstacles.push(new component(10, x - height - gap, color, x - width, height + gap));
            width -= interval;
        }
    }
    else if (myGameArea.frameNo === 1 || everyinterval(interval)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 80;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        let color = getRandomColor();
        myObstacles.push(new component(10, height, color, x, 0));
        myObstacles.push(new component(10, x - height - gap, color, x, height + gap));
        // let powerUp = Math.random() * 100;
        // if(powerUp >= 70){
        //     let randomHeight = Math.random() * interval;
        //     if(Math.random() * 2 > 1){
        //         randomHeight *= -1;
        //     }
        //     powerUps.push(new component(20,20,color,x - 5 + interval/2, height + gap/2 - 10 + randomHeight));
        // }

    }
    myGameArea.frameNo += 1;
    for (let i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    // for(let i = 0; i < powerUps.length; i++){
    //     powerUps[i].x += -1;
    //     powerUps[i].update();
    // }
    document.getElementById("scoreBoard").innerHTML = "Score: " + getScore();
    // myScore.text = "SCORE: " + myGameArea.frameNo;
    // myScore.update();

    myGamePiece.newPos();
    if(isJumping) {
        myGamePiece.update("jump");
    }
    else {
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
        isJumping = true;
        event.preventDefault();
        accelerate(-0.2);
    }
});
document.addEventListener('keyup', function (event) {
    let spaceBar = 32;
    if (event.keyCode === spaceBar) {
        isJumping = false;
        accelerate(0.05);
    }
});