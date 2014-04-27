module Minesweeper.View {

    export enum GameMode {
        Begginner,
        Intermediate,
        Expert,
        Custom
    }

    export class BoardOptions {
        constructor(public rows: number, public cols: number, public mines: number) {
        }

        public static clone(item: BoardOptions): BoardOptions {
            return new BoardOptions(item.rows, item.cols, item.mines);
        }
    }

    var _begginnerOptions = new BoardOptions(9, 9, 10);
    var _intermediateOptions = new BoardOptions(16, 16, 40);
    var _expertOptions = new BoardOptions(16, 30, 99);
    var _minOptionValues = new BoardOptions(8, 8, 10);
    var _maxOptionValues = new BoardOptions(24, 30, 667);

    interface IAllOptions {
        gameMode: GameMode;
        customOptions: BoardOptions;
        putMinesAfterFirstOpen: boolean;
        allowTips: boolean;
        autoPlay: boolean;
    }

    export class UserOptions  {
        private _allOptions: IAllOptions = {
            gameMode: GameMode.Begginner,
            customOptions: BoardOptions.clone(_begginnerOptions),
            putMinesAfterFirstOpen: true,
            allowTips: true,
            autoPlay: false
        };

        public get autoPlay(): boolean {
            return this._allOptions.autoPlay;
        }

        public set autoPlay(value: boolean) {
            this._allOptions.autoPlay = value;
        }

        public get gameMode(): GameMode {
            return this._allOptions.gameMode;
        }

        public set gameMode(value: GameMode) {
            this._allOptions.gameMode = value
        }

        public get customOptions(): BoardOptions {
            return this._allOptions.customOptions;
        }

        public set customOptions(value: BoardOptions) {
            this._allOptions.customOptions = value;
        }

        public get putMinesAfterFirstOpen(): boolean {
            return this._allOptions.putMinesAfterFirstOpen;
        }

        public set putMinesAfterFirstOpen(value: boolean) {
            this._allOptions.putMinesAfterFirstOpen = value;
        }

        public get allowTips(): boolean {
            return this._allOptions.allowTips;
        }

        public set allowTips(value: boolean) {
            this._allOptions.allowTips = value;
        }

        public getCurrentOptions(): BoardOptions {
            if (this.gameMode === GameMode.Custom) {
                return BoardOptions.clone(this.customOptions);
            }
            return UserOptions.getOptionsFor(this.gameMode);
        }

        public static getOptionsFor(gameMode: GameMode): BoardOptions {
            switch (gameMode) {
                case GameMode.Begginner:
                    return BoardOptions.clone(_begginnerOptions);
                case GameMode.Intermediate:
                    return BoardOptions.clone(_intermediateOptions);
                case GameMode.Expert:
                    return BoardOptions.clone(_expertOptions);
                default:
                    return BoardOptions.clone(_begginnerOptions);
            }
        }

        public static getMinOptionValues(): BoardOptions {
            return BoardOptions.clone(_minOptionValues);
        }

        public static getMaxOptionValues(): BoardOptions {
            return BoardOptions.clone(_maxOptionValues);
        }

        public static load(): UserOptions {
            var options = new UserOptions();
            if (localStorage && localStorage.getItem && JSON && JSON.parse) {
                var stored = localStorage.getItem("options");
                if (stored) {
                    options._allOptions = JSON.parse(stored);
                    return options;
                }
            }
            return options;
        }

        public save(): void {
            if (localStorage && localStorage.setItem && JSON && JSON.stringify) {
                localStorage.setItem("options", JSON.stringify(this._allOptions));
            }
        }
    }
} 