const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройки игры
const bird = {
    x: 100,
    y: 200,
    radius: 15,
    gravity: 0.5,
    speed: 0,
    jumpPower: -10
};

let pipes = []; // Изменено с const на let
const pipeWidth = 80;
const pipeGap = 150;
const pipeSpeed = 2;

let score = 0;

// Создание трубы
function createPipe() {
    const y = Math.random() * (canvas.height - pipeGap - 2 * pipeWidth) + pipeWidth;
    pipes.push({
        x: canvas.width,
        y: y,
        passed: false
    });
}

// Отрисовка трубы
function drawPipe(pipe) {
    ctx.fillStyle = '#009900';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y - pipeWidth);
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
}

// Отрисовка птицы
function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6600';
    ctx.fill();
}

// Обработка столкновений
function checkCollisions() {
    for (let pipe of pipes) {
        if (bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.y ||
                bird.y + bird.radius > pipe.y + pipeGap)) {
            return true;
        }
    }
    return false;
}

// Обновление игры
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Движение птицы
    bird.speed += bird.gravity;
    bird.y += bird.speed;

    // Создание новых труб
    if (Date.now() % 1500 === 0) {
        createPipe();
    }

    // Движение труб
    for (let pipe of pipes) {
        pipe.x -= pipeSpeed;
        drawPipe(pipe);

        if (!pipe.passed && pipe.x === bird.x) {
            score++;
            pipe.passed = true;
        }
    }

    // Удаление труб за пределами экрана
    pipes = pipes.filter(pipe => pipe.x > -pipeWidth);

    drawBird();

    // Проверка столкновений
    if (bird.y + bird.radius > canvas.height || checkCollisions()) {
        alert('Игра окончена! Ваш счёт: ' + score);
        location.reload();
    }

    requestAnimationFrame(update);
}

// Управление
document.addEventListener('click', () => {
    bird.speed = bird.jumpPower;
});

// Запуск игры
update();
