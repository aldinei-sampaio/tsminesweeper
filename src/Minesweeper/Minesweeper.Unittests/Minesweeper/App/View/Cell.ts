module Minesweeper.View {
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

            if (this._square.isTip) {
                div.addClass('tip');
            }

            if (this._square.hasMine) {
                App.addImage(div, 'Mine');
            } else if (mines == 0) {
                div.html('&nbsp;');
            } else {
                App.addImage(div, mines.toString());

                if (isEnabled) {
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
            if (this._square.isTip) {
                div.addClass('tip');
            }

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
            if (this._square.hasMine) {
                this._container.addClass('exploded');
            }
        }

        private resetAndCreateDiv(): JQuery {
            if (this._button) {
                this._button.unbind();
            }

            this._container.empty();
            this._container.removeClass();
            this._container.unbind();

            return $('<div/>').appendTo(this._container).addClass('fieldCell');
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