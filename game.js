const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const scoreScreen = document.getElementById('scoreScreen');
const scoreEl = document.getElementById('score');
const birdYEl = document.getElementById('birdY');
const birdSEl = document.getElementById('birdS');
const birdGEl = document.getElementById('birdG');

// Параметры спрайта
const SPRITE_W = 20, SPRITE_H = 20, FRAMES = 4, ANIM_SPEED = 50;
// Загружаем изображение птицы
const birdImg = new Image();
birdImg.src = 'bird.png';

let isGameStarted = false, score = 0, currentFrame = 0, lastAnimTime = 0;
// Изменяем параметры птицы под размер изображения
const bird = { x: 100, y: 200, w: SPRITE_W, h: SPRITE_H, g: 0.4, s: 0, jp: -8 };
let pipes = [];
const pw = 80, pg = 250, ps = 2, pipeGap = 2500;

function createPipe() {
    const y = Math.random() * 300;
    pipes.push({ x: canvas.width, y, passed: false });
}

function drawPipe(p) {
    ctx.fillStyle = '#009900';
    ctx.fillRect(p.x, 0, pw, p.y - pw);
    ctx.fillRect(p.x, p.y + pg, pw, canvas.height - p.y - pg);
}

// Новая функция отрисовки птицы
function drawBird() {
    const frameX = currentFrame * SPRITE_W;
    ctx.drawImage(
        birdImg, frameX, 0, SPRITE_W, SPRITE_H,
        bird.x - SPRITE_W/2, bird.y - SPRITE_H/2,
        SPRITE_W, SPRITE_H
    );
}

function updateAnimation() {
    if (Date.now() - lastAnimTime > ANIM_SPEED) {
        currentFrame = (currentFrame + 1) % FRAMES;
        lastAnimTime = Date.now();
    }
}

function checkCollisions() {
    console.log('bird x', bird.x);
    console.log('bird y', bird.y);
    console.log('bird', bird);
    console.log('pipes', pipes);

    for (let p of pipes) {
        // Проверяем столкновение с верхней трубой
        if (bird.x + bird.w / 2 > p.x && bird.x - bird.w / 2 < p.x + pw && bird.y - bird.h / 2 < p.y) {
            console.log('Верхняя труба');
            return true;
        }
        // Проверяем столкновение с нижней трубой
        if (bird.x + bird.w / 2 > p.x && bird.x - bird.w / 2 < p.x + pw && bird.y + bird.h / 2 > p.y + pg) {
            console.log('Нижняя труба');
            return true;
        }
    }
    return false;
}

function update() {
    if (!isGameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.s += bird.g;
    bird.y += bird.s;
    birdYEl.innerText = 'Y: ' + bird.y;
    birdSEl.innerText = 'S: ' + bird.s;
    birdGEl.innerText = 'G: ' + bird.g;
    updateAnimation();

    for (let p of pipes) {
        p.x -= ps;
        drawPipe(p);
        if (!p.passed && p.x + pw < bird.x) {
            score++;
            p.passed = true;
            scoreEl.innerText = 'Счет: ' + score;
        }
    }

    pipes = pipes.filter(p => p.x > -pw);
    drawBird();

    if (bird.y + bird.h / 2 > canvas.height || checkCollisions()) {
        endGame();
    }
    requestAnimationFrame(update);
}

function endGame() {
    console.log('Игра окончена! Ваш счёт: ' + score);
    isGameStarted = false;
    startScreen.style.display = 'block';
    scoreScreen.innerText = 'Вы заработали ' + score + ' очков!';
    scoreScreen.style.display = 'block';
    bird.s = 0;
    bird.y = 200;
    pipes = [];
    location.reload(2000);
}

document.addEventListener('click',()=>{
    if(!isGameStarted){
        isGameStarted=true;
        startScreen.style.display='none';
        scoreScreen.style.display='none';
        scoreScreen.innerText = '';
        bird.s=0;
        bird.y=200;
        update();
        setInterval(createPipe,2500);
    }else{
        bird.s=bird.jp;
    }
});

update();
