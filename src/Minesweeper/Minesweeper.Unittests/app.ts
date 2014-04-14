$(() => {
    var test = new tsUnit.Test();

    test.addTestClass(new Minesweeper.Model.SquareTests(), 'Minesweeper.Model.SquareTests');
    test.addTestClass(new Minesweeper.Model.FieldTests(), 'Minesweeper.Model.FieldTests');

    test.showResults($('#content').get(0), test.run());
});