import React from 'react';
import { fireEvent, render, screen } from 'test-util';
import { assert } from 'chai';
import sinon from 'sinon';
import nock from 'nock';

import config from '../../config';
import DistrictsDropdown from './DistrictsDropdown';

describe('<DistrictsDropdown/>', () => {
    const spyChangeDistrict = sinon.spy();
    const rerendered = props => {
        const { rerender } = render(<DistrictsDropdown changeDistrict={spyChangeDistrict} />);
        rerender(<DistrictsDropdown {...props} changeDistrict={spyChangeDistrict} />);
    };

    beforeEach(async () => {
        nock(new RegExp(config.API_HOST))
        .persist()
        .get(/districts/)
        .reply(200, JSON.stringify([
            { id: 1, name: 'Test', level: 1, realm: 'HS' },
        ]));
    });

    afterEach(async () => {
        nock.cleanAll();
    });

    it('should display error message when no districts are found and then have default option once districts are fetched', async () => {
        const { rerender } = render(<DistrictsDropdown changeDistrict={spyChangeDistrict} />);
        assert.isOk(screen.queryByText('Error retrieving districts'), 'Error message when no districts are found');
        rerender(<DistrictsDropdown changeDistrict={spyChangeDistrict} />);
        assert.isOk(await screen.findByText('All Districts'), 'Default option exists');
    });

    it('calls componentDidMount', async () => {
        const spyLoadDistricts = sinon.spy(DistrictsDropdown.prototype, 'loadDistricts');
        const spyCompLoaded = sinon.spy(DistrictsDropdown.prototype, 'componentDidMount');
        rerendered();
        assert.isTrue(spyCompLoaded.calledOnce, 'componentDidMount was called');
        assert.isOk(nock.isDone(), 'Fetched successfully');
        assert.isTrue(spyLoadDistricts.calledOnce, 'loadDistricts called');
        spyCompLoaded.restore();
        spyLoadDistricts.restore();
    });

    it('should update the option list with retrieved data', async () => {
        rerendered();
        assert.isOk(await screen.findByText('Test'), 'Option created after data retrieval');
    });

    it('should refetch districts on realm change', async () => {
        const spyLoadDistricts = sinon.spy(DistrictsDropdown.prototype, 'loadDistricts');
        const { rerender } = render(<DistrictsDropdown realm='hs' changeDistrict={() => true} />);
        rerender(<DistrictsDropdown realm='ms' changeDistrict={() => true} />);
        assert.strictEqual(spyLoadDistricts.callCount, 2, 'loadDistricts called twice');
        spyLoadDistricts.restore();
    });

    it('should trigger changeDistrict on change', async () => {
        rerendered();
        // Wait for valid options to load from mocked api call
        await screen.findByText('Test');
        fireEvent.change(screen.queryByRole('combobox'), { target: { value: 1 } });
        assert.isTrue(spyChangeDistrict.calledOnce, 'called changeDistrict');
    });
});
