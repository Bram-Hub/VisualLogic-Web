import {UserInputManager} from '../src/userInput.js';
import {initMockApp, deinitMockApp} from './testUtil.js';

beforeEach(() => {
    initMockApp();
});

afterEach(() => {
    deinitMockApp();
});

describe('User input tests', () => {
	it('create user input manager', () => {
        const UM = UserInputManager;
    });
});