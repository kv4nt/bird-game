const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const scoreScreen = document.getElementById('scoreScreen');
const scoreEl = document.getElementById('score');
const birdYEl = document.getElementById('birdY');
const birdSEl = document.getElementById('birdS');
const birdGEl = document.getElementById('birdG');

// Параметры спрайта
const SPRITE_W = 191, SPRITE_H = 161, FRAMES = 3, ANIM_SPEED = 120;
// Загружаем изображение птицы
const birdImg = new Image();
birdImg.src = 'drago.png';

let isGameStarted = false, score = 0, currentFrame = 0, lastAnimTime = 0;
// Изменяем параметры птицы под размер изображения
const bird = { x: 100, y: 200, w: SPRITE_W, h: SPRITE_H, g: 0.4, s: 0, jp: -8 };
let pipes = [];
const pw = 80, pg = 250, ps = 2, pipeGap = 2500;

function createPipe() {
    const y = Math.random() * 300;
    pipes.push({ x: canvas.width, y, passed: false });
    console.log('pipes',pipes[pipes.length-1]);
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
    // console.log('bird x', bird.x);
    // console.log('bird y', bird.y);
    // console.log('bird', bird);
    // console.log('pipes', pipes);

    for (let p of pipes) {
        if(pipes[0].x + pw >= bird.x) {
            console.log('pipe is coming',pipes[0].x);
        }
        // Проверяем столкновение с верхней трубой
        // console.log(p.y,bird.y);
        if ((pipes[0].x >= bird.x || pipes[0].x + pw >= bird.x || pipes[0].x + pw <= bird.x) && bird.y <= pipes[0].y) {
            console.log('p',p);
            console.log('bird',bird);
            console.log('Верхняя труба');
            return true;
        }
        // if (bird.x + bird.w > p.x && bird.x - bird.w < p.x && bird.y + bird.h < p.y + pg) {
        //     console.log('p',p);
        //     console.log('bird',bird);
        //     console.log('Верхняя труба');
        //     return true;
        // }
        // Проверяем столкновение с нижней трубой
        if (bird.x + bird.w / 2 > p.x && bird.x - bird.w / 2 < p.x + pw && bird.y + bird.h / 2 > p.y + pg) {
            console.log('Нижняя труба');
            return true;
        }
        return false;
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

    pipes = pipes.filter(p => p.x +pw > bird.x);
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



function tryLockOrientation()
{
    if (!this.autoLockOrientation || this.orientations === 0)
        return;
    var orientation = "portrait";
    if (this.orientations === 2)
        orientation = "landscape";
    try {
        if (screen["orientation"] && screen["orientation"]["lock"])
            screen["orientation"]["lock"](orientation).catch(function(){});
        else if (screen["lockOrientation"])
            screen["lockOrientation"](orientation);
        else if (screen["webkitLockOrientation"])
            screen["webkitLockOrientation"](orientation);
        else if (screen["mozLockOrientation"])
            screen["mozLockOrientation"](orientation);
        else if (screen["msLockOrientation"])
            screen["msLockOrientation"](orientation);
    }
    catch (e)
    {
        if (console && console.warn)
            console.warn("Failed to lock orientation: ", e);
    }
}
function setSize(w, h, force)
{
    this.canvasdiv = document.getElementById("c2canvasdiv");
    var offx = 0, offy = 0;
    var neww = 0, newh = 0, intscale = 0;
    if (this.lastWindowWidth === w && this.lastWindowHeight === h && !force)
        return;
    this.lastWindowWidth = w;
    this.lastWindowHeight = h;
    var mode = this.fullscreen_mode;
    var orig_aspect, cur_aspect;
    var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen) && !this.isCordova;
    if (!isfullscreen && this.fullscreen_mode === 0 && !force)
        return;			// ignore size events when not fullscreen and not using a fullscreen-in-browser mode
    if (isfullscreen && this.fullscreen_scaling > 0)
        mode = this.fullscreen_scaling;
    var dpr = this.devicePixelRatio;
    if (mode >= 4)
    {
        orig_aspect = this.original_width / this.original_height;
        cur_aspect = w / h;
        if (cur_aspect > orig_aspect)
        {
            neww = h * orig_aspect;
            if (mode === 5)	// integer scaling
            {
                intscale = (neww * dpr) / this.original_width;
                if (intscale > 1)
                    intscale = Math.floor(intscale);
                else if (intscale < 1)
                    intscale = 1 / Math.ceil(1 / intscale);
                neww = this.original_width * intscale / dpr;
                newh = this.original_height * intscale / dpr;
                offx = (w - neww) / 2;
                offy = (h - newh) / 2;
                w = neww;
                h = newh;
            }
            else
            {
                offx = (w - neww) / 2;
                w = neww;
            }
        }
        else
        {
            newh = w / orig_aspect;
            if (mode === 5)	// integer scaling
            {
                intscale = (newh * dpr) / this.original_height;
                if (intscale > 1)
                    intscale = Math.floor(intscale);
                else if (intscale < 1)
                    intscale = 1 / Math.ceil(1 / intscale);
                neww = this.original_width * intscale / dpr;
                newh = this.original_height * intscale / dpr;
                offx = (w - neww) / 2;
                offy = (h - newh) / 2;
                w = neww;
                h = newh;
            }
            else
            {
                offy = (h - newh) / 2;
                h = newh;
            }
        }
        if (isfullscreen && !this.isNWjs)
        {
            offx = 0;
            offy = 0;
        }
    }
    else if (this.isNWjs && this.isNodeFullscreen && this.fullscreen_mode_set === 0)
    {
        offx = Math.floor((w - this.original_width) / 2);
        offy = Math.floor((h - this.original_height) / 2);
        w = this.original_width;
        h = this.original_height;
    }
    if (mode < 2)
        this.aspect_scale = dpr;
    this.cssWidth = Math.round(w);
    this.cssHeight = Math.round(h);
    this.width = Math.round(w * dpr);
    this.height = Math.round(h * dpr);
    this.redraw = true;
    if (this.wantFullscreenScalingQuality)
    {
        this.draw_width = this.width;
        this.draw_height = this.height;
        this.fullscreenScalingQuality = true;
    }
    else
    {
        if ((this.width < this.original_width && this.height < this.original_height) || mode === 1)
        {
            this.draw_width = this.width;
            this.draw_height = this.height;
            this.fullscreenScalingQuality = true;
        }
        else
        {
            this.draw_width = this.original_width;
            this.draw_height = this.original_height;
            this.fullscreenScalingQuality = false;
            /*var orig_aspect = this.original_width / this.original_height;
            var cur_aspect = this.width / this.height;
            if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
                this.aspect_scale = this.height / this.original_height;
            else
                this.aspect_scale = this.width / this.original_width;*/
            if (mode === 2)		// scale inner
            {
                orig_aspect = this.original_width / this.original_height;
                cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
                if (cur_aspect < orig_aspect)
                    this.draw_width = this.draw_height * cur_aspect;
                else if (cur_aspect > orig_aspect)
                    this.draw_height = this.draw_width / cur_aspect;
            }
            else if (mode === 3)
            {
                orig_aspect = this.original_width / this.original_height;
                cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
                if (cur_aspect > orig_aspect)
                    this.draw_width = this.draw_height * cur_aspect;
                else if (cur_aspect < orig_aspect)
                    this.draw_height = this.draw_width / cur_aspect;
            }
        }
    }
    if (this.canvasdiv && !this.isDomFree && typeof jQuery === 'function')
    {
        jQuery(this.canvasdiv).css({"width": Math.round(w) + "px",
            "height": Math.round(h) + "px",
            "margin-left": Math.floor(offx) + "px",
            "margin-top": Math.floor(offy) + "px"});
        if (typeof cr_is_preview !== "undefined")
        {
            jQuery("#borderwrap").css({"width": Math.round(w) + "px",
                "height": Math.round(h) + "px"});
        }
    }
    if (this.canvas)
    {
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        if (this.isEjecta)
        {
            this.canvas.style.left = Math.floor(offx) + "px";
            this.canvas.style.top = Math.floor(offy) + "px";
            this.canvas.style.width = Math.round(w) + "px";
            this.canvas.style.height = Math.round(h) + "px";
        }
        else if (this.isRetina && !this.isDomFree)
        {
            this.canvas.style.width = Math.round(w) + "px";
            this.canvas.style.height = Math.round(h) + "px";
        }
    }
    if (this.overlay_canvas)
    {
        this.overlay_canvas.width = Math.round(w * dpr);
        this.overlay_canvas.height = Math.round(h * dpr);
        this.overlay_canvas.style.width = this.cssWidth + "px";
        this.overlay_canvas.style.height = this.cssHeight + "px";
    }
    if (this.glwrap)
    {
        this.glwrap.setSize(Math.round(w * dpr), Math.round(h * dpr));
    }
    if (this.isDirectCanvas && this.ctx)
    {
        this.ctx.width = Math.round(w);
        this.ctx.height = Math.round(h);
    }
    if (this.ctx)
    {
        this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
    }
    this.tryLockOrientation();
    if (this.isiPhone && !this.isCordova)
    {
        window.scrollTo(0, 0);
    }
};
// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    if (canvas.width < document.body.clientWidth) {
        canvas.width = document.body.clientWidth;
    }
    if (canvas.height < document.body.clientHeight) {
        canvas.height = document.body.clientHeight;
    }
    var curwidth = window.innerWidth;
    var curheight = window.innerHeight
    setSize(curwidth, curheight);

    document.getElementById('clientW').innerText = "Width:"+document.body.clientWidth;
    document.getElementById('clientH').innerText = "Heigth"+document.body.clientHeight;
};