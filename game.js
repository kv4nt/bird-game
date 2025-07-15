const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const startScreen=document.getElementById('startScreen');
const scoreEl=document.getElementById('score');
const birdYEl=document.getElementById('birdY');
const birdSEl=document.getElementById('birdS');
const birdGEl=document.getElementById('birdG');

let isGameStarted=false,score=0;
const bird={x:100,y:200,r:10,g:0.4,s:0,jp:-8};
let pipes=[];
const pw=80,pg=250,ps=2,pipeGap=2500;

function createPipe(){
    //const y=Math.random()*(canvas.height-pg-2*pw)+pw;
    const y=Math.random()*300;
    pipes.push({x:canvas.width,y,passed:false});
}

function drawPipe(p){
    ctx.fillStyle='#009900';
    ctx.fillRect(p.x,0,pw,p.y-pw);
    ctx.fillRect(p.x,p.y+pg,pw,canvas.height-p.y-pg);
}

function drawBird(){
    ctx.beginPath();
    ctx.arc(bird.x,bird.y,bird.r,0,Math.PI*2);
    ctx.fillStyle='#ff6600';
    ctx.fill();
}

function checkCollisions(){
    console.log('bird x',bird.x);
    console.log('bird y',bird.y);
    console.log('bird',bird);
    console.log('pipes',pipes);
    for(let p of pipes){
        // if(p.passed) {
        //     continue;
        // }
        // Проверяем столкновение с верхней трубой
        // if(bird.x+bird.r>p.x && bird.x-bird.r<p.x+pw && bird.y-bird.r<p.y) {
        if(bird.x>p.x && bird.x<p.x && bird.y<p.y) {
            console.log('v1',bird.x+bird.r>p.x);
            console.log('v1',bird.x+bird.r,p.x);
            console.log('v2',bird.x-bird.r<p.x+pw);
            console.log('v2',bird.x-bird.r,p.x+pw);
            console.log('v3',bird.y+bird.r<p.y);
            console.log('v3',bird.y+bird.r,p.y);
        console.log('Верхняя труба');
            return true;
        }
        // Проверяем столкновение с нижней трубой
        if(bird.x+bird.r>p.x && bird.x-bird.r<p.x+pw && bird.y+bird.r>p.y+pg) {
            console.log('v1',bird.x+bird.r>p.x);
            console.log('v1',bird.x+bird.r,p.x);
            console.log('v2',bird.x-bird.r<p.x+pw);
            console.log('v2',bird.x-bird.r,p.x+pw);
            console.log('v3',bird.y+bird.r>p.y+pg);
            console.log('v3',bird.y+bird.r,p.y+pg);
            console.log('Нижняя труба');
            return true;
        }
        //return false;
    }
    return false;
}

function update(){
    if(!isGameStarted)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    bird.s+=bird.g;
    bird.y+=bird.s;
    birdYEl.innerText = 'Y: '+bird.y;
    birdSEl.innerText = 'S: '+bird.s;
    birdGEl.innerText = 'G: '+bird.g;

    //if(Date.now()%pipeGap<=50)createPipe();
    //if(Date.now()%pipeGap===0)createPipe();
    //setInterval(createPipe,2500*60);
    // if(pipes.length <= 2) {
    //     createPipe();
    // }

    for(let p of pipes){
        p.x-=ps;
        drawPipe(p);
        if(!p.passed && p.x+pw<bird.x){
            score++;
            p.passed=true;
            scoreEl.innerText='Счет: '+score;
        }
    }

    pipes=pipes.filter(p=>p.x>-pw);
    drawBird();

    if(bird.y+bird.r>canvas.height || checkCollisions()){
        endGame();
    }
    requestAnimationFrame(update);
}

function endGame(){
    console.log('Игра окончена! Ваш счёт: ' + score);
    //location.reload();
    isGameStarted = false;
    startScreen.style.display = 'block';
    bird.s = 0;
    bird.y = 200;
    location.reload();
    //pipes = [];
    //update();
}

document.addEventListener('click',()=>{
    if(!isGameStarted){
        isGameStarted=true;
        startScreen.style.display='none';
        bird.s=0;
        bird.y=200;
        update();
        setInterval(createPipe,2500);
    }else{
        bird.s=bird.jp;
    }
});

update();
