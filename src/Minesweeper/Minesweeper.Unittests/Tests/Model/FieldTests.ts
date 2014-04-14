module Minesweeper.Model {
    export class FieldTests extends tsUnit.TestClass {
        constructorTest(): void {
            var target = new Field(2, 2);
            this.areEqual(2, target.colCount);
            this.areEqual(1, target.maxCol);
            this.areEqual(1, target.maxRow);
            this.areEqual(0, target.minCol);
            this.areEqual(0, target.minRow);
            this.areEqual(0, target.remainingFlags);

            var target = new Field(3, 5);
            this.areEqual(5, target.colCount);
            this.areEqual(4, target.maxCol);
            this.areEqual(2, target.maxRow);
            this.areEqual(0, target.minCol);
            this.areEqual(0, target.minRow);
            this.areEqual(0, target.remainingFlags);
        }

        constructorValidationTest(): void {
            this.throws(() => new Field(0, 0));
            this.throws(() => new Field(0, 2));
            this.throws(() => new Field(2, 0));
            this.throws(() => new Field(-1, -5));
            this.throws(() => new Field(-2, 4));
            this.throws(() => new Field(6, -3));
        } 

        getSquareTest(): void {
            var target = new Field(6, 7);
            var testsDone = 0;
            for (var i = 0; i <= target.maxRow; i++) {
                for (var j = 0; j <= target.maxCol; j++) {
                    var item = target.getSquare(i, j);
                    this.areEqual(i, item.row);
                    this.areEqual(j, item.col);
                    testsDone++;
                }
            }
            this.areEqual(42, testsDone);

            this.throws(() => target.getSquare(-4, 0));
            this.throws(() => target.getSquare(0, -3));
            this.throws(() => target.getSquare(-1, -2));
            this.throws(() => target.getSquare(target.maxRow + 1, 0));
            this.throws(() => target.getSquare(0, target.maxCol + 1));
            this.throws(() => target.getSquare(target.maxRow + 1, target.maxCol + 1));
        }


    }
}
 