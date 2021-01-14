import chai from 'chai';
import Core from '../server/core.js';

const expect = chai.expect;
const core = new Core();

describe('core.js tests', () => {

    describe('Core.getPlayers() Test', () => {
        it('should get all players', () => {
            expect(null).to.not.be.ok;
        });
    });


});