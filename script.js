const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500;

//create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 5,
    dx: 2,
    dy: -4,
    visible: true
}

//create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    w: 80,
    h: 20,
    speed: 8,
    dx: 0,
    visible: true
}

//create brikc props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

//create brick
const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}

//draw ball on canvas 
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#0095DD' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = paddle.visible ? '#0095DD' : 'transparent';
    ctx.fill();
    ctx.closePath();
}
//draw score on canvas
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 65, 20);
}


//draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//move paddle on canvas 
function movePaddle() {
    paddle.x += paddle.dx;

    // wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w
    }
    if (paddle.x < 0) {
        paddle.x = 0
    }
}

//move ball on canvas 
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //wall collision 
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }


    //paddle collision

    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }
}

//brick collision
bricks.forEach(column => {
    column.forEach(brick => {
        if (brick.visible) {
            if (
                ball.x - ball.size > brick.x && // left brick side check
                ball.x + ball.size < brick.x + brick.w && // right brick side check
                ball.y + ball.size > brick.y && // top brick side check
                ball.y - ball.size < brick.y + brick.h // bottom brick side check
            ) {
                ball.dy *= -1;
                brick.visible = false;

                increaseScore();
            }
        }
    });
});

//hit botton wall
if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    scoreq = 0;
}

//increase score
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        ball.visible = false;
        paddle.visible = false;
        //after 0.5s reset the game
        setTimeout(function () {
            showAllBricks();
            score = 0;
            paddle.x = canvas.width / 2 - 40;
            paddle.y = canvas.height - 30;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.visible = true;
            paddle.visible = true;
        }, delay)
    }
}
//make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    })
}

//draw everything on canvas
function draw() {
    //clear canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//update canvas drawing and animation
function update() {
    moveBall();
    movePaddle();
    draw()
    requestAnimationFrame(update)
}
update()
//keyboard controls
function keyDown(e) {
    if (e.key === 'right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

//keyup event
function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

//keyboard event handler
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//rules and close event handler
rulesBtn.addEventListener('click', () => {rules.classList.toggle('show')});
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
