class App {
    public static version = '0.1.6';

    public static addImage(container: JQuery, imageName: String): JQuery {
        return $('<img/>').attr('src', 'Images/' + imageName + '.png?' + App.version).appendTo(container);
    }

    public static start(container: JQuery) {
        container.text('Carregando...');

        var loader = new Minesweeper.View.ImageLoader();
        loader.imageList = [
            '1', '2', '3', '4', '5', '6', '7', '8',
            '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a',
            'Mine', 'Flag', 'Unknown', 'WrongFlag',
            'Counter0', 'Counter1', 'Counter2', 'Counter3', 'Counter4', 'Counter5', 'Counter6', 'Counter7', 'Counter8', 'Counter9',
            'Ready', 'Started', 'Won', 'Lost',
            'MineLabel', 'ClockLabel', 'Tip', 'Options',
            'NormalButtonReady', 'NormalButtonHover', 'NormalButtonPressed', 'NormalButtonDisabled',
            'TipButtonReady', 'TipButtonHover', 'TipButtonPressed', 'TipButtonDisabled', 'TipGreen',
            'TipRedButtonReady', 'TipRedButtonHover', 'TipRedButtonPressed', 'TipRedButtonDisabled', 'TipRed',
            'PointsLight', 'PointsDark'
        ];
        loader.onLoaded.add(() => this.showBoard(container));
        loader.load()
    }

    private static showBoard(container: JQuery) {
        this.preLoadGame();
        var board = new Minesweeper.View.Board(container);
        board.reset();
    }

    private static preLoadGame(): void {
        var field = new Minesweeper.Model.Field(3, 3);
        field.putMine(field.getSquare(0, 0));
        field.open(field.getSquare(1, 1));
        field.dispose();
    }
}