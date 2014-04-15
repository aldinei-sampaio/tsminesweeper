$(() => {
    $(document).bind("contextmenu", (e) => e.preventDefault());

    var container = $('#content');
    container.text('Carregando...');

    var loader = new Minesweeper.View.ImageLoader();
    loader.imageList = [
        '1', '2', '3', '4', '5', '6', '7', '8',
        'Mine', 'Flag', 'Unknown', 'WrongFlag',
        'Counter0', 'Counter1', 'Counter2', 'Counter3', 'Counter4', 'Counter5', 'Counter6', 'Counter7', 'Counter8', 'Counter9',
        'Ready', 'Started', 'Won', 'Lost',
        'MineLabel', 'ClockLabel'
    ];
    loader.onLoaded.add(() => startGame());
    loader.load()

    function startGame() {
        var board = new Minesweeper.View.Board(container);
        board.reset();
    }
});