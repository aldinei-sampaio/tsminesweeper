module Minesweeper.View {
    export class OptionsDialog {
        private _optionsPanel: JQuery;
        private _optBegginner: JQuery;
        private _optIntermediate: JQuery;
        private _optExpert: JQuery;
        private _optCustom: JQuery;
        private _rows: JQuery;
        private _cols: JQuery;
        private _mines: JQuery;
        private _putMinesAfterFirstOpen: JQuery;

        constructor(public userOptions: UserOptions, public callback: () => void) {
        }

        private createGameModeRadioButton(container:JQuery, value: GameMode, id: string, name: string): JQuery {
            var p = $('<p/>').appendTo(container);
            var op1 = $('<input id="' + id + '" type="radio" name="options_board_size" value="' + value + '" />').appendTo(p);
            if (this.userOptions.gameMode === value) {
                op1.attr('checked', 'checked');
            }
            $('<label for="' + id + '">' + name + '</label>').appendTo(p);

            op1.bind("click", () => this.updateCustomOptions());
            return op1;
        }

        private updateCustomOptions() {
            var disabled = (!this._optCustom.is(':checked'));
            this._rows.prop("disabled", disabled);
            this._cols.prop("disabled", disabled);
            this._mines.prop("disabled", disabled);

            var values: BoardOptions;

            if (disabled) {
                values = UserOptions.getOptionsFor(this.getSelectedGameMode());
                this._rows.removeClass('invalid');
                this._cols.removeClass('invalid');
                this._mines.removeClass('invalid');
            } else {
                values = this.userOptions.customOptions;
            }

            this._rows.val(values.rows.toString());
            this._cols.val(values.cols.toString());
            this._mines.val(values.mines.toString());
        }

        private createPanel(): void {
            this._optionsPanel = $('<div/>').attr('title', 'Opções').addClass('optionsPanel');

            var table = $('<table/>')
                .appendTo(this._optionsPanel)
                .attr('cellspacing', '0')
                .attr('cellpadding', '0')
                .attr('style', 'width:100%');
            var tr = $('<td/>').appendTo(table);
            var td = $('<td/>').appendTo(tr).attr('style', 'text-align:left');

            this._optBegginner = this.createGameModeRadioButton(td, GameMode.Begginner, 'options_board_begginner', 'Iniciante');
            this._optIntermediate = this.createGameModeRadioButton(td, GameMode.Intermediate, 'options_board_intermediate', 'Intermediário');
            this._optExpert = this.createGameModeRadioButton(td, GameMode.Expert, 'options_board_expert', 'Experiente');
            this._optCustom = this.createGameModeRadioButton(td, GameMode.Custom, 'options_board_custom', 'Customizado');

            var minValues = UserOptions.getMinOptionValues();
            var maxValues = UserOptions.getMaxOptionValues();

            var td = $('<td/>').appendTo(tr).attr('style', 'text-align:right;vertical-align:middle');
            var p = $('<p/>').appendTo(td);
            $('<label for="custom_rows">Linhas (' + minValues.rows.toString() + ' a ' + maxValues.rows.toString() + '):&nbsp;</label>').appendTo(p);
            this._rows = $('<input id="custom_rows" type="text" maxlength="3"></input>').appendTo(p);

            var p = $('<p/>').appendTo(td);
            $('<label for="custom_cols">Colunas (' + minValues.cols.toString() + ' a ' + maxValues.cols.toString() + '):&nbsp;</label>').appendTo(p);
            this._cols = $('<input id="custom_cols" type="text" maxlength="3"></input>').appendTo(p);

            var p = $('<p/>').appendTo(td);
            $('<label for="custom_mines">Minas (' + minValues.mines.toString() + ' a ' + maxValues.mines.toString() + '):&nbsp;</label>').appendTo(p);
            this._mines = $('<input id="custom_mines" type="text" maxlength="3"></input>').appendTo(p);
            this.updateCustomOptions();
            
            var p = $('<p/>').appendTo(this._optionsPanel);
            this._putMinesAfterFirstOpen = $('<input id="empty_square_on_first_click" type="checkbox" value="1" />').appendTo(p);
            if (this.userOptions.putMinesAfterFirstOpen) {
                this._putMinesAfterFirstOpen.attr('checked', 'checked');
            }
            $('<label for="empty_square_on_first_click">Impedir fim de jogo no primeiro clique</label>').appendTo(p);
        }

        private validate(): boolean {
            if (!this._optCustom.is(':checked')) {
                return true;
            }

            var minValues = UserOptions.getMinOptionValues();
            var maxValues = UserOptions.getMaxOptionValues();
            
            var v1 = this.validateValue(this._rows, minValues.rows, maxValues.rows);
            var v2 = this.validateValue(this._cols, minValues.cols, maxValues.cols);
            var v3 = this.validateValue(this._mines, minValues.mines, maxValues.mines);

            return v1 && v2 && v3
        }

        private validateValue(e: JQuery, minValue: number, maxValue: number): boolean {
            var valid = false;
            var value: string = e.val();
            if (/^\d+$/.test(value)) {
                var n = parseInt(value);
                valid = n >= minValue && n <= maxValue;
            }
            if (valid) {
                e.removeClass('invalid');
            } else {
                e.addClass('invalid');
            }
            return valid;
        }

        private getSelectedGameMode(): GameMode {
            if (this._optBegginner.is(':checked')) {
                return GameMode.Begginner;
            } else if (this._optIntermediate.is(':checked')) {
                return GameMode.Intermediate;
            } else if (this._optExpert.is(':checked')) {
                return GameMode.Expert;
            } else {
                return GameMode.Custom;
            }
        }

        public show(): void {
            if (this._optionsPanel === undefined) {
                this.createPanel();
            }

            this._optionsPanel.dialog(
                {
                    modal: true,
                    width: 350,
                    buttons: {
                        "OK": () => {
                            if (!this.validate()) {
                                return;
                            }
                            this.userOptions.gameMode = this.getSelectedGameMode();
                            if (this.userOptions.gameMode === GameMode.Custom) {
                                this.userOptions.gameMode = GameMode.Custom;
                                this.userOptions.customOptions.rows = parseInt(this._rows.val());
                                this.userOptions.customOptions.cols = parseInt(this._cols.val());
                                this.userOptions.customOptions.mines = parseInt(this._mines.val());
                            }
                            this.userOptions.putMinesAfterFirstOpen = this._putMinesAfterFirstOpen.is(':checked');
                            this._optionsPanel.dialog("close");
                            this.callback();
                        },
                        "Cancelar": () => {
                            this._optionsPanel.dialog("close");
                        }
                    }
                });
        }

    }
} 