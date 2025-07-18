/**
 * 
 * Game configurations.
 * @name configurations
 */
const configurations = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: 576,
        // height: 1024,
    },
}

/**
 *  Game assets.
 *  @name assets
 */
const assets = {
    bird: {
        red: 'bird-red',
        yellow: 'bird-yellow',
        blue: 'bird-blue'
    },
    obstacle: {
        pipe: {
            green: {
                top: 'pipe-green-top',
                bottom: 'pipe-green-bottom'
            },
            red: {
                top: 'pipe-red-top',
                bottom: 'pipe-red-bo'
            }
        }
    },
    scene: {
        width: 144,
        background: {
            day: 'background-day',
            night: 'background-night',
            hell: 'background-hell',
            grass: 'background-grass',
            canyon: 'background-canyon',
            rocks: 'background-rocks',
            cave: 'background-cave',
            snow: 'background-snow',
        },
        ground: 'ground',
        gameOver: 'game-over',
        leaderboard:'leaderboard',
        restart: 'restart-button',
        messageInitial: 'message-initial'
    },
    scoreboard: {
        width: 25,
        base: 'number',
        number0: 'number0',
        number1: 'number1',
        number2: 'number2',
        number3: 'number3',
        number4: 'number4',
        number5: 'number5',
        number6: 'number6',
        number7: 'number7',
        number8: 'number8',
        number9: 'number9'
    },
    animation: {
        bird: {
            red: {
                clapWings: 'red-clap-wings',
                stop: 'red-stop'
            },
            blue: {
                clapWings: 'blue-clap-wings',
                stop: 'blue-stop'
            },
            yellow: {
                clapWings: 'yellow-clap-wings',
                stop: 'yellow-stop'
            }
        },
        ground: {
            moving: 'moving-ground',
            stop: 'stop-ground'
        }
    }
}

// Game
/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
const game = new Phaser.Game(configurations)
/**
 * If it had happened a game over.
 * @type {boolean}
 */
let gameOver
let leaderboard
/**
 * If the game has been started.
 * @type {boolean}
 */
let gameStarted
/**
 * Up button component.
 * @type {object}
 */
let upButton
/**
 * Restart button component.
 * @type {object}
 */
let restartButton
let recordsButton
/**
 * Game over banner component.
 * @type {object}
 */
let gameOverBanner
/**
 * Message initial component.
 * @type {object}
 */
let messageInitial
// Bird
/**
 * Player component.
 * @type {object}
 */
let player
/**
 * Bird name asset.
 * @type {string}
 */
let birdName
/**
 * Quantity frames to move up.
 * @type {number}
 */
let framesMoveUp
// Background
/**
 * Day background component.
 * @type {object}
 */
let backgroundDay
/**
 * Night background component.
 * @type {object}
 */
let backgroundNight
/**
 * Hell background component
 * @type {object}
 */
let backgroundHell
let backgroundGrass
let backgroundRocks
let backgroundCanyon
let backgroundCave
let backgroundSnow
/**
 * Ground component.
 * @type {object}
 */
let ground
// pipes
/**
 * Pipes group component.
 * @type {object}
 */
let pipesGroup
/**
 * Gaps group component.
 * @type {object}
 */
let gapsGroup
/**
 * Counter till next pipes to be created.
 * @type {number}
 */
let nextPipes
/**
 * Current pipe asset.
 * @type {object}
 */
let currentPipe
// score variables
/**
 * Scoreboard group component.
 * @type {object}
 */
let scoreboardGroup
/**
 * Score counter.
 * @type {number}
 */
let score

/**
 *   Load the game assets.
 */
function preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(40, 270, 220, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 70,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(40, 270, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    // Backgrounds and ground
    this.load.image(assets.scene.background.day, 'assets/background-day.png')
    this.load.image(assets.scene.background.night, 'assets/background-night.png')
    this.load.image(assets.scene.background.hell,'assets/background-hell.png')
    this.load.image(assets.scene.background.canyon,'assets/background-canyon.png')
    this.load.image(assets.scene.background.grass,'assets/background-grass.png')
    this.load.image(assets.scene.background.rocks,'assets/background-rocks.png')
    this.load.image(assets.scene.background.cave,'assets/background-cave.png')
    this.load.image(assets.scene.background.snow,'assets/background-snow.png')
    this.load.spritesheet(assets.scene.ground, 'assets/ground-sprite.png', {
        frameWidth: 336,
        frameHeight: 112
    })

    // Pipes
    this.load.image(assets.obstacle.pipe.green.top, 'assets/pipe-green-top.png')
    this.load.image(assets.obstacle.pipe.green.bottom, 'assets/pipe-green-bottom.png')
    this.load.image(assets.obstacle.pipe.red.top, 'assets/pipe-red-top.png')
    this.load.image(assets.obstacle.pipe.red.bottom, 'assets/pipe-red-bottom.png')

    // Start game
    this.load.image(assets.scene.messageInitial, 'assets/message-initial.png')

    // End game
    this.load.image(assets.scene.gameOver, 'assets/gameover.png')
    this.load.image(assets.scene.restart, 'assets/restart-button.png')
    this.load.image(assets.scene.leaderboard, 'assets/restart-button-clear.png')

    // Birds
    this.load.spritesheet(assets.bird.red, 'assets/bird-red-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.blue, 'assets/bird-blue-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.yellow, 'assets/bird-yellow-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })

    // Numbers
    this.load.image(assets.scoreboard.number0, 'assets/number0.png')
    this.load.image(assets.scoreboard.number1, 'assets/number1.png')
    this.load.image(assets.scoreboard.number2, 'assets/number2.png')
    this.load.image(assets.scoreboard.number3, 'assets/number3.png')
    this.load.image(assets.scoreboard.number4, 'assets/number4.png')
    this.load.image(assets.scoreboard.number5, 'assets/number5.png')
    this.load.image(assets.scoreboard.number6, 'assets/number6.png')
    this.load.image(assets.scoreboard.number7, 'assets/number7.png')
    this.load.image(assets.scoreboard.number8, 'assets/number8.png')
    this.load.image(assets.scoreboard.number9, 'assets/number9.png')

    //audio
    this.load.audio('dieSound', 'sound/die.wav');
    this.load.audio('fartSound', 'sound/fart.wav');
    this.load.audio('fartSound1', 'sound/fart1.wav');
    this.load.audio('fartSound2', 'sound/fart2.mp3');
    this.load.audio('fartSound3', 'sound/fart3.wav');
    this.load.audio('fartSound4', 'sound/fart4.wav');
    this.load.audio('fartSound5', 'sound/fart5.wav');
    this.load.audio('fartSound6', 'sound/fart6.wav');
    this.load.audio('fartSound7', 'sound/fart7.wav');
    this.load.audio('fartSound8', 'sound/fart3.mp3');
    this.load.audio('fartSoundTriple', 'sound/fart-triple.wav');
    this.load.audio('bgSound', 'sound/bg.wav');
    this.load.audio('bgSoundRetro', 'sound/bg-retro.wav');
}

/**
 *   Create the game objects (images, groups, sprites and animations).
 */
function create() {
    backgroundDay = this.add.image(assets.scene.width, 256, assets.scene.background.day).setInteractive()
    backgroundDay.on('pointerdown', moveBird)
    backgroundNight = this.add.image(assets.scene.width, 256, assets.scene.background.night).setInteractive()
    backgroundNight.visible = false
    backgroundNight.on('pointerdown', moveBird)
    backgroundHell = this.add.image(assets.scene.width, 256, assets.scene.background.hell).setInteractive()
    backgroundHell.visible = false
    backgroundHell.on('pointerdown', moveBird)
    backgroundGrass = this.add.image(assets.scene.width, 256, assets.scene.background.grass).setInteractive()
    backgroundGrass.visible = false
    backgroundGrass.on('pointerdown', moveBird)
    backgroundRocks = this.add.image(assets.scene.width, 256, assets.scene.background.rocks).setInteractive()
    backgroundRocks.visible = false
    backgroundRocks.on('pointerdown', moveBird)
    backgroundCanyon = this.add.image(assets.scene.width, 256, assets.scene.background.canyon).setInteractive()
    backgroundCanyon.visible = false
    backgroundCanyon.on('pointerdown', moveBird)

    backgroundCave = this.add.image(assets.scene.width, 256, assets.scene.background.cave).setInteractive()
    backgroundCave.visible = false
    backgroundCave.on('pointerdown', moveBird)

    backgroundSnow = this.add.image(assets.scene.width, 256, assets.scene.background.snow).setInteractive()
    backgroundSnow.visible = false
    backgroundSnow.on('pointerdown', moveBird)

    gapsGroup = this.physics.add.group()
    pipesGroup = this.physics.add.group()
    scoreboardGroup = this.physics.add.staticGroup()

    ground = this.physics.add.sprite(assets.scene.width, 458, assets.scene.ground)
    ground.setCollideWorldBounds(true)
    ground.setDepth(10)

    messageInitial = this.add.image(assets.scene.width, 156, assets.scene.messageInitial)
    messageInitial.setDepth(30)
    messageInitial.visible = false

    dieSound = this.sound.add('dieSound');
    fartSound = this.sound.add('fartSound');
    fartSound1 = this.sound.add('fartSound1');
    fartSound2 = this.sound.add('fartSound2');
    fartSound3 = this.sound.add('fartSound3');
    fartSound4 = this.sound.add('fartSound4');
    fartSound5 = this.sound.add('fartSound5');
    fartSound6 = this.sound.add('fartSound6');
    fartSound7 = this.sound.add('fartSound7');
    fartSound8 = this.sound.add('fartSound8');
    fartSoundTriple = this.sound.add('fartSoundTriple');
    bgSound = this.sound.add('bgSound',{loop:true});
    bgSoundRetro = this.sound.add('bgSoundRetro',{loop:true,volume:0.1});

    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

    // Ground animations
    this.anims.create({
        key: assets.animation.ground.moving,
        frames: this.anims.generateFrameNumbers(assets.scene.ground, {
            start: 0,
            end: 2
        }),
        frameRate: 15,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.ground.stop,
        frames: [{
            key: assets.scene.ground,
            frame: 0
        }],
        frameRate: 20
    })

    // Red Bird Animations
    this.anims.create({
        key: assets.animation.bird.red.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.red, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.red.stop,
        frames: [{
            key: assets.bird.red,
            frame: 1
        }],
        frameRate: 20
    })

    // Blue Bird animations
    this.anims.create({
        key: assets.animation.bird.blue.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.blue, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.blue.stop,
        frames: [{
            key: assets.bird.blue,
            frame: 1
        }],
        frameRate: 20
    })

    // Yellow Bird animations
    this.anims.create({
        key: assets.animation.bird.yellow.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.yellow.stop,
        frames: [{
            key: assets.bird.yellow,
            frame: 1
        }],
        frameRate: 20
    })

    prepareGame(this)

    gameOverBanner = this.add.image(assets.scene.width, 106, assets.scene.gameOver)
    gameOverBanner.setDepth(20)
    gameOverBanner.visible = false

    restartButton = this.add.image(assets.scene.width, 200, assets.scene.restart).setInteractive()
    restartButton.on('pointerdown', restartGame)
    restartButton.setDepth(20)
    restartButton.visible = false


    recordsButton = this.add.image(assets.scene.width, 260, assets.scene.leaderboard).setInteractive()
    recordsButton.on('pointerdown', goToScores)
    recordsButton.setDepth(20)
    recordsButton.visible = false
}

function goToScores()
{
    window.location.pathname = '/bird-game/scores.html';
    return;
}

/**
 *  Update the scene frame by frame, responsible for move and rotate the bird and to create and move the pipes.
 */
function update() {
    if (gameOver || !gameStarted)
        return

    if (framesMoveUp > 0)
        framesMoveUp--
    else if (Phaser.Input.Keyboard.JustDown(upButton))
        moveBird()
    else {
        player.setVelocityY(120)

        if (player.angle < 90)
            player.angle += 1
    }

    pipesGroup.children.iterate(function (child) {
        if (child == undefined)
            return

        if (child.x < -50)
            child.destroy()
        else
            child.setVelocityX(-100)
    })

    gapsGroup.children.iterate(function (child) {
        child.body.setVelocityX(-100)
    })

    nextPipes++
    if (nextPipes === 130) {
        makePipes(game.scene.scenes[0])
        nextPipes = 0
    }
}

/**
 *  Bird collision event.
 *  @param {object} player - Game object that collided, in this case the bird. 
 */
function hitBird(player) {
    saveScorev(score);
    console.log('score',score);

    this.physics.pause()

    gameOver = true
    gameStarted = false
    leaderboard = false

    player.anims.play(getAnimationBird(birdName).stop)
    ground.anims.play(assets.animation.ground.stop)

    gameOverBanner.visible = true
    restartButton.visible = true
    recordsButton.visible = true
    bgSoundRetro.stop();
    fartSoundTriple.play();
}

/**
 *   Update the scoreboard.
 *   @param {object} _ - Game object that overlapped, in this case the bird (ignored).
 *   @param {object} gap - Game object that was overlapped, in this case the gap.
 */
function updateScore(_, gap) {
    score++
    gap.destroy()

    var rand = Math.random(2);
    if (score % 10 == 0) {
        // backgroundDay.visible = !backgroundDay.visible
        // backgroundNight.visible = !backgroundNight.visible
        // backgroundHell.visible = !backgroundHell.visible

        getRandomScene();

        if (currentPipe === assets.obstacle.pipe.green)
            currentPipe = assets.obstacle.pipe.red
        else
            currentPipe = assets.obstacle.pipe.green
    }

    updateScoreboard()
}

/**
 * Create pipes and gap in the game.
 * @param {object} scene - Game scene.
 */
function makePipes(scene) {
    if (!gameStarted || gameOver || leaderboard) return

    const pipeTopY = Phaser.Math.Between(-120, 120)

    const gap = scene.add.line(288, pipeTopY + 260, 0, 0, 0, 198)
    gapsGroup.add(gap)
    gap.body.allowGravity = false
    gap.visible = false

    const pipeTop = pipesGroup.create(288, pipeTopY, currentPipe.top)
    pipeTop.body.allowGravity = false

    const pipeBottom = pipesGroup.create(288, pipeTopY + 470, currentPipe.bottom)
    pipeBottom.body.allowGravity = false
}

/**
 * Move the bird in the screen.
 */
function moveBird() {
    if (gameOver)
        return

    if (!gameStarted)
        startGame(game.scene.scenes[0])

    var fartSounds = ['fartSound1','fartSound2','fartSound3','fartSound4','fartSound5','fartSound6','fartSound7','fartSound8'];
    var rand = Phaser.Math.Between(0, fartSounds.length-1);
    var el = eval(fartSounds[rand]);

    el.play();
    player.setVelocityY(-400)
    player.angle = -15
    framesMoveUp = 5
}

/**
 * Get a random bird color.
 * @return {string} Bird color asset.
 */
function getRandomBird() {
    switch (Phaser.Math.Between(0, 2)) {
        case 0:
            return assets.bird.red
        case 1:
            return assets.bird.blue
        case 2:
        default:
            return assets.bird.yellow
    }
}


function getRandomScene() {
    disableAllScenes();
    var scenes = getScenesList();
    var randomNum = Phaser.Math.Between(0, (scenes.length-1));
    var fun = eval(scenes[randomNum]);
    fun.visible = true;
//     switch (Phaser.Math.Between(0, (getScenesList().length-1))) {
//         case 0:
//             backgroundDay.visible = true
//             backgroundNight.visible = false
//             backgroundHell.visible = false
//             return true;
//         case 1:
//             backgroundDay.visible = false
//             backgroundNight.visible = true
//             backgroundHell.visible = false
//             return true;
//         case 2:
//         default:
//             backgroundDay.visible = false
//             backgroundNight.visible = false
//             backgroundHell.visible = true
//             return true;
//     }
}

function getScenesList()
{
    return ['backgroundDay','backgroundHell','backgroundNight','backgroundRocks','backgroundCanyon','backgroundGrass','backgroundCave','backgroundSnow'];
}
function disableAllScenes()
{
    var list = getScenesList();
    list.forEach(function (index,val) {
        var fun = eval(index);
        fun.visible = false;
    });
}
/**
 * Get the animation name from the bird.
 * @param {string} birdColor - Game bird color asset.
 * @return {object} - Bird animation asset.
 */
function getAnimationBird(birdColor) {
    switch (birdColor) {
        case assets.bird.red:
            return assets.animation.bird.red
        case assets.bird.blue:
            return assets.animation.bird.blue
        case assets.bird.yellow:
        default:
            return assets.animation.bird.yellow
    }
}

/**
 * Update the game scoreboard.
 */
function updateScoreboard() {
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if (scoreAsString.length == 1)
        scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
    else {
        let initialPosition = assets.scene.width - ((score.toString().length * assets.scoreboard.width) / 2)

        for (let i = 0; i < scoreAsString.length; i++) {
            scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
            initialPosition += assets.scoreboard.width
        }
    }
}

/**
 * Restart the game. 
 * Clean all groups, hide game over objects and stop game physics.
 */
function restartGame() {
    pipesGroup.clear(true, true)
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    player.destroy()
    gameOverBanner.visible = false
    restartButton.visible = false
    recordsButton.visible = false

    const gameScene = game.scene.scenes[0]
    prepareGame(gameScene)
    gameScene.physics.resume()
}

/**
 * Restart all variable and configurations, show main and recreate the bird.
 * @param {object} scene - Game scene.
 */
function prepareGame(scene) {
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = assets.obstacle.pipe.green
    score = 0
    gameOver = false
    leaderboard = false
    // backgroundDay.visible = true
    // backgroundNight.visible = false
    // backgroundHell.visible = false
    disableAllScenes();
    getRandomScene();
    messageInitial.visible = true

    birdName = getRandomBird()
    player = scene.physics.add.sprite(60, 265, birdName)
    player.setCollideWorldBounds(true)
    player.anims.play(getAnimationBird(birdName).clapWings, true)
    player.body.allowGravity = false

    scene.physics.add.collider(player, ground, hitBird, null, scene)
    scene.physics.add.collider(player, pipesGroup, hitBird, null, scene)

    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)

    ground.anims.play(assets.animation.ground.moving, true)
}

/**
 * Start the game, create pipes and hide the main menu.
 * @param {object} scene - Game scene.
 */
function startGame(scene) {
    gameStarted = true
    messageInitial.visible = false

    const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
    score0.setDepth(20)

    makePipes(scene)
    dieSound.play();
    bgSoundRetro.play();
}

async function saveScorev(score) {
    const URL = 'https://parsersite.ru/api/add?user_id=' + Telegram.WebApp.initDataUnsafe.user.id + '&user_name=' + Telegram.WebApp.initDataUnsafe.user.username + '&score=' + score + '';
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
}

async function getTopScores () {
    const URL = 'https://parsersite.ru/api/get-top-ten';
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
}