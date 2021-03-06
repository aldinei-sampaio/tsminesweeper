// Type definitions for jQueryUI 1.9
// Project: http://layout.jquery-dev.net/
// Definitions by: Steve Fenton <https://github.com/Steve-Fenton>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../jquery/jquery.d.ts"/>
/// <reference path="../jqueryui/jqueryui.d.ts"/>

interface JQueryLayoutOptions {
    north: any;
    east: any;
    south: any;
    west: any;
}

interface JQueryLayout {
    panes: any;
    options: JQueryLayoutOptions;
    state: any;

    toggle(pane: any): any;
    open(pane: any): any;
    close(pane: any): any;
    show(pane: any, openPane?: boolean): any;
    hide(pane: any): any;
    sizePane(pane: any, sizeInPixels: number): any;
    resizeContent(pane: any): any;
    resizeAll(): any;

    addToggleBtn(selector: string, pane: any): void;
    addCloseBtn(selector: string, pane: any): void;
    addOpenBtn(selector: string, pane: any): void;
    addPinBtn(selector: string, pane: any): void;
    allowOverflow(elemOrPane: any): void;
    resetOverflow(elemOrPane: any): void;
}

interface JQuery {
    layout(options?: JQueryLayoutOptions): JQueryLayout;
}
