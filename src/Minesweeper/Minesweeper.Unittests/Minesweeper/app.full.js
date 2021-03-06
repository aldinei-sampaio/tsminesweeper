﻿var App = (function () {
    function App() {
    }
    App.addImage = function (container, imageName) {
        return $('<img/>').attr('src', 'Images/' + imageName + '.png?' + App.version).appendTo(container);
    };

    App.start = function (container) {
        var _this = this;
        container.text('Carregando...');

        var loader = new Minesweeper.View.ImageLoader();
        loader.imageList = [
            '1', '2', '3', '4', '5', '6', '7', '8',
            '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a',
            'Mine', 'Flag', 'Unknown', 'WrongFlag',
            'Counter0', 'Counter1', 'Counter2', 'Counter3', 'Counter4', 'Counter5', 'Counter6', 'Counter7', 'Counter8', 'Counter9',
            'Ready', 'Started', 'Won', 'Lost',
            'MineLabel', 'ClockLabel', 'Tip', 'Options',
            'NormalButtonReady', 'NormalButtonHover', 'NormalButtonPressed', 'NormalButtonDisabled',
            'TipButtonReady', 'TipButtonHover', 'TipButtonPressed', 'TipButtonDisabled', 'TipGreen',
            'TipRedButtonReady', 'TipRedButtonHover', 'TipRedButtonPressed', 'TipRedButtonDisabled', 'TipRed',
            'PointsLight', 'PointsDark'
        ];
        loader.onLoaded.add(function () {
            return _this.showBoard(container);
        });
        loader.load();
    };

    App.showBoard = function (container) {
        this.preLoadGame();
        var board = new Minesweeper.View.Board(container);
        board.reset();
    };

    App.preLoadGame = function () {
        var field = new Minesweeper.Model.Field(3, 3);
        field.putMine(field.getSquare(0, 0));
        field.open(field.getSquare(1, 1));
        field.dispose();
    };
    App.version = '0.1.6';
    return App;
})();
var Minesweeper;
(function (Minesweeper) {
    (function (Model) {
        var TypedEvent = (function () {
            function TypedEvent() {
                this._listeners = [];
            }
            TypedEvent.prototype.add = function (listener) {
                this._listeners.push(listener);
            };
            TypedEvent.prototype.remove = function (listener) {
                if (typeof listener === 'function') {
                    for (var i = 0, l = this._listeners.length; i < l; l++) {
                        if (this._listeners[i] === listener) {
                            this._listeners.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this._listeners = [];
                }
            };

            TypedEvent.prototype.trigger = function () {
                var a = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    a[_i] = arguments[_i + 0];
                }
                var context = {};
                var listeners = this._listeners.slice(0);
                for (var i = 0, l = listeners.length; i < l; i++) {
                    listeners[i].apply(context, a || []);
                }
            };
            return TypedEvent;
        })();
        Model.TypedEvent = TypedEvent;

        
    })(Minesweeper.Model || (Minesweeper.Model = {}));
    var Model = Minesweeper.Model;
})(Minesweeper || (Minesweeper = {}));
var Minesweeper;
(function (Minesweeper) {
    (function (Model) {
        var GameState;
        (function (GameState) {
            GameState[GameState["Ready"] = 0] = "Ready";
            GameState[GameState["Started"] = 1] = "Started";
            GameState[GameState["Won"] = 2] = "Won";
            GameState[GameState["Lost"] = 3] = "Lost";
        })(GameState || (GameState = {}));

        var TimerInfo = (function () {
            function TimerInfo(elapsedTime, changed) {
                this.elapsedTime = elapsedTime;
                this.changed = changed;
            }
            TimerInfo.prototype.getSeconds = function () {
                return this.elapsedTime % 60;
            };

            TimerInfo.prototype.getMinutes = function () {
                return Math.floor(this.elapsedTime / 60);
            };
            return TimerInfo;
        })();
        Model.TimerInfo = TimerInfo;

        var Field = (function () {
            function Field(rows, cols) {
                this._rows = 0;
                this._cols = 0;
                this._minRow = 0;
                this._minCol = 0;
                this._maxRow = 0;
                this._maxCol = 0;
                this._openedCount = 0;
                this._squareCount = 0;
                this._state = 0 /* Ready */;
                this._flaggedCount = 0;
                this._mineCount = 0;
                this._putMinesLater = 0;
                this.onGameOver = new Model.TypedEvent();
                this.onGameStart = new Model.TypedEvent();
                this.onElapsedTime = new Model.TypedEvent();
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

                for (var i = this.minRow; i <= this.maxRow; i++) {
                    this._squares[i] = [];
                    var rowCorner = (i === this.minRow || i === this.maxRow);
                    for (var j = this.minCol; j <= this.maxCol; j++) {
                        var colCorner = (j === this.minCol || j === this.maxCol);
                        var neighbors = rowCorner ? (colCorner ? 3 : 5) : (colCorner ? 5 : 8);
                        this._squares[i].push(new Model.Square(i, j, neighbors));
                    }
                }
            }
            Object.defineProperty(Field.prototype, "remainingFlags", {
                get: function () {
                    return (this._mineCount + this._putMinesLater - this._flaggedCount);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Field.prototype, "minRow", {
                get: function () {
                    return this._minRow;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Field.prototype, "maxRow", {
                get: function () {
                    return this._maxRow;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Field.prototype, "minCol", {
                get: function () {
                    return this._minCol;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Field.prototype, "maxCol", {
                get: function () {
                    return this._maxCol;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Field.prototype, "colCount", {
                get: function () {
                    return this._cols;
                },
                enumerable: true,
                configurable: true
            });

            Field.prototype.getSquare = function (row, col) {
                if (row < this._minRow || row > this._maxRow || col < this._minCol || col > this._maxCol) {
                    throw new Error('Valor de row ou col inválido');
                }
                return this._squares[row][col];
            };

            Field.prototype.openableCount = function () {
                return this._squareCount - this._mineCount;
            };

            Field.prototype.putMines = function (mineCount, onFirstOpening) {
                if (typeof onFirstOpening === "undefined") { onFirstOpening = false; }
                if (mineCount + this._mineCount > this.openableCount() - 9) {
                    throw new Error('Não há espaço suficiente para o número de minas informado.');
                }
                if (onFirstOpening) {
                    this._putMinesLater += mineCount;
                } else {
                    this.putAllMines(mineCount);
                }
            };

            Field.prototype.putAllMines = function (mineCount, exceptSquare) {
                var _this = this;
                var validateSquare;

                if (exceptSquare) {
                    validateSquare = function (square) {
                        return !square.hasMine && !_this.areNeighbors(exceptSquare, square);
                    };
                } else {
                    validateSquare = function (square) {
                        return !square.hasMine;
                    };
                }

                for (var n = 1; n <= mineCount; n++) {
                    var square;
                    do {
                        var coords = this.getRandomCoordinates();
                        square = this.getSquare(coords.row, coords.col);
                    } while(!validateSquare(square));
                    this.putMine(square);
                }
            };

            Field.prototype.getRandomCoordinates = function () {
                return this.getCoordinatesFromCellNumber(Math.floor(Math.random() * this._rows * this._cols));
            };

            Field.prototype.getCoordinatesFromCellNumber = function (cellNumber) {
                var row = Math.floor(cellNumber / this._cols);
                var col = cellNumber % this._cols;
                return { row: row, col: col };
            };

            Field.prototype.putMine = function (square) {
                if (square.hasMine) {
                    return;
                }

                square.hasMine = true;
                this._mineCount++;
                this.forEachInVicinity(square, function (item) {
                    item.displayNumber++;
                    return false;
                });
            };

            Field.prototype.areNeighbors = function (s1, s2) {
                return s2.row >= s1.row - 1 && s2.row <= s1.row + 1 && s2.col >= s1.col - 1 && s2.col <= s1.col + 1;
            };

            Field.prototype.forEachInVicinity = function (item, callbackfn) {
                for (var i = Math.max(item.row - 1, this._minRow); i <= Math.min(item.row + 1, this._maxRow); i++) {
                    for (var j = Math.max(item.col - 1, this._minCol); j <= Math.min(item.col + 1, this._maxCol); j++) {
                        if (i !== item.row || j !== item.col) {
                            if (callbackfn(this.getSquare(i, j))) {
                                return;
                            }
                        }
                    }
                }
            };

            Field.prototype.registerStart = function () {
                var _this = this;
                if (this._state !== 0 /* Ready */) {
                    return;
                }
                this._state = 1 /* Started */;
                this.onGameStart.trigger();

                this._elapsedTime = new TimerInfo(1, false);
                this.onElapsedTime.trigger(this._elapsedTime);

                this._timerId = setInterval(function () {
                    if (_this._elapsedTime.changed) {
                        _this._elapsedTime.elapsedTime++;
                    }
                    _this._elapsedTime.changed = !_this._elapsedTime.changed;

                    _this.onElapsedTime.trigger(_this._elapsedTime);
                    if (_this._elapsedTime.elapsedTime === 5999) {
                        _this.stopTimer();
                    }
                }, 500);
            };

            Field.prototype.open = function (square) {
                if (this._putMinesLater > 0) {
                    this.putAllMines(this._putMinesLater, square);
                    this._putMinesLater = 0;
                }

                this.registerStart();

                this.openSquare(square);

                if (square.hasMine) {
                    this.stopTimer();
                    this._state = 3 /* Lost */;
                    this.onGameOver.trigger(false);
                    return;
                }

                this._openedCount++;

                if (square.displayNumber === 0) {
                    this.openAllNeighbors(square);
                } else {
                    this.openEmptyNeighbors(square);
                }

                if (this._openedCount === this.openableCount()) {
                    this.stopTimer();
                    this._state = 2 /* Won */;
                    this.onGameOver.trigger(true);
                }
            };

            Field.prototype.openSquare = function (square) {
                square.open();
                this.forEachInVicinity(square, function (i) {
                    i.decrementNeighborsClosed();
                    return false;
                });
            };

            Field.prototype.openEmptyNeighbors = function (square) {
                var _this = this;
                this.forEachInVicinity(square, function (item) {
                    if (!item.isOpenned && !item.isFlagged && !item.hasMine && item.displayNumber == 0) {
                        _this.openSquare(item);
                        _this._openedCount++;
                        _this.openAllNeighbors(item);
                    }
                    return (_this._state === 2 /* Won */ || _this._state === 3 /* Lost */);
                });
            };

            Field.prototype.openAllNeighbors = function (square) {
                var _this = this;
                this.forEachInVicinity(square, function (item) {
                    if (!item.isOpenned && !item.isFlagged && !item.hasMine) {
                        _this.openSquare(item);
                        _this._openedCount++;
                        if (item.displayNumber === 0) {
                            _this.openAllNeighbors(item);
                        }
                    }
                    return (_this._state === 2 /* Won */ || _this._state === 3 /* Lost */);
                });
            };

            Field.prototype.stopTimer = function () {
                if (!(this._timerId === undefined)) {
                    clearInterval(this._timerId);
                    this._timerId = undefined;
                }
            };

            Field.prototype.dispose = function () {
                this.stopTimer();
                if (this._squares) {
                    this._squares.forEach(function (i) {
                        return i.forEach(function (item) {
                            return item.onUpdate.remove();
                        });
                    });
                }
                this.onGameOver.remove();
                this.onGameStart.remove();
                this.onElapsedTime.remove();
            };

            Field.prototype.openNeighborhood = function (square) {
                var _this = this;
                var flagsFound = 0;
                this.forEachInVicinity(square, function (item) {
                    if (!item.isOpenned && item.isFlagged) {
                        flagsFound++;
                    }
                    return false;
                });
                if (flagsFound < square.displayNumber) {
                    return;
                }
                ;
                this.forEachInVicinity(square, function (item) {
                    if (!item.isOpenned && !item.isFlagged) {
                        _this.open(item);
                    }
                    return false;
                });
            };

            Field.prototype.flag = function (square) {
                if (square.isFlagged) {
                    this._flaggedCount--;
                    this.forEachInVicinity(square, function (i) {
                        i.incrementNeighborsClosed();
                        return false;
                    });
                } else if (!square.isUnknown) {
                    if (this.remainingFlags <= 0) {
                        return;
                    }
                    this._flaggedCount++;
                    this.forEachInVicinity(square, function (i) {
                        i.decrementNeighborsClosed();
                        return false;
                    });
                }
                this.registerStart();
                square.toggleFlag();
            };

            Field.prototype.createTip = function () {
                var _this = this;
                if (this._openedCount == 0) {
                    return undefined;
                }

                var startingPoing = this.getRandomCoordinates();
                var square = this.traverseFrom(this.getRandomCoordinates(), function (s) {
                    return _this.checkIfCanBeATip(s);
                });

                if (square) {
                    return square;
                } else {
                    return undefined;
                }
            };

            Field.prototype.checkIfCanBeATip = function (square) {
                if (!square.isOpenned) {
                    return undefined;
                }

                var flagCount = 0;
                var closedCount = 0;
                var candidate;
                var closedCandidate;
                this.forEachInVicinity(square, function (square) {
                    if (!square.isOpenned) {
                        closedCount++;
                        if (square.isFlagged) {
                            flagCount++;
                        } else if (square.tipType === 0 /* none */) {
                            candidate = square;
                        }
                    }
                    return false;
                });

                if (candidate === undefined) {
                    return undefined;
                }

                if (square.displayNumber === closedCount) {
                    candidate.tipType = 2 /* mine */;
                    return candidate;
                }

                if (square.displayNumber === flagCount) {
                    candidate.tipType = 1 /* safe */;
                    return candidate;
                }

                return undefined;
            };

            Field.prototype.traverseFrom = function (coords, callback) {
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
                } while(n !== coordsCellNumber);
                return undefined;
            };
            return Field;
        })();
        Model.Field = Field;
    })(Minesweeper.Model || (Minesweeper.Model = {}));
    var Model = Minesweeper.Model;
})(Minesweeper || (Minesweeper = {}));
;
var Minesweeper;
(function (Minesweeper) {
    (function (View) {
        var Cell = (function () {
            function Cell(container, square) {
                var _this = this;
                this.onClick = new Minesweeper.Model.TypedEvent();
                this.onRightClick = new Minesweeper.Model.TypedEvent();
                this.onBothClick = new Minesweeper.Model.TypedEvent();
                this._leftClicked = false;
                this._rightClicked = false;
                this._container = container;
                this._square = square;
                this._square.onUpdate.add(function () {
                    _this.draw();
                });
                this.draw();
            }
            Cell.prototype.dispose = function () {
                this._container.unbind();
                if (this._button) {
                    this._button.unbind();
                }

                this.onClick.remove();
                this.onRightClick.remove();
                this.onBothClick.remove();
            };

            Cell.prototype.draw = function () {
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
            };

            Cell.prototype.showFlag = function () {
                this._button.empty();
                App.addImage(this._button, 'Flag');
            };

            Cell.prototype.showUnknown = function () {
                this._button.empty();
                App.addImage(this._button, 'Unknown');
            };

            Cell.prototype.showWrongFlag = function () {
                this._button.empty();
                App.addImage(this._button, 'WrongFlag');
            };

            Cell.prototype.showOpennedSquare = function (isEnabled) {
                var _this = this;
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
                        this._container.bind('mouseup', function (e) {
                            if (_this._leftClicked && _this._rightClicked) {
                                _this.onBothClick.trigger(_this._square);
                            }
                            _this._leftClicked = false;
                            _this._rightClicked = false;
                        });

                        this._container.bind('mousedown', function (e) {
                            switch (e.which) {
                                case 1:
                                    _this._leftClicked = true;
                                    break;
                                case 3:
                                    _this._rightClicked = true;
                                    break;
                            }
                        });
                    }
                }
            };

            Cell.prototype.showButton = function (isEnabled) {
                var _this = this;
                var div = this.resetAndCreateDiv();

                this._button = $('<a/>').appendTo(div).attr('href', 'javascript:void(0)');
                this._button.html('&nbsp;');
                if (isEnabled) {
                    this._button.bind('click', function (e) {
                        return _this.processClick();
                    });
                    this._button.bind('mousedown', function (e) {
                        if (e.which == 3) {
                            _this.onRightClick.trigger(_this._square);
                        }
                        e.preventDefault();
                    });
                } else {
                    this._button.prop("disabled", true);
                }
            };

            Cell.prototype.processClick = function () {
                if (this._square.isFlagged) {
                    return;
                }
                this.onClick.trigger(this._square);
            };

            Cell.prototype.resetAndCreateDiv = function () {
                if (this._button) {
                    this._button.unbind();
                }

                this._container.empty();
                this._container.removeClass();
                this._container.unbind();

                var div = $('<div/>').appendTo(this._container).addClass('fieldCell');

                if (this._square.tipType === 1 /* safe */) {
                    div.addClass('tip_safe');
                } else if (this._square.tipType === 2 /* mine */) {
                    div.addClass('tip_mine');
                }

                return div;
            };

            Cell.prototype.reveal = function (showMinesAsFlags) {
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
            };
            return Cell;
        })();
        View.Cell = Cell;
    })(Minesweeper.View || (Minesweeper.View = {}));
    var View = Minesweeper.View;
})(Minesweeper || (Minesweeper = {}));
var Minesweeper;
(function (Minesweeper) {
    (function (View) {
        var Board = (function () {
            function Board(container) {
                var _this = this;
                this._options = View.UserOptions.load();
                this._optionsDialog = new View.OptionsDialog(this._options, function () {
                    _this._options.save();
                    _this.reset();
                });
                this._container = container;
            }
            Board.prototype.drawFooter = function (table) {
                var _this = this;
                if (this._tipButton) {
                    this._tipButton.unbind();
                }
                if (this._optionsButton) {
                    this._optionsButton.unbind();
                }

                var panel = $('<div/>').appendTo($('<td/>').appendTo($('<tr/>').appendTo(table)));
                panel.addClass('footerPanel');

                var panelTable = $('<table/>').appendTo(panel).attr('cellspacing', '0').attr('cellpadding', '0').attr('style', 'width:100%');

                var tr = $('<tr/>').appendTo(panelTable);
                var td = $('<td/>').appendTo(tr);
                td.attr('style', 'text-align:left');

                if (this._options.allowTips) {
                    this._tipButton = $('<button/>').appendTo(td);
                    App.addImage(this._tipButton, 'Tip');
                    this._tipButton.bind('click', function () {
                        if (_this._field.createTip()) {
                            _this._tipSpan.html('');
                        } else {
                            _this._tipSpan.html('Dica não disponível');
                        }
                    });
                }
                this._tipSpan = $('<span id="tip"/>').appendTo(td).addClass('tipMessage');

                var td = $('<td/>').appendTo(tr);
                td.attr('style', 'text-align:right');
                td.attr('colspan', '2');
                this._optionsButton = $('<button/>').appendTo(td);
                App.addImage(this._optionsButton, 'Options');
                this._optionsButton.bind('click', function () {
                    return _this._optionsDialog.show();
                });
            };

            Board.prototype.updateFlagCount = function () {
                var panel = this._headerFlagCountPanel;
                panel.empty();
                App.addImage(panel, 'MineLabel');
                this.addDigits(panel, this._field.remainingFlags, 3);
            };

            Board.prototype.drawHeader = function (table) {
                if (this._resetButton) {
                    this._resetButton.unbind();
                }

                var td = $('<td/>').appendTo($('<tr/>').appendTo(table));

                this._topPanel = $('<div/>').appendTo(td);
                this._topPanel.addClass('headerPanel');

                var panelTable = $('<table/>').appendTo(this._topPanel).attr('cellspacing', '0').attr('cellpadding', '0').attr('style', 'width:100%');

                var panelTr = $('<tr/>').appendTo(panelTable);

                this.drawFlagDisplay($('<td/>').appendTo(panelTr));
                this.drawResetPanel($('<td/>').appendTo(panelTr));
                this.drawTimerDisplay($('<td/>').appendTo(panelTr));
            };

            Board.prototype.drawCells = function (table) {
                var _this = this;
                var boardTable = $('<table/>').appendTo($('<td/>').appendTo($('<tr/>').appendTo(table)));
                boardTable.addClass('fieldTable');
                boardTable.attr('cellspacing', '0');
                boardTable.attr('cellpadding', '0');
                for (var i = this._field.minRow; i <= this._field.maxRow; i++) {
                    var tr = $('<tr/>').appendTo(boardTable);

                    for (var j = this._field.minCol; j <= this._field.maxCol; j++) {
                        var td = $('<td/>').appendTo(tr).addClass('fieldCell');

                        var cell = new View.Cell(td, this._field.getSquare(i, j));
                        cell.onClick.add(function (square) {
                            _this._field.open(square);
                            _this._tipSpan.html('');
                        });
                        cell.onBothClick.add(function (square) {
                            _this._field.openNeighborhood(square);
                            ;
                            _this._tipSpan.html('');
                        });
                        cell.onRightClick.add(function (square) {
                            _this.setFlag(square);
                            _this._tipSpan.html('');
                        });
                        this._cells.push(cell);
                    }
                }
            };

            Board.prototype.setFlag = function (square) {
                this._field.flag(square);
                this.updateFlagCount();
            };

            Board.prototype.drawFlagDisplay = function (td) {
                this._headerFlagCountPanel = $('<div/>').appendTo(td).addClass('flagDisplay');
                this.updateFlagCount();
            };

            Board.prototype.drawTimerDisplay = function (td) {
                this._headerTimerPanel = $('<div/>').appendTo(td).addClass('clockDisplay').attr('style', 'margin-left:auto');
                this.showTimeDisplay(this._headerTimerPanel, new Minesweeper.Model.TimerInfo(0, false));
            };

            Board.prototype.drawResetPanel = function (td) {
                var _this = this;
                var resetPanel = $('<div/>').appendTo(td).addClass('resetPanel');
                this._resetButton = $('<button/>').appendTo(resetPanel);
                App.addImage(this._resetButton, 'Ready');
                this._resetButton.bind('click', function () {
                    _this.reset();
                });
            };

            Board.prototype.addDigits = function (panel, value, size) {
                var digits = value.toString().split('');
                var startDigit = digits.length - size;
                for (var n = digits.length - size; n < digits.length; n++) {
                    var imageName = n < 0 ? '0' : digits[n];
                    App.addImage(panel, 'Counter' + imageName);
                }
            };

            Board.prototype.showTimeDisplay = function (panel, timerInfo) {
                panel.empty();
                App.addImage(panel, 'ClockLabel');
                this.addDigits(panel, timerInfo.getMinutes(), 2);
                App.addImage(panel, timerInfo.changed ? 'PointsDark' : 'PointsLight');
                this.addDigits(panel, timerInfo.getSeconds(), 2);
            };

            Board.prototype.reset = function () {
                var _this = this;
                this.stopAutoPlay();
                if (this._field) {
                    this._field.dispose();
                }
                if (this._cells) {
                    this._cells.forEach(function (item) {
                        return item.dispose();
                    });
                }
                this._cells = [];

                var options = this._options.getCurrentOptions();
                this._field = new Minesweeper.Model.Field(options.rows, options.cols);
                this._field.putMines(options.mines, this._options.putMinesAfterFirstOpen);

                this._field.onGameOver.add(function (result) {
                    _this._resetButton.empty();
                    App.addImage(_this._resetButton, result ? 'Won' : 'Lost');
                    if (_this._tipButton) {
                        _this._tipButton.prop("disabled", true);
                    }
                    _this._cells.forEach(function (item) {
                        item.reveal(result);
                    });
                });

                this._field.onGameStart.add(function () {
                    _this._resetButton.empty();
                    App.addImage(_this._resetButton, 'Started');
                    if (_this._options.autoPlay) {
                        _this._autoPlayId = setInterval(function () {
                            return _this.runAutoPlay();
                        }, 500);
                    }
                });

                this._field.onElapsedTime.add(function (value) {
                    _this.showTimeDisplay(_this._headerTimerPanel, value);
                });

                this._container.empty();
                var table = $('<table/>').appendTo(this._container).addClass('mainTable').attr('cellspacing', 0).attr('cellpadding', 0);
                this.drawHeader(table);
                this.drawCells(table);
                this.drawFooter(table);
            };

            Board.prototype.runAutoPlay = function () {
                var square = this._field.createTip();
                if (square) {
                    switch (square.tipType) {
                        case 1 /* safe */:
                            this._field.open(square);
                            return;
                        case 2 /* mine */:
                            this.setFlag(square);
                            return;
                    }
                }
                this.stopAutoPlay();
                this._tipSpan.html('Jogo automático interrompido');
            };

            Board.prototype.stopAutoPlay = function () {
                if (this._autoPlayId) {
                    clearInterval(this._autoPlayId);
                    this._autoPlayId = undefined;
                }
            };
            return Board;
        })();
        View.Board = Board;
    })(Minesweeper.View || (Minesweeper.View = {}));
    var View = Minesweeper.View;
})(Minesweeper || (Minesweeper = {}));
var Minesweeper;
(function (Minesweeper) {
    (function (View) {
        var OptionsDialog = (function () {
            function OptionsDialog(userOptions, callback) {
                this.userOptions = userOptions;
                this.callback = callback;
            }
            OptionsDialog.prototype.createGameModeRadioButton = function (container, value, id, name) {
                var _this = this;
                var p = $('<p/>').appendTo(container);
                var op1 = $('<input id="' + id + '" type="radio" name="options_board_size" value="' + value + '" />').appendTo(p);
                if (this.userOptions.gameMode === value) {
                    op1.attr('checked', 'checked');
                }
                $('<label for="' + id + '">' + name + '</label>').appendTo(p);

                op1.bind("click", function () {
                    return _this.updateCustomOptions();
                });
                return op1;
            };

            OptionsDialog.prototype.updateCustomOptions = function () {
                var disabled = (!this._optCustom.is(':checked'));
                this._rows.prop("disabled", disabled);
                this._cols.prop("disabled", disabled);
                this._mines.prop("disabled", disabled);

                var values;

                if (disabled) {
                    values = View.UserOptions.getOptionsFor(this.getSelectedGameMode());
                    this._rows.removeClass('invalid');
                    this._cols.removeClass('invalid');
                    this._mines.removeClass('invalid');
                } else {
                    values = this.userOptions.customOptions;
                }

                this._rows.val(values.rows.toString());
                this._cols.val(values.cols.toString());
                this._mines.val(values.mines.toString());
            };

            OptionsDialog.prototype.createPanel = function () {
                this._optionsPanel = $('<div/>').attr('title', 'Opções').addClass('optionsPanel');

                var table = $('<table/>').appendTo(this._optionsPanel).attr('cellspacing', '0').attr('cellpadding', '0').attr('style', 'width:100%');
                var tr = $('<td/>').appendTo(table);
                var td = $('<td/>').appendTo(tr).attr('style', 'text-align:left');

                this._optBegginner = this.createGameModeRadioButton(td, 0 /* Begginner */, 'options_board_begginner', 'Iniciante');
                this._optIntermediate = this.createGameModeRadioButton(td, 1 /* Intermediate */, 'options_board_intermediate', 'Intermediário');
                this._optExpert = this.createGameModeRadioButton(td, 2 /* Expert */, 'options_board_expert', 'Experiente');
                this._optCustom = this.createGameModeRadioButton(td, 3 /* Custom */, 'options_board_custom', 'Customizado');

                var minValues = View.UserOptions.getMinOptionValues();
                var maxValues = View.UserOptions.getMaxOptionValues();

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

                this._putMinesAfterFirstOpen = this.createCheckbox('empty_square_on_first_click', 'Impedir fim de jogo no primeiro clique', this.userOptions.putMinesAfterFirstOpen);

                this._allowTips = this.createCheckbox('allow_tips', 'Exibir opção de dicas', this.userOptions.allowTips);

                this._autoPlay = this.createCheckbox('auto_play', 'Jogo automático', this.userOptions.autoPlay);
            };

            OptionsDialog.prototype.createCheckbox = function (id, label, checked) {
                var p = $('<p/>').appendTo(this._optionsPanel);
                var chk = $('<input id="' + id + '" type="checkbox" value="1" />').appendTo(p);
                if (checked) {
                    chk.attr('checked', 'checked');
                }
                $('<label for="' + id + '">' + label + '</label>').appendTo(p);
                return chk;
            };

            OptionsDialog.prototype.validate = function () {
                if (!this._optCustom.is(':checked')) {
                    return true;
                }

                var minValues = View.UserOptions.getMinOptionValues();
                var maxValues = View.UserOptions.getMaxOptionValues();

                var v1 = this.validateValue(this._rows, minValues.rows, maxValues.rows);
                var v2 = this.validateValue(this._cols, minValues.cols, maxValues.cols);
                var v3 = this.validateValue(this._mines, minValues.mines, maxValues.mines);

                return v1 && v2 && v3;
            };

            OptionsDialog.prototype.validateValue = function (e, minValue, maxValue) {
                var valid = false;
                var value = e.val();
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
            };

            OptionsDialog.prototype.getSelectedGameMode = function () {
                if (this._optBegginner.is(':checked')) {
                    return 0 /* Begginner */;
                } else if (this._optIntermediate.is(':checked')) {
                    return 1 /* Intermediate */;
                } else if (this._optExpert.is(':checked')) {
                    return 2 /* Expert */;
                } else {
                    return 3 /* Custom */;
                }
            };

            OptionsDialog.prototype.show = function () {
                var _this = this;
                if (this._optionsPanel === undefined) {
                    this.createPanel();
                }

                this._optionsPanel.dialog({
                    modal: true,
                    width: 350,
                    buttons: {
                        "OK": function () {
                            if (!_this.validate()) {
                                return;
                            }
                            _this.userOptions.gameMode = _this.getSelectedGameMode();
                            if (_this.userOptions.gameMode === 3 /* Custom */) {
                                _this.userOptions.gameMode = 3 /* Custom */;
                                _this.userOptions.customOptions.rows = parseInt(_this._rows.val());
                                _this.userOptions.customOptions.cols = parseInt(_this._cols.val());
                                _this.userOptions.customOptions.mines = parseInt(_this._mines.val());
                            }
                            _this.userOptions.putMinesAfterFirstOpen = _this._putMinesAfterFirstOpen.is(':checked');
                            _this.userOptions.allowTips = _this._allowTips.is(':checked');
                            _this.userOptions.autoPlay = _this._autoPlay.is(':checked');
                            _this._optionsPanel.dialog("close");
                            _this.callback();
                        },
                        "Cancelar": function () {
                            _this._optionsPanel.dialog("close");
                        }
                    }
                });
            };
            return OptionsDialog;
        })();
        View.OptionsDialog = OptionsDialog;
    })(Minesweeper.View || (Minesweeper.View = {}));
    var View = Minesweeper.View;
})(Minesweeper || (Minesweeper = {}));
var Minesweeper;
(function (Minesweeper) {
    (function (View) {
        (function (GameMode) {
            GameMode[GameMode["Begginner"] = 0] = "Begginner";
            GameMode[GameMode["Intermediate"] = 1] = "Intermediate";
            GameMode[GameMode["Expert"] = 2] = "Expert";
            GameMode[GameMode["Custom"] = 3] = "Custom";
        })(View.GameMode || (View.GameMode = {}));
        var GameMode = View.GameMode;

        var BoardOptions = (function () {
            function BoardOptions(rows, cols, mines) {
                this.rows = rows;
                this.cols = cols;
                this.mines = mines;
            }
            BoardOptions.clone = function (item) {
                return new BoardOptions(item.rows, item.cols, item.mines);
            };
            return BoardOptions;
        })();
        View.BoardOptions = BoardOptions;

        var _begginnerOptions = new BoardOptions(9, 9, 10);
        var _intermediateOptions = new BoardOptions(16, 16, 40);
        var _expertOptions = new BoardOptions(16, 30, 99);
        var _minOptionValues = new BoardOptions(8, 8, 10);
        var _maxOptionValues = new BoardOptions(24, 30, 667);

        var UserOptions = (function () {
            function UserOptions() {
                this._allOptions = {
                    gameMode: 0 /* Begginner */,
                    customOptions: BoardOptions.clone(_begginnerOptions),
                    putMinesAfterFirstOpen: true,
                    allowTips: true,
                    autoPlay: false
                };
            }
            Object.defineProperty(UserOptions.prototype, "autoPlay", {
                get: function () {
                    return this._allOptions.autoPlay;
                },
                set: function (value) {
                    this._allOptions.autoPlay = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(UserOptions.prototype, "gameMode", {
                get: function () {
                    return this._allOptions.gameMode;
                },
                set: function (value) {
                    this._allOptions.gameMode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(UserOptions.prototype, "customOptions", {
                get: function () {
                    return this._allOptions.customOptions;
                },
                set: function (value) {
                    this._allOptions.customOptions = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(UserOptions.prototype, "putMinesAfterFirstOpen", {
                get: function () {
                    return this._allOptions.putMinesAfterFirstOpen;
                },
                set: function (value) {
                    this._allOptions.putMinesAfterFirstOpen = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(UserOptions.prototype, "allowTips", {
                get: function () {
                    return this._allOptions.allowTips;
                },
                set: function (value) {
                    this._allOptions.allowTips = value;
                },
                enumerable: true,
                configurable: true
            });


            UserOptions.prototype.getCurrentOptions = function () {
                if (this.gameMode === 3 /* Custom */) {
                    return BoardOptions.clone(this.customOptions);
                }
                return UserOptions.getOptionsFor(this.gameMode);
            };

            UserOptions.getOptionsFor = function (gameMode) {
                switch (gameMode) {
                    case 0 /* Begginner */:
                        return BoardOptions.clone(_begginnerOptions);
                    case 1 /* Intermediate */:
                        return BoardOptions.clone(_intermediateOptions);
                    case 2 /* Expert */:
                        return BoardOptions.clone(_expertOptions);
                    default:
                        return BoardOptions.clone(_begginnerOptions);
                }
            };

            UserOptions.getMinOptionValues = function () {
                return BoardOptions.clone(_minOptionValues);
            };

            UserOptions.getMaxOptionValues = function () {
                return BoardOptions.clone(_maxOptionValues);
            };

            UserOptions.load = function () {
                var options = new UserOptions();
                if (localStorage && localStorage.getItem && JSON && JSON.parse) {
                    var stored = localStorage.getItem("options");
                    if (stored) {
                        options._allOptions = JSON.parse(stored);
                        return options;
                    }
                }
                return options;
            };

            UserOptions.prototype.save = function () {
                if (localStorage && localStorage.setItem && JSON && JSON.stringify) {
                    localStorage.setItem("options", JSON.stringify(this._allOptions));
                }
            };
            return UserOptions;
        })();
        View.UserOptions = UserOptions;
    })(Minesweeper.View || (Minesweeper.View = {}));
    var View = Minesweeper.View;
})(Minesweeper || (Minesweeper = {}));
var Minesweeper;
(function (Minesweeper) {
    (function (Model) {
        (function (TipType) {
            TipType[TipType["none"] = 0] = "none";
            TipType[TipType["safe"] = 1] = "safe";
            TipType[TipType["mine"] = 2] = "mine";
        })(Model.TipType || (Model.TipType = {}));
        var TipType = Model.TipType;

        var Square = (function () {
            function Square(row, col, neighborsClosed) {
                this._row = 0;
                this._col = 0;
                this._isOpenned = false;
                this._isFlagged = false;
                this._isUnknown = false;
                this._tipType = 0 /* none */;
                this._neighborsClosed = 0;
                this.onUpdate = new Model.TypedEvent();
                this.hasMine = false;
                this.hasExploded = false;
                this.displayNumber = 0;
                this._row = row;
                this._col = col;
                this._neighborsClosed = neighborsClosed;
            }
            Object.defineProperty(Square.prototype, "hasNeighborsClosed", {
                get: function () {
                    return this._neighborsClosed > 0;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Square.prototype, "isFlagged", {
                get: function () {
                    return this._isFlagged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Square.prototype, "isUnknown", {
                get: function () {
                    return this._isUnknown;
                },
                enumerable: true,
                configurable: true
            });

            Square.prototype.open = function () {
                if (this._isOpenned) {
                    return;
                }
                this._isOpenned = true;
                if (this.hasMine) {
                    this.hasExploded = true;
                }
                this.onUpdate.trigger();
            };

            Object.defineProperty(Square.prototype, "isOpenned", {
                get: function () {
                    return this._isOpenned;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Square.prototype, "row", {
                get: function () {
                    return this._row;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Square.prototype, "col", {
                get: function () {
                    return this._col;
                },
                enumerable: true,
                configurable: true
            });

            Square.prototype.toggleFlag = function () {
                if (this._isFlagged) {
                    this._isFlagged = false;
                    this._isUnknown = true;
                } else if (this._isUnknown) {
                    this._isUnknown = false;
                } else {
                    this._isFlagged = true;
                }
                this.onUpdate.trigger();
            };

            Object.defineProperty(Square.prototype, "tipType", {
                get: function () {
                    return this._tipType;
                },
                set: function (value) {
                    if (this._tipType !== value) {
                        this._tipType = value;
                        this.onUpdate.trigger();
                    }
                },
                enumerable: true,
                configurable: true
            });


            Square.prototype.incrementNeighborsClosed = function () {
                this._neighborsClosed++;
                if (this._neighborsClosed === 1) {
                    this.onUpdate.trigger();
                }
            };

            Square.prototype.decrementNeighborsClosed = function () {
                if (this._neighborsClosed > 0) {
                    this._neighborsClosed--;
                    if (this._neighborsClosed === 0) {
                        this.onUpdate.trigger();
                    }
                }
            };
            return Square;
        })();
        Model.Square = Square;
    })(Minesweeper.Model || (Minesweeper.Model = {}));
    var Model = Minesweeper.Model;
})(Minesweeper || (Minesweeper = {}));
;
var Minesweeper;
(function (Minesweeper) {
    (function (View) {
        var ImageLoader = (function () {
            function ImageLoader() {
                this.imageList = [];
                this.onLoaded = new Minesweeper.Model.TypedEvent();
            }
            ImageLoader.prototype.load = function () {
                var _this = this;
                var preloadDiv = $('<div/>').appendTo($('body')).attr('style', 'display:none');

                var loadedCount = 0;
                this.imageList.forEach(function (name) {
                    App.addImage(preloadDiv, name).load(function () {
                        loadedCount++;
                        if (loadedCount == _this.imageList.length) {
                            _this.onLoaded.trigger();
                        }
                    });
                });
            };
            return ImageLoader;
        })();
        View.ImageLoader = ImageLoader;
    })(Minesweeper.View || (Minesweeper.View = {}));
    var View = Minesweeper.View;
})(Minesweeper || (Minesweeper = {}));
