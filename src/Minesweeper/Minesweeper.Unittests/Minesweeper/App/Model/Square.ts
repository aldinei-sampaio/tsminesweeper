module Minesweeper.Model {
    export enum TipType {
        none = 0,
        safe = 1,
        mine = 2
    }

    export class Square {
        private _row = 0;
        private _col = 0
        private _isOpenned = false;
        private _isFlagged = false;
        private _isUnknown = false;
        private _tipType = TipType.none;

        public onUpdate: IEvent = new TypedEvent();

        constructor(row: number, col: number) {
            this._row = row;
            this._col = col;
        }

        public hasMine = false;
        public hasExploded = false;
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
            if (this.hasMine) {
                this.hasExploded = true;
            }
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

        public get tipType(): TipType {
            return this._tipType;
        }

        public set tipType(value: TipType) {
            if (this._tipType !== value) {
                this._tipType = value;
                this.onUpdate.trigger();
            }
        }
    }
}; 