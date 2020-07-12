import {DEBUG,getRandomString} from '../src/main.js';

describe('Tests for main.js', () => {
	it('test DEBUG should be false on production', () => {
		expect(DEBUG).toBe(false);
	});

	it('generateRandomString should work if crypto not defined', () => {
		expect(getRandomString()).not.toBe(null);
	});
});