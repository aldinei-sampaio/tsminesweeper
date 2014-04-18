$(() => {
    $(document).bind("contextmenu", (e) => e.preventDefault());
    $('#version').text('Versão ' + App.version);
    App.start($('#content'));
});


class App {
    public static version = '0.1.4';

    public static addImage(container: JQuery, imageName: String): JQuery {
        return $('<img/>').attr('src', 'Images/' + imageName + '.png?' + App.version).appendTo(container);
    }

    public static start(container: JQuery) {
        container.text('Carregando...');

        var loader = new Minesweeper.View.ImageLoader();
        loader.imageList = [
            '1', '2', '3', '4', '5', '6', '7', '8',
            'Mine', 'Flag', 'Unknown', 'WrongFlag',
            'Counter0', 'Counter1', 'Counter2', 'Counter3', 'Counter4', 'Counter5', 'Counter6', 'Counter7', 'Counter8', 'Counter9',
            'Ready', 'Started', 'Won', 'Lost',
            'MineLabel', 'ClockLabel'
        ];
        loader.onLoaded.add(() => this.showBoard(container));
        loader.load()
    }

    private static showBoard(container: JQuery) {
        var board = new Minesweeper.View.Board(container);
        board.reset();
    }
}