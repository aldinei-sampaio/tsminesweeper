﻿module Minesweeper.Model {
    enum GameState {
        Ready,
        Started,
        Won,
        Lost
    }

    interface ICoordinates {
        row: number;
        col: number;
    }

    export class Field {
        private _squares: Square[][];
        private _rows = 0;
        private _cols = 0;
        private _minRow = 0;
        private _minCol = 0;
        private _maxRow = 0;
        private _maxCol = 0;
        private _openedCount = 0;
        private _squareCount = 0;
        private _state = GameState.Ready;
        private _flaggedCount = 0;
        private _mineCount = 0;
        private _elapsedTime = 0;
        private _timerId: number;
        private _putMinesLater = 0;

        public onGameOver: IMessageEvent<boolean> = new TypedEvent();
        public onGameStart: IEvent = new TypedEvent();
        public onElapsedTime: IMessageEvent<number> = new TypedEvent();

        constructor(rows: number, cols: number) {
            if (rows <= 0 || cols <= 0) {
                throw new Error('rows e cols precisam ser maiores que zero');
            }

            this._rows = rows;
            this._cols = cols;
            this._minRow = 0;
            this._maxRow = this._rows - 1;
            this._minCol = 0;
            this._maxCol = this._cols - 1;

            this._squares = [];
            this._squareCount = rows * cols;

            for (var i = 0; i < this._rows; i++) {
                this._squares[i] = [];
                for (var j = 0; j < this._cols; j++) {
                    this._squares[i].push(new Square(i, j));
                }
            }
        }

        public get remainingFlags(): number {
            return (this._mineCount + this._putMinesLater - this._flaggedCount);
        }

        public get minRow(): number {
            return this._minRow;
        }

        public get maxRow(): number {
            return this._maxRow;
        }

        public get minCol(): number {
            return this._minCol;
        }

        public get maxCol(): number {
            return this._maxCol;
        }

        public get colCount(): number {
            return this._cols;
        }

        public getSquare(row: number, col: number): Square {
            if (row < this._minRow || row > this._maxRow || col < this._minCol || col > this._maxCol) {
                throw new Error('Valor de row ou col inválido');
            }
            return this._squares[row][col];
        }

        private openableCount(): number {
            return this._squareCount - this._mineCount;
        }

        public putMines(mineCount: number, onFirstOpening: boolean = false): void {
            if (mineCount + this._mineCount > this.openableCount() - 9) {
                throw new Error('Não há espaço suficiente para o número de minas informado.');
            }
            if (onFirstOpening) {
                this._putMinesLater += mineCount;
            } else {
                this.putAllMines(mineCount);
            }
        }

        private putAllMines(mineCount: number, exceptSquare?: Square): void {
            var validateSquare: (square: Square) => boolean;

            if (exceptSquare) {
                validateSquare = (square) => !square.hasMine && !this.areNeighbors(exceptSquare, square);
            } else {
                validateSquare = (square) => !square.hasMine;
            }

            for (var n = 1; n <= mineCount; n++) {
                var square: Square;
                do {
                    var coords = this.getRandomCoordinates();
                    square = this.getSquare(coords.row, coords.col);
                } while (!validateSquare(square));
                this.putMine(square);
            }
        }

        private getRandomCoordinates(): ICoordinates {
            return this.getCoordinatesFromCellNumber(Math.floor(Math.random() * this._rows * this._cols));
        }

        private getCoordinatesFromCellNumber(cellNumber: number): ICoordinates {
            var row = Math.floor(cellNumber / this._cols);
            var col = cellNumber % this._cols;
            return { row: row, col: col };
        }

        public putMine(square: Square): void {
            if (square.hasMine) {
                return;
            }

            square.hasMine = true;
            this._mineCount++;
            this.forEachInVicinity(square, (item) => { item.displayNumber++; return false; } );
        }

        private areNeighbors(s1: Square, s2:Square): boolean {
            return s2.row >= s1.row - 1 &&
                s2.row <= s1.row + 1 &&
                s2.col >= s1.col - 1 &&
                s2.col <= s1.col + 1;
        }

        private forEachInVicinity(item: Square, callbackfn: (item: Square) => boolean) {
            for (var i = Math.max(item.row - 1, this._minRow); i <= Math.min(item.row + 1, this._maxRow); i++) {
                for (var j = Math.max(item.col - 1, this._minCol); j <= Math.min(item.col + 1, this._maxCol); j++) {
                    if (callbackfn(this.getSquare(i, j))) {
                        return;
                    }
                }
            }
        }

        private registerStart(): void {
            if (this._state != GameState.Ready) {
                return;
            }
            this._state = GameState.Started;
            this.onGameStart.trigger();

            this._elapsedTime = 1;
            this.onElapsedTime.trigger(this._elapsedTime);

            this._timerId = setInterval(() => {
                this._elapsedTime++;
                this.onElapsedTime.trigger(this._elapsedTime);
                if (this._elapsedTime == 999) {
                    this.stopTimer();
                }
            }, 1000);
        }

        public open(square: Square): void {
            if (this._putMinesLater > 0) {
                this.putAllMines(this._putMinesLater, square);
                this._putMinesLater = 0;
            }

            this.registerStart();

            square.open();

            if (square.hasMine) {
                this.stopTimer();
                this._state = GameState.Lost;
                this.onGameOver.trigger(false);
                return;
            }

            this._openedCount++;

            if (square.displayNumber == 0) {
                this.openAllNeighbors(square);
            } else {
                this.openEmptyNeighbors(square);
            }

            if (this._openedCount == this.openableCount()) {
                this.stopTimer();
                this._state = GameState.Won;
                this.onGameOver.trigger(true);
            }
        }

        private openEmptyNeighbors(square: Square) : void {
            this.forEachInVicinity(square, (item) => {
                if (!item.isOpenned && !item.isFlagged && !item.hasMine && item.displayNumber == 0) {
                    item.open();
                    this._openedCount++;
                    this.openAllNeighbors(item);      
                }
                return (this._state == GameState.Won || this._state == GameState.Lost);
            });
        }

        private openAllNeighbors(square: Square): void {
            this.forEachInVicinity(square, (item) => {
                if (!item.isOpenned && !item.isFlagged && !item.hasMine) {
                    item.open();
                    this._openedCount++;
                    if (item.displayNumber == 0) {
                        this.openAllNeighbors(item);
                    }
                }
                return (this._state == GameState.Won || this._state == GameState.Lost);
            });
        }

        private stopTimer(): void {
            if (!(this._timerId === undefined)) {
                clearInterval(this._timerId);
                this._timerId = undefined;
            }
        }

        public dispose(): void {
            this.stopTimer();
            if (this._squares) {
                this._squares.forEach((i)=>i.forEach((item) => item.onUpdate.remove()));
            }
            this.onGameOver.remove();
            this.onGameStart.remove();
            this.onElapsedTime.remove();
        }

        public openNeighborhood(square: Square): void {
            var flagsFound = 0;
            this.forEachInVicinity(square, (item) => {
                if (!item.isOpenned && item.isFlagged) {
                    flagsFound++;
                }
                return false;
            });
            if (flagsFound < square.displayNumber) {
                return;
            };
            this.forEachInVicinity(square, (item) => {
                if (!item.isOpenned && !item.isFlagged) {
                    this.open(item);
                }
                return false;
            });
        }

        public flag(square: Square): void {
            if (square.isFlagged) {
                this._flaggedCount--;
            } else if (!square.isUnknown) {
                if (this.remainingFlags <= 0) {
                    return;
                }
                this._flaggedCount++;
            }
            this.registerStart();
            square.toggleFlag();
        }

        public createTip(): Square {
            if (this._openedCount == 0) {
                return undefined;
            }

            var startingPoing = this.getRandomCoordinates();
            var square = this.traverseFrom(this.getRandomCoordinates(), (s) => this.checkIfCanBeATip(s));

            if (square) {
                square.isTip = true;
                return square;
            } else {
                return undefined;
            }
        }

        private checkIfCanBeATip(square: Square): Square {
            if (!square.isOpenned) {
                return undefined;
            }

            var flagCount = 0;
            var closedNeighbors = 0;
            var candidate: Square;
            this.forEachInVicinity(square, (square) => {
                if (!square.isOpenned) {
                    if (square.isFlagged) {
                        flagCount++;
                    } else if (!square.isTip) {
                        closedNeighbors++;
                        candidate = square;
                    }
                }
                return false;
            });

            if (closedNeighbors === 0) {
                return undefined;
            }

            if (square.displayNumber === flagCount) {
                return candidate;
            }

            return undefined;
        }

        private traverseFrom(coords: ICoordinates, callback: (square: Square) => Square): Square {
            var maxCellNumber = this._rows * this._cols - 1;
            var coordsCellNumber = this._cols * coords.row + coords.col;

            var n = coordsCellNumber;
            do {
                var coords = this.getCoordinatesFromCellNumber(n);
                var square = callback(this.getSquare(coords.row, coords.col));
                if (square) {
                    return square;
                }
                n++;
                if (n > maxCellNumber) {
                    n = 0;
                }
            } while (n !== coordsCellNumber);
            return undefined;
        }

        private checkForBombs(square: Square): void {
            if (!square.isOpenned) {
                return;
            }
            var closedCount = 0;
            var tip: Square;
            this.forEachInVicinity(square, (item) => {
                if (!item.isOpenned) {
                    tip = item;
                    closedCount++;
                    if (closedCount > square.displayNumber) {
                        return true;
                    }
                }
                return false;
            });
            if (closedCount > square.displayNumber) {
                //return tip;
            } else {
                return undefined;
            }
        }
    }
};