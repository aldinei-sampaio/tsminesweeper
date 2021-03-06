﻿module Minesweeper.View {
    export class Cell {
        private _square: Model.Square;
        private _container: JQuery;
        private _button: JQuery;

        public onClick: Model.IMessageEvent<Model.Square> = new Model.TypedEvent();
        public onRightClick: Model.IMessageEvent<Model.Square> = new Model.TypedEvent();
        public onBothClick: Model.IMessageEvent<Model.Square> = new Model.TypedEvent();

        constructor(container: JQuery, square: Model.Square) {
            this._container = container;
            this._square = square;
            this._square.onUpdate.add(() => { this.draw() });
            this.draw();
        }

        public dispose(): void {
            this._container.unbind();
            if (this._button) {
                this._button.unbind();
            }

            this.onClick.remove();
            this.onRightClick.remove();
            this.onBothClick.remove();
        }

        private draw(): void {
            this._container.unbind();
            if (this._square.isOpenned) {
                this.showOpennedSquare(true);
                if (this._square.hasExploded) {
                    this._container.addClass('exploded');
                } else {
                    this._container.addClass('openned');
                }
            } else if (this._square.isFlagged) {
                this.showButton(true);
                this.showFlag();
            } else if (this._square.isUnknown) {
                this.showButton(true);
                this.showUnknown();
            } else {
                this.showButton(true);
            }
        }

        private showFlag(): void {
            this._button.empty();
            App.addImage(this._button, 'Flag');
        }

        private showUnknown(): void {
            this._button.empty();
            App.addImage(this._button, 'Unknown');
        }

        private showWrongFlag(): void {
            this._button.empty();
            App.addImage(this._button, 'WrongFlag');
        }

        private showOpennedSquare(isEnabled: boolean): void {
            var div = this.resetAndCreateDiv();
            var mines = this._square.displayNumber;

            if (this._square.hasMine) {
                App.addImage(div, 'Mine');
            } else if (mines == 0) {
                div.html('&nbsp;');
            } else {
                var imageName = this._square.hasNeighborsClosed ? mines.toString() : mines.toString() + 'a';
                App.addImage(div, imageName);

                if (isEnabled && this._square.hasNeighborsClosed) {
                    this._container.bind('mouseup', (e) => {
                        if (this._leftClicked && this._rightClicked) {
                            this.onBothClick.trigger(this._square);
                        }
                        this._leftClicked = false;
                        this._rightClicked = false;
                    });

                    this._container.bind('mousedown', (e) => {
                        switch (e.which) {
                            case 1:
                                this._leftClicked = true;
                                break;
                            case 3:
                                this._rightClicked = true;
                                break;
                        }
                    })
                }
            }
        }


        private _leftClicked = false;
        private _rightClicked = false;

        private showButton(isEnabled: boolean): void {
            var div = this.resetAndCreateDiv();

            this._button = $('<a/>').appendTo(div).attr('href','javascript:void(0)');
            this._button.html('&nbsp;');
            if (isEnabled) {
                this._button.bind('click', (e) => this.processClick());
                this._button.bind('mousedown', (e) => {
                    if (e.which == 3) {
                        this.onRightClick.trigger(this._square);
                    }
                    e.preventDefault();
                });
            } else {
                this._button.prop("disabled", true);
            }
        }

        private processClick(): void {
            if (this._square.isFlagged) {
                return;
            }
            this.onClick.trigger(this._square);
        }

        private resetAndCreateDiv(): JQuery {
            if (this._button) {
                this._button.unbind();
            }

            this._container.empty();
            this._container.removeClass();
            this._container.unbind();

            var div = $('<div/>').appendTo(this._container).addClass('fieldCell');

            if (this._square.tipType === Model.TipType.safe) {
                div.addClass('tip_safe');
            } else if (this._square.tipType === Model.TipType.mine) {
                div.addClass('tip_mine');
            }

            return div;
        }

        public reveal(showMinesAsFlags: boolean): void {
            if (this._square.isOpenned) {
                return;
            }
            if (this._square.hasMine) {
                if (!this._square.isFlagged && !showMinesAsFlags) {
                    this.showOpennedSquare(false);
                    return;
                }
            } else if (this._square.isFlagged) {
                this.showWrongFlag();
            }
            this._button.attr("disabled", "disabled");
            this._button.unbind();
        }
    }
} 