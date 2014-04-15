module Minesweeper.View {
    export class ImageLoader {
        public imageList: String[] = [];
        public onLoaded: Model.IEvent = new Model.TypedEvent();

        public load(): void {
            var preloadDiv = $('<div/>').appendTo($('body')).attr('style', 'display:none');

            var loadedCount = 0;
            this.imageList.forEach((name) => {
                App.addImage(preloadDiv, name).load(() => {
                    loadedCount++;
                    if (loadedCount == this.imageList.length) {
                        this.onLoaded.trigger();
                    }
                });
            });
        }
    }
} 