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
let sprite_idle, sprite_jump, sprite_ooid, sprite_star1, sprite_star2, sprite_star3, sprite_earth;
let sprite_moon, sprite_comet, sprite_mars, sprite_jupiter, sprite_ppower, sprite_meteor, sprite_shield;
let background, backgroundY, coin;
let bonusScore = 0;
let mouseX, mouseY;
let invincibility = false;
let ptimer = 0;
let difficulty = 1;
let score = 0;
let diffscore = 0;
let difflevel = 1;
let maxlevel = 4;
let myScore;
let updateSpeed = 15;
let scoreflag = true; //when true the score counts;
let audio;
function resizeCanvas() {
    let canvas = document.getElementById("mycanvas");
    if (canvas.width < window.innerWidth) {
        canvas.width = window.innerWidth;
    }

    if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight;
    }
}
function startGame() {
    //Init line for replaying
    mouseY = 0;
    mouseX = 0;
    myObstacles = [];
    powerUps = [];
    stars = [];
    planets = [];
    bonusScore = 0;
    backgroundY = 0;
    ptimer = 0;
    difficulty = 1;
    diffscore = 0;
    score = 0;
    maxlevel = 4;
    scoreflag = true;
    myScore = new component(50, 50, 'white', 50, 10);
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
            mouseX = e.clientX - 32;
            mouseY = e.clientY - 32;
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
        sprite_comet = new Image();
        sprite_comet.src = "../assets/sprites/comet.png";
        sprite_mars = new Image();
        sprite_mars.src = "../assets/sprites/mars.png";
        sprite_meteor = new Image();
        sprite_meteor.src = "../assets/sprites/meteor.png";
        sprite_jupiter = new Image();
        sprite_jupiter.src = "../assets/sprites/jupiter.png";
        sprite_ppower = new Image();
        sprite_ppower.src = "../assets/sprites/invinc.png";
        sprite_shield = new Image();
        sprite_shield.src = "../assets/sprites/shield.png";
        //set canvas
        this.canvas.setAttribute("id", "mycanvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(update, updateSpeed);
        this.canvas.addEventListener('click', menuHandler);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let height = 450;
        let width = 800;
        if (backgroundY > height) {
            backgroundY = 0;
        }
        for (let j = 0; j < myGameArea.canvas.width + width * 2; j += width) {
            for (let i = 0; i < myGameArea.canvas.height + height * 2; i += height) {
                this.context.drawImage(background, 0, i - backgroundY, j - 100, myGameArea.canvas.height);
            }
        }
        backgroundY += 0.75;
    }
};
function update() {
    let ctx = myGameArea.context;
    myGameArea.clear();
    myGameArea.canvas.style.cursor = "auto";
    ctx.fillStyle = 'white';
    ctx.font = "60pt Monoton";
    ctx.textAlign = "center";
    ctx.fillText("START GAME", window.innerWidth / 2, window.innerHeight / 2);
}
let menuHandler = function(event) {
    let upperBound = (window.innerHeight / 2 - parseInt(myGameArea.context.font));
    let lowerBound = (window.innerHeight / 2);
    if (event.pageY >= upperBound && event.pageY <= lowerBound) {
        myGameArea.canvas.style.cursor = "none";
        clearInterval(myGameArea.interval);
        // audio = new Audio('/assets/audio/ooidashtheme.mp3');
        // $(audio).bind('ended', () => {
        //    audio.currentTime = 0;
        //    audio.play();
        // });
        // audio.play();
        myGameArea.canvas.removeEventListener('click', menuHandler);
        myGameArea.interval = setInterval(updateGameArea, updateSpeed);
        globalInterval = myGameArea.interval;
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
            if (invincibility === true) {
                ctx.drawImage(sprite_shield, this.x - 16, this.y - 24, 32 * 3, 32 * 3);
            }
        }
        else if (image === "score") {
            ctx.fillStyle = color;
            ctx.font = "30px Arial";
            ctx.textAlign = "start";
            ctx.fillText("Score: " + getScore(), 10, 50);
        }
        else if (image === "coin") {
            if (this.coinX > 3) {
                this.coinX = 0;
            }
            if (this.type === 1) {
                ctx.drawImage(coin, (16 * this.coinX), 0, 16, 16, this.x, this.y, 32, 32);
            }
            else if (this.type === 2) {
                ctx.drawImage(sprite_ppower, (32 * this.coinX), 0, 32, 32, this.x, this.y, 32, 32);
            }
            if (this.ticks > 15) {
                this.coinX++;
                this.ticks = 0;
            }
            this.ticks++;
        }
        else if (image === "ooid") {
            if (this.type === 1) {
                ctx.drawImage(sprite_ooid, this.x, this.y, 64, 64);
            }
            else if (this.type === 2) {
                ctx.drawImage(sprite_comet, this.x - 15, this.y - 2, 64, 64);
            }
            else if (this.type === 3) {
                ctx.drawImage(sprite_meteor, this.x - 15, this.y, 64 * 2, 64 * 2);
            }
            else {
                ctx.drawImage(sprite_ooid, this.x, this.y, 64, 64);
            }
        }
        else if (image === "star") {
            if (this.starX > 3) {
                this.starX = 0;
            }
            if (this.type === 1) {
                ctx.drawImage(sprite_star1, (16 * this.starX), 0, 16, 16, this.x, this.y, 32, 32);
            }
            if (this.type === 2) {
                ctx.drawImage(sprite_star2, (16 * this.starX), 0, 16, 16, this.x, this.y, 32, 32);
            }
            if (this.type === 3) {
                ctx.drawImage(sprite_star3, (16 * this.starX), 0, 16, 16, this.x, this.y, 32, 32);
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
                ctx.drawImage(sprite_earth, (64 * this.starX), 0, 64, 64, this.x, this.y, 64 * 3, 64 * 3);
            }
            else if (this.type === 2) {
                ctx.drawImage(sprite_moon, (64 * this.starX), 0, 64, 64, this.x, this.y, 32 * 3, 32 * 3);
            }
            else if (this.type === 3) {
                ctx.drawImage(sprite_mars, (64 * this.starX), 0, 64, 64, this.x, this.y, 64 * 3, 64 * 3);
            }
            else if (this.type === 4) {
                ctx.drawImage(sprite_jupiter, this.x, this.y, 128 * 3, 128 * 3);
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
        if (this.x > window.innerWidth - 64) {
            this.x = window.innerWidth - 64;
        }
    };
    this.hitLeft = function () {
        if (this.x < 0) {
            this.x = 0;
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
            if (invincibility === false) {
                if (myGamePiece.crashWith(myObstacles[i])) {
                    clearInterval(globalInterval);
                    // audio.pause();
                    // audio.currentTime = 0;
                    // myGameArea.interval = setInterval(update, updateSpeed);
                    // intervalCleared = true;
                    twitterCall();
                    addEntry(getScore());
                    if (!leaderBoardOpen) {
                        toggleLeaderboard();
                    }
                    startGame();
                }
            }
        }
        for (let i = 0; i < powerUps.length; i++) {
            if (myGamePiece.crashWith(powerUps[i])) {
                if (powerUps[i].type === 1) {
                    bonusScore += 25;
                    diffscore += 25;
                    powerUps.splice(i, 1);
                }
                else if (powerUps[i].type === 2) {
                    invincibility = true;
                    powerUps.splice(i, 1);
                }
            }
        }
    }
    myGameArea.clear();

    if (invincibility === true && (myGameArea.frameNo % 60) === 0) {
        ptimer++;
    }
    if (invincibility === true && ptimer >= 10) {
        invincibility = false;
        ptimer = 0;
    }


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
            let offset = Math.random() * 15;
            let yspot = screenHeight + offset;
            let rockType;
            if (difflevel > 2) {
                rockType = (Math.random() * 100);
            } else {
                rockType = (Math.random() * 75);
            }
            let obs;
            if (rockType <= 50) {
                obs = new component(50, 50, color, xspot, yspot, 1);
            }
            else if (rockType <= 75) {
                obs = new component(30, 30, color, xspot, yspot, 2);
            }
            else if (rockType <= 100) {
                obs = new component(100, 120, color, xspot, yspot, 3);
            }
            myObstacles.push(obs);
            let powerUp = Math.random() * 100;
            if (powerUp >= 60) {
                powerUps.push(new component(30, 45, color, xspot, yspot, 1));
            }
            else if (powerUp >= 55) {
                powerUps.push(new component(32, 32, color, xspot, yspot, 2));
            }
        }
    }
    if ((myGameArea.frameNo % 60) === 0) {
        let starType = Math.random() * 150;
        let color = getRandomColor();
        let xspot = Math.random() * (screenWidth - 64);
        let yspot = screenHeight;
        if (starType <= 50) {
            stars.push(new component(16, 16, color, xspot, yspot, 1))
        }
        else if (starType <= 80) {
            stars.push(new component(16, 16, color, xspot, yspot, 2));
        }
        else if (starType <= 150) {
            stars.push(new component(16, 16, color, xspot, yspot, 3));
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
            stars.splice(i, 1);
        }
    }
    for (let i = 0; i < planets.length; i++) {
        planets[i].y -= 1;
        planets[i].update("planet");
        if (planets[i].y < -500) {
            planets.splice(i, 1);
        }
    }
    for (let i = 0; i < myObstacles.length; i++) {
        if (myObstacles[i].type === 1) {
            myObstacles[i].y -= 5;
        } else if (myObstacles[i].type === 2) {
            myObstacles[i].y -= 6;
        } else if (myObstacles[i].type === 3) {
            myObstacles[i].y -= 4;
        }
        myObstacles[i].update("ooid");
        if (myObstacles[i].y < -512) {
            myObstacles.splice(i, 1);
        }
    }
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y -= 3;
        powerUps[i].update("coin");
        if (powerUps[i].y < -512) {
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
            difflevel = 1;
        }
        difficulty++;
    }
    myScore.update("score");
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