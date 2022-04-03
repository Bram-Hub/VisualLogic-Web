import {CanvasManager, InitializeCanvasManager} from '../src/canvasManager.js';
import {UserInputManager, InitializeUserInputManager} from '../src/userInput.js';

/**
 * Helper functions for testing the app
 */

function createMockDom(){
    document.body.innerHTML = `
    <canvas id="canvas"></canvas>
    <button id="toggle_mode"></button>
    <button id="insert-btn"></button>
    <button id="exit-mini"></button>
    <button id="dbl-cut-btn"></button>
    <button id="insert-graph"></button>
    <button id="erasure-btn"></button>
    <button id="iteration-btn"></button>
    <button id="deiteration-btn"></button>
    <button id="close-btn"></button>
    <button id="options-btn"></button>
    <button id="clear-btn"></button>
    <div id="modal-background"></div>
    <div id="msg-buff"></div>
    `;
}


function initMockApp(){
    createMockDom();

    let mck = {
		getContext : function() {},
		addEventListener : function() {}
	}

	InitializeCanvasManager(mck,mck);
    InitializeUserInputManager();
}


function deinitMockApp(){
    CanvasManager.clearData();
    UserInputManager.clearData();
}


export {
    initMockApp,
    deinitMockApp
}