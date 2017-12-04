/**
 * Created by scarbone on 11/11/17.
 * Contributed to by slondon too, okay?
 */
let myGamePiece;
let myObstacles = [];
let powerUps = [];
let stars = [];
let planets = [];
let interval = 200;
let globalInterval;
let intervalCleared = false;
let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
let sprite_idle;
let sprite_jump;
let sprite_ooid;
let sprite_star1;
let sprite_star2;
let sprite_star3;
let sprite_earth;
let sprite_moon;
let background;
let backgroundY;
let coin;
let bonusScore = 0;
let updateSpeed = 15;
let mouseX;
let mouseY;
let difficulty = 1;
let score = 0;
let diffscore = 0;
let difflevel = 1;
let maxlevel = 2;
let scoreflag = true; //when true the score counts;
function resizeCanvas() {
    let canvas = document.getElementById("mycanvas");
    if (canvas.width < window.innerWidth) {
        canvas.width = window.innerWidth;
    }

    if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight / 1.10;
    }
}
function startGame() {
    backgroundY = 0;
    myGamePiece = new component((28 * 2) - 6, (20 * 2) - 1, "red", 10, 120);
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
        //set sprites
        sprite_idle = new Image();
        sprite_idle.src = "../assets/sprites/oldmanterry2.png";
        sprite_jump = new Image();
        sprite_jump.src = "../assets/sprites/oldmanterry1.png";
        sprite_ooid = new Image();
        sprite_ooid.src = "../assets/sprites/3829rock.png";
        background = new Image();
        background.src = "../assets/sprites/background.png";
        coin = new Image();
        coin.src = "../assets/sprites/6416diamond.png";
        sprite_star1 = new Image();
        sprite_star1.src = "../assets/sprites/star1.png";
        sprite_star2 = new Image();
        sprite_star2.src = "../assets/sprites/star2.png";
        sprite_star3 = new Image();
        sprite_star3.src = "../assets/sprites/star3.png";
        sprite_earth = new Image();
        sprite_earth.src = "../assets/sprites/earth.png";
        sprite_moon = new Image();
        sprite_moon.src = "../assets/sprites/moon.png";
        //set canvas
        this.canvas.setAttribute("id", "mycanvas");
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
        let height = 450;
        let width = 800;
        if (backgroundY > height) {
            backgroundY = 0;
        }
        for (let j = 0; j < myGameArea.canvas.width + width; j += width) {
            for (let i = 0; i < myGameArea.canvas.height + height; i += height) {
                this.context.drawImage(background, 0, i - backgroundY, j - 100, myGameArea.canvas.height);
            }
        }
        backgroundY += 0.75;
    }
};
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.ticks = 0;
    this.coinX = 0;
    this.starX = 0;
    this.update = function (image) {
        this.ticks++;
        let ctx = myGameArea.context;
        if (image === "idle") {
            if (this.ticks >= 30) {
                this.ticks = 0;
            }
            if (this.ticks >= 15) {
                ctx.drawImage(sprite_jump, this.x + 3, this.y, 28 * 2, 20 * 2);
            } else if (this.ticks < 15) {
                ctx.drawImage(sprite_idle, this.x + 3, this.y, 28 * 2, 20 * 2);
            }
        }
        else if (image === "coin") {
            if (this.coinX > 3) {
                this.coinX = 0;
            }
            ctx.drawImage(coin, (16 * this.coinX), 0, 16, 16, this.x, this.y, 32, 32);
            if (this.ticks > 15) {
                this.coinX++;
                this.ticks = 0;
            }
            this.ticks++;
        }
        else if (image === "ooid") {
            ctx.drawImage(sprite_ooid, this.x, this.y, 64, 64);
        }
        else if (image === "star") {
            if (this.starX > 3) {
                this.starX = 0;
            }
            if (this.type === 1) {
                ctx.drawImage(sprite_star1, (16 * this.starX), 0, 16, 16, this.x, this.y, 32, 32);
            }
            if (this.type === 2) {
                ctx.drawImage(sprite_star2, (16 * this.starX),0,16,16,this.x,this.y,32,32);
            }
            if (this.type === 3) {
                ctx.drawImage(sprite_star3, (16 * this.starX),0,16,16,this.x,this.y,32,32);
            }
            if (this.ticks > 15) {
                this.starX++;
                this.ticks = 0;
            }
            this.ticks++;
        }
        else if (image === "planet") {
            if (this.starX > 1) {
                this.starX = 0;
            }
            if (this.type === 1) {
                ctx.drawImage(sprite_earth, (64 * this.starX), 0, 64, 64, this.x, this.y, 128, 128);
            }
            if (this.type === 2) {
                ctx.drawImage(sprite_moon, (64 * this.starX), 0, 64, 64, this.x, this.y, 64, 64);
            }
            if (this.ticks > 15) {
                this.starX++;
                this.ticks = 0;
            }
            this.ticks++;
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.x = mouseX;
        this.y = mouseY;
        this.hitBottom();
        this.hitTop();
        this.hitRight();
        this.hitLeft();
    };
    this.hitRight = function () {
      if(this.x > screenWidth - this.width){
          this.x = screenWidth - this.width;
      }
    };
    this.hitLeft = function () {
      if(this.x < 0){
          this.x = this.width;
      }
    };
    this.hitTop = function () {
        if (this.y < 0) {
            this.y = 0;
        }
    };
    this.hitBottom = function () {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
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
    let x, gap, minHeight, maxHeight, minGap, maxGap;
    //Check for collisions
    if (myGameArea.frameNo > 50) {
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
        for (let i = 0; i < powerUps.length; i++) {
            if (myGamePiece.crashWith(powerUps[i])) {
                bonusScore += 25;
                diffscore += 25;
                powerUps.splice(i, 1);
            }
        }
    }
    myGameArea.clear();

    //Generate objects
    if (myGameArea.frameNo === 0) {
        let width = screenWidth / 2;
        while (width - interval / 3 > 0) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 20;
            minGap = 80;
            maxGap = 200;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
            width -= interval;
        }
    }
    if ((myGameArea.frameNo % 30) === 0) {
        for (let i = 0; i < difficulty; i++) {
            let color = getRandomColor();
            let xspot = Math.random() * (screenWidth - 64);
            let yspot = screenHeight;
            let obs = new component(60, 60, color, xspot, yspot);
            myObstacles.push(obs);
            let powerUp = Math.random() * 100;
            if (powerUp >= 60) {
                powerUps.push(new component(30, 45, color, xspot, yspot));
            }
        }
    }
    if ((myGameArea.frameNo % 60) === 0) {
        let starType = Math.random() * 150;
        let color = getRandomColor();
        let xspot = Math.random() * (screenWidth - 64);
        let yspot = screenHeight;
        if (starType <= 50) {
            stars.push(new component(16,16, color,xspot,yspot,1))
        }
        else if (starType <= 80) {
            stars.push(new component(16,16, color, xspot,yspot, 2));
        }
        else if (starType <= 150) {
            stars.push(new component(16,16, color, xspot,yspot, 3));
        }
    }

    //Update Score
    if (scoreflag === true) {
        if ((myGameArea.frameNo % 30) === 0) {
            score++;
            diffscore++;
            scoreflag = false;
        }
    } else {
        scoreflag = true;
    }

    //Update Everything
    myGameArea.frameNo += 1;
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].type === 3) {
            stars[i].y -= 1;
        }
        else if (stars[i].type === 2) {
            stars[i].y += 0.5;
        }
        stars[i].y -= 1;
        stars[i].update("star");
        if (stars[i].y < -10) {
            stars.splice(i,1);
        }
    }
    for (let i = 0; i < planets.length; i++) {
        planets[i].y -= 1;
        planets[i].update("planet");
        if (planets[i].y < -200) {
            planets.splice(i,1);
        }
    }
    for (let i = 0; i < myObstacles.length; i++) {
        myObstacles[i].y -= 5;
        myObstacles[i].update("ooid");
        if (myObstacles[i].y < -256) {
            myObstacles.splice(i, 1);
        }
    }
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y -= 3;
        powerUps[i].update("coin");
        if (powerUps[i].y < -256) {
            powerUps.splice(i, 1);
        }
    }
    if (diffscore >= 500) {
        let color = getRandomColor();
        let xspot = Math.random() * (screenWidth - 64);
        let yspot = screenHeight;
        let obs = new component(64, 64, color, xspot, yspot, difflevel);
        planets.push(obs);
        diffscore = 0;
        difflevel++;
        if (difflevel > maxlevel) {
            difflevel = 0;
        }
        difficulty++;
    }
    // document.getElementById("scoreBoard").innerHTML = "Depth: " + getScore();
    myGamePiece.newPos();
    myGamePiece.update("idle");
}
function getScore() {
    return score + bonusScore;
}
function restartGame() {
    if (intervalCleared) {
        location.reload();
    }
}