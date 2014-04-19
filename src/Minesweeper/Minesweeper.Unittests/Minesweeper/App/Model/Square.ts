module Minesweeper.Model {
    export class Square {
        private _row = 0;
        private _col = 0
        private _isOpenned = false;
        private _isFlagged = false;
        private _isUnknown = false;
        private _isTip = false;

        public onUpdate: IEvent = new TypedEvent();

        constructor(row: number, col: number) {
            this._row = row;
            this._col = col;
        }

        public hasMine = false;
        public displayNumber = 0;

        public get isFlagged() {
            return this._isFlagged;
        }

        public get isUnknown() {
            return this._isUnknown;
        }

        public open(): void {
            if (this._isOpenned) {
                return;
            }
            this._isOpenned = true;
            this.onUpdate.trigger();
        }

        get isOpenned(): boolean {
            return this._isOpenned;
        }

        public get row(): number {
            return this._row;
        }

        public get col(): number {
            return this._col;
        }

        public toggleFlag(): void {
            if (this._isFlagged) {
                this._isFlagged = false;
                this._isUnknown = true;
            } else if (this._isUnknown) {
                this._isUnknown = false;
            } else {
                this._isFlagged = true;
            }
            this.onUpdate.trigger();
        }

        public get isTip(): boolean {
            return this._isTip;
        }

        public set isTip(value: boolean) {
            if (this._isTip !== value) {
                this._isTip = value;
                this.onUpdate.trigger();
            }
        }
    }
}; 