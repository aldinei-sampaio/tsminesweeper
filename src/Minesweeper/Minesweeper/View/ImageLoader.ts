module Minesweeper.View {
    export class ImageLoader {
        public imageList: String[] = [];
        public onLoaded: Model.IEvent = new Model.TypedEvent();

        public load(): void {
            var loadedCount = 0;
            this.imageList.forEach((name) => {
                $('<img>').attr({ src: 'Images/' + name + '.png' }).load(() => {
                    loadedCount++;
                    if (loadedCount == this.imageList.length) {
                        this.onLoaded.trigger();
                    }
                });
            });
        }
    }
} 