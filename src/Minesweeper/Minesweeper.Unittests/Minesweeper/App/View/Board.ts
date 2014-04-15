module Minesweeper.View {
    enum GameMode {
        Begginner,
        Intermediate,
        Expert,
        Custom
    }

    export class Board {
        private _container: JQuery;
        private _field: Model.Field;
        private _cells: Cell[];
        private _topPanel: JQuery;
        private _resetButton: JQuery;
        private _optionsButton: JQuery;
        private _gameMode = GameMode.Begginner;
        private _optionsPanel: JQuery;
        private _headerFlagCountPanel: JQuery;
        private _headerTimerPanel: JQuery;

        constructor(container: JQuery) {
            this._container = container;
        }

        private drawField(): void {
            if (this._cells) {
                this._cells.forEach((item) => { item.onClick.remove(); });
            }
            this._cells = [];
            this._container.empty();

            this.drawOptionsButton();

            var table = $('<table/>').appendTo(this._container).addClass('fieldTable');

            this.drawHeader(table);
            this.drawCells(table);
        }

        private drawOptionsButton(): void {
            if (this._optionsButton) {
                this._optionsButton.unbind();
            }
            this._optionsButton = $('<button/>')
                .appendTo(this._container)
                .text('Opções...')
                .bind('click', () => this.showOptionsDialog());
        }

        private showOptionsDialog(): void {
            if (this._optionsPanel === undefined) {
                this._optionsPanel = $('<div/>').attr('title', 'Opções').addClass('optionsPanel');

                var p = $('<p/>').appendTo(this._optionsPanel);
                var op1 = $('<input id="options_board_size_1" type="radio" name="options_board_size" value="1" />').appendTo(p);
                if (this._gameMode == GameMode.Begginner) {
                    op1.attr('checked', 'checked');
                }
                $('<label for="options_board_size_1">Iniciante</label>').appendTo(p);

                p = $('<p/>').appendTo(this._optionsPanel);
                var op2 = $('<input id="options_board_size_2" type="radio" name="options_board_size" value="2" />').appendTo(p);
                if (this._gameMode == GameMode.Intermediate) {
                    op2.attr('checked', 'checked');
                }
                $('<label for="options_board_size_2">Intermediário</label>').appendTo(p);

                var p = $('<p/>').appendTo(this._optionsPanel);
                var op3 = $('<input id="options_board_size_3" type="radio" name="options_board_size" value="3" />').appendTo(p);
                if (this._gameMode == GameMode.Expert) {
                    op3.attr('checked', 'checked');
                }
                $('<label for="options_board_size_3">Experiente</label>').appendTo(p);
            }

            this._optionsPanel.dialog(
                {
                    modal: true,
                    buttons: {
                        "OK": () => {
                            this._optionsPanel.dialog("close");
                            if ($('#options_board_size_1').is(':checked')) {
                                this._gameMode = GameMode.Begginner;
                            } else if ($('#options_board_size_2').is(':checked')) {
                                this._gameMode = GameMode.Intermediate;
                            } else {
                                this._gameMode = GameMode.Expert;
                            }
                            this.reset();
                        },
                        "Cancelar": () => {
                            this._optionsPanel.dialog("close");
                        }
                    }
                });
        }

        private updateFlagCount(): void {
            this.showDisplay(this._headerFlagCountPanel, this._field.remainingFlags, 'MineLabel');
        }

        private drawHeader(table: JQuery): void {
            if (this._resetButton) {
                this._resetButton.unbind();
            }

            var td = $('<td/>').appendTo($('<tr/>').appendTo(table));
            td.attr('colspan', this._field.colCount.toString());

            this._topPanel = $('<div/>').appendTo(td);
            this._topPanel.addClass('headerPanel');

            var panelTable = $('<table/>')
                .appendTo(this._topPanel)
                .attr('cellspacing', '0')
                .attr('cellpadding', '0')
                .attr('style', 'width:100%');
            
            var panelTr = $('<tr/>').appendTo(panelTable);

            this.drawFlagDisplay($('<td/>').appendTo(panelTr));
            this.drawResetPanel($('<td/>').appendTo(panelTr));
            this.drawTimerDisplay($('<td/>').appendTo(panelTr));
        }

        private drawCells(table: JQuery): void {
            for (var i = this._field.minRow; i <= this._field.maxRow; i++) {
                var tr = $('<tr/>').appendTo(table);

                for (var j = this._field.minCol; j <= this._field.maxCol; j++) {
                    var td = $('<td/>').appendTo(tr).addClass('fieldCell');

                    var cell = new Cell(td, this._field.getSquare(i, j));
                    cell.onClick.add((square) => this._field.open(square));
                    cell.onBothClick.add((square) => this._field.openNeighborhood(square));
                    cell.onRightClick.add((square) => { this._field.flag(square); this.updateFlagCount() });
                    this._cells.push(cell);
                }
            }
        }

        private drawFlagDisplay(td: JQuery): void {
            this._headerFlagCountPanel = $('<div/>')
                .appendTo(td)
                .addClass('headerDisplay');
            this.updateFlagCount();
        }

        private drawTimerDisplay(td: JQuery): void {
            this._headerTimerPanel = $('<div/>')
                .appendTo(td)
                .addClass('headerDisplay')
                .attr('style', 'margin-left:auto');
            this.showDisplay(this._headerTimerPanel, 0, 'ClockLabel');
        }

        private drawResetPanel(td: JQuery): void {
            var resetPanel = $('<div/>')
                .appendTo(td)
                .addClass('resetPanel');
            this._resetButton = $('<button/>').appendTo(resetPanel);
            this.addImage(this._resetButton, 'Ready');
            this._resetButton.bind('click', () => { this.reset() });
        }

        private showDisplay(panel: JQuery, value: number, labelImage : string): void {
            panel.empty();

            this.addImage(panel, labelImage);

            var digits = value.toString().split('');
            var startDigit = digits.length - 3;
            for (var n = digits.length - 3; n < digits.length; n++) {
                var imageName = n < 0 ? '0' : digits[n];
                this.addImage(panel, 'Counter' + imageName);
            }
        }

        private addImage(container: JQuery, imageName: String) {
            container.append($('<img/>').attr('src', 'Images/' + imageName + '.png'));
        }

        public reset(): void {
            if (this._field) {
                this._field.dispose();
            }
            if (this._cells) {
                this._cells.forEach((item) => item.dispose());
            }

            switch (this._gameMode) {
                case GameMode.Begginner:
                    this._field = new Model.Field(9, 9);
                    this._field.putMines(10);
                    break;
                case GameMode.Intermediate:
                    this._field = new Model.Field(16, 16);
                    this._field.putMines(40);
                    break;
                case GameMode.Expert:
                    this._field = new Model.Field(16, 30);
                    this._field.putMines(99);
                    break;
                case GameMode.Custom:
                    this._field = new Model.Field(6, 6);
                    this._field.putMine(this._field.getSquare(0, 3));
                    this._field.putMine(this._field.getSquare(1, 5));
                    this._field.putMine(this._field.getSquare(2, 0));
                    this._field.putMine(this._field.getSquare(3, 0));
                    this._field.putMine(this._field.getSquare(4, 5));
                    this._field.putMine(this._field.getSquare(5, 0));
                    this._field.putMine(this._field.getSquare(5, 1));
                    this._field.putMine(this._field.getSquare(5, 3));
                    break;
                default:
                    throw ('Gamemode não definido');
            }

            this._field.onGameOver.add((result) => {
                this._resetButton.empty();
                this.addImage(this._resetButton, result ? 'Won' : 'Lost');
                this._cells.forEach((item) => { item.reveal(result) });
            });

            this._field.onGameStart.add(() => {
                this._resetButton.empty();
                this.addImage(this._resetButton, 'Started');
            });

            this._field.onElapsedTime.add((value) => {
                this.showDisplay(this._headerTimerPanel, value, 'ClockLabel');
            });

            this.drawField();
        }
    }
} 