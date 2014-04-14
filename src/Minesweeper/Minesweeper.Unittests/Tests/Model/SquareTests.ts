module Minesweeper.Model {
    export class SquareTests extends tsUnit.TestClass {

        constructorTest(): void {
            var target = new Square(2, 5);
            this.areEqual(2, target.row);
            this.areEqual(5, target.col);

            var target = new Square(9, 7);
            this.areEqual(9, target.row);
            this.areEqual(7, target.col);

            var target = new Square(0, 0);
            this.areEqual(0, target.row);
            this.areEqual(0, target.col);
        }

        toggleFlagTest(): void {
            var target = new Square(0, 0);
            this.isFalse(target.isFlagged);
            this.isFalse(target.isUnknown);

            target.toggleFlag();
            this.isTrue(target.isFlagged);
            this.isFalse(target.isUnknown);

            target.toggleFlag();
            this.isFalse(target.isFlagged);
            this.isTrue(target.isUnknown);

            target.toggleFlag();
            this.isFalse(target.isFlagged);
            this.isFalse(target.isUnknown);

            target.toggleFlag();
            this.isTrue(target.isFlagged);
            this.isFalse(target.isUnknown);

            target.toggleFlag();
            this.isFalse(target.isFlagged);
            this.isTrue(target.isUnknown);

            target.toggleFlag();
            this.isFalse(target.isFlagged);
            this.isFalse(target.isUnknown);
        }

        openTest(): void {
            var target = new Square(0, 0);
            this.isFalse(target.isOpenned);

            target.open();
            this.isTrue(target.isOpenned);
        }

        onUpdate_OpenTest(): void {
            var target = new Square(0, 0);
            var eventRunned = false;
            target.onUpdate.add(() => eventRunned = true);
            target.open();
            this.isTrue(target.isOpenned);
            this.isTrue(eventRunned);
        }

        onUpdate_ToggleFlagTest(): void {
            var target = new Square(0, 0);
            var eventRunned = false;
            target.onUpdate.add(() => eventRunned = true);
            for (var n = 0; n < 6; n++) {
                eventRunned = false;
                target.toggleFlag();
                this.isTrue(eventRunned);
            }
        }
    }
}