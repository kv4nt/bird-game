const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const startScreen=document.getElementById('startScreen');
const scoreEl=document.getElementById('score');

let isGameStarted=false,score=0;
const bird={x:100,y:200,r:10,g:0.4,s:0,jp:-8};
let pipes=[];
const pw=80,pg=200,ps=2,pipeGap=2500;

function createPipe(){
    console.log('create pipe')
    const y=Math.random()*(canvas.height-pg-2*pw)+pw;
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
    for(let p of pipes){
        if(bird.x+bird.r>p.x&&bird.x-bird.r<p.x+pw&&(bird.y-bird.r<p.y||bird.y+bird.r>p.y+pg))return true;
    }
    return false;
}

function update(){
    if(!isGameStarted)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    bird.s+=bird.g;
    bird.y+=bird.s;
    console.log('pipegap',Date.now()%pipeGap);
    if(Date.now()%pipeGap===0)createPipe();

    for(let p of pipes){
        p.x-=ps;
        drawPipe(p);
        if(!p.passed&&p.x===bird.x){score++;p.passed=true;scoreEl.innerText='Счет: '+score;}
    }

    pipes=pipes.filter(p=>p.x>-pw);
    drawBird();

    if(bird.y+bird.r>canvas.height||checkCollisions()){
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
    }else{
        bird.s=bird.jp;
    }
});

update();
