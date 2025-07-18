let game, scores;
class Highscore extends Phaser.Scene {
    constructor() {
        super({
            key: 'Highscore',
            active: true
        });
        this.scores = [];
    }
    preload() {
        //this.load.image('knighthawks', 'assets/fonts/fon3.png')
    }
    create() {

        // var config = {
        //     image: 'knighthawks',
        //     width: 16,
        //     height: 16,
        //     chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
        //     charsPerRow: 20,
        //     spacing: { x: 1, y: 1 }
        // };

        // this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        //this.add.bitmapText(10, 20, 'knighthawks', 'RANK  SCORE  NAME  DATE').setTint(0xffffff);
        this.add.text(10, 20, `#  SCORE  NAME  DATE`, { fontFamily: 'Arial', fontSize: 20, color: '#00ff00' });
        for (let i = 1; i < 11; i++) {
            if (scores[i-1]) {
                this.add.text(10, 50 * i, ` ${i}  ${scores[i-1].score}  ${scores[i-1].user_name}  ${scores[i-1].date}`, { fontFamily: 'Arial', fontSize: 20, color: '#00ff00' });
                // this.add.bitmapText(10, 50 * i, 'knighthawks', ` ${i}  ${scores[i-1].score}  ${scores[i-1].user_name}  ${scores[i-1].date}`).setTint(0xffffff);
            } else {
                // this.add.bitmapText(10, 50 * i, 'knighthawks', ` ${i}      0    ---`).setTint(0xffffff);
                this.add.text(10, 50 * i, ` ${i}  -  -  -`, { fontFamily: 'Arial', fontSize: 20, color: '#00ff00' });
            }
        }
    }
}
let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [Highscore]
};
$.ajax({
    type: 'GET',
    url: 'https://parsersite.ru/api/get-top-ten',
    success: function(data) {
        game = new Phaser.Game(config);
        scores = data;
    },
    error: function(xhr) {
        console.log(xhr);
    }
});