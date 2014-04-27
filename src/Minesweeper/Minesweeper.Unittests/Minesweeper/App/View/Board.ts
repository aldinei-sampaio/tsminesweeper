module Minesweeper.View {

    export class Board {
        private _container: JQuery;
        private _field: Model.Field;
        private _cells: Cell[];
        private _topPanel: JQuery;
        private _resetButton: JQuery;
        private _optionsButton: JQuery;
        private _headerFlagCountPanel: JQuery;
        private _headerTimerPanel: JQuery;
        private _tipButton: JQuery;
        private _options = UserOptions.load();
        private _tipSpan: JQuery;
        private _optionsDialog = new OptionsDialog(this._options, () => { this._options.save(); this.reset(); });
        private _autoPlayId: number;

        constructor(container: JQuery) {
            this._container = container;
        }

        private drawFooter(table: JQuery): void {
            if (this._tipButton) {
                this._tipButton.unbind();
            }
            if (this._optionsButton) {
                this._optionsButton.unbind();
            }

            var panel = $('<div/>').appendTo($('<td/>').appendTo($('<tr/>').appendTo(table)));
            panel.addClass('footerPanel');

            var panelTable = $('<table/>')
                .appendTo(panel)
                .attr('cellspacing', '0')
                .attr('cellpadding', '0')
                .attr('style', 'width:100%');

            var tr = $('<tr/>').appendTo(panelTable);
            var td = $('<td/>').appendTo(tr);
            td.attr('style', 'text-align:left');

            if (this._options.allowTips) {
                this._tipButton = $('<button/>').appendTo(td);
                App.addImage(this._tipButton, 'Tip');
                this._tipButton.bind('click', () => {
                    if (this._field.createTip()) {
                        this._tipSpan.html('');
                    } else {
                        this._tipSpan.html('Dica não disponível');
                    }
                });
            }
            this._tipSpan = $('<span id="tip"/>').appendTo(td).addClass('tipMessage');

            var td = $('<td/>').appendTo(tr);
            td.attr('style', 'text-align:right');
            td.attr('colspan', '2');
            this._optionsButton = $('<button/>').appendTo(td);
            App.addImage(this._optionsButton, 'Options');
            this._optionsButton.bind('click', () => this._optionsDialog.show());
        }

        private updateFlagCount(): void {
            var panel = this._headerFlagCountPanel;
            panel.empty();
            App.addImage(panel, 'MineLabel');
            this.addDigits(panel, this._field.remainingFlags, 3);
        }

        private drawHeader(table: JQuery): void {
            if (this._resetButton) {
                this._resetButton.unbind();
            }

            var td = $('<td/>').appendTo($('<tr/>').appendTo(table));

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
            var boardTable = $('<table/>').appendTo($('<td/>').appendTo($('<tr/>').appendTo(table)));
            boardTable.addClass('fieldTable');
            boardTable.attr('cellspacing', '0');
            boardTable.attr('cellpadding', '0');
            for (var i = this._field.minRow; i <= this._field.maxRow; i++) {
                var tr = $('<tr/>').appendTo(boardTable);

                for (var j = this._field.minCol; j <= this._field.maxCol; j++) {
                    var td = $('<td/>').appendTo(tr).addClass('fieldCell');

                    var cell = new Cell(td, this._field.getSquare(i, j));
                    cell.onClick.add((square) => { this._field.open(square); this._tipSpan.html(''); });
                    cell.onBothClick.add((square) => { this._field.openNeighborhood(square);; this._tipSpan.html(''); });
                    cell.onRightClick.add((square) => { this.setFlag(square); this._tipSpan.html(''); });
                    this._cells.push(cell);
                }
            }
        }

        private setFlag(square: Model.Square): void {
            this._field.flag(square);
            this.updateFlagCount();
        }

        private drawFlagDisplay(td: JQuery): void {
            this._headerFlagCountPanel = $('<div/>')
                .appendTo(td)
                .addClass('flagDisplay');
            this.updateFlagCount();
        }

        private drawTimerDisplay(td: JQuery): void {
            this._headerTimerPanel = $('<div/>')
                .appendTo(td)
                .addClass('clockDisplay')
                .attr('style', 'margin-left:auto');
            this.showTimeDisplay(this._headerTimerPanel, new Model.TimerInfo(0, false));
        }

        private drawResetPanel(td: JQuery): void {
            var resetPanel = $('<div/>')
                .appendTo(td)
                .addClass('resetPanel');
            this._resetButton = $('<button/>').appendTo(resetPanel);
            App.addImage(this._resetButton, 'Ready');
            this._resetButton.bind('click', () => { this.reset() });
        }

        private addDigits(panel: JQuery, value: number, size: number) {
            var digits = value.toString().split('');
            var startDigit = digits.length - size;
            for (var n = digits.length - size; n < digits.length; n++) {
                var imageName = n < 0 ? '0' : digits[n];
                App.addImage(panel, 'Counter' + imageName);
            }
        }

        private showTimeDisplay(panel: JQuery, timerInfo: Model.TimerInfo): void {
            panel.empty();
            App.addImage(panel, 'ClockLabel');
            this.addDigits(panel, timerInfo.getMinutes(), 2);
            App.addImage(panel, timerInfo.changed ? 'PointsDark' : 'PointsLight');
            this.addDigits(panel, timerInfo.getSeconds(), 2);
        }

        public reset(): void {
            this.stopAutoPlay();
            if (this._field) {
                this._field.dispose();
            }
            if (this._cells) {
                this._cells.forEach((item) => item.dispose());
            }
            this._cells = [];

            var options = this._options.getCurrentOptions();
            this._field = new Model.Field(options.rows, options.cols);
            this._field.putMines(options.mines, this._options.putMinesAfterFirstOpen);

            this._field.onGameOver.add((result) => {
                this._resetButton.empty();
                App.addImage(this._resetButton, result ? 'Won' : 'Lost');
                if (this._tipButton) {
                    this._tipButton.prop("disabled", true);
                }
                this._cells.forEach((item) => { item.reveal(result) });
            });

            this._field.onGameStart.add(() => {
                this._resetButton.empty();
                App.addImage(this._resetButton, 'Started');
                if (this._options.autoPlay) {
                    this._autoPlayId = setInterval(() => this.runAutoPlay(), 500);
                }
            });

            this._field.onElapsedTime.add((value) => {
                this.showTimeDisplay(this._headerTimerPanel, value);
            });

            this._container.empty();
            var table = $('<table/>').appendTo(this._container).addClass('mainTable').attr('cellspacing', 0).attr('cellpadding', 0);
            this.drawHeader(table);
            this.drawCells(table);
            this.drawFooter(table);
        }

        private runAutoPlay(): void {
            var square = this._field.createTip();
            if (square) {
                switch (square.tipType) {
                    case Model.TipType.safe:
                        this._field.open(square);
                        return;
                    case Model.TipType.mine:
                        this.setFlag(square);
                        return;
                }
            }
            this.stopAutoPlay();
            this._tipSpan.html('Jogo automático interrompido');
        }

        private stopAutoPlay(): void {
            if (this._autoPlayId) {
                clearInterval(this._autoPlayId);
                this._autoPlayId = undefined;
            }
        }
    }
} 