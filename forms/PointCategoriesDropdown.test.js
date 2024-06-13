import React from 'react';
import { fireEvent, render, screen } from 'test-util';
import { assert } from 'chai';
import sinon from 'sinon';
import nock from 'nock';

import config from '../../config';
import { PointCategoriesDropdown } from './PointCategoriesDropdown';

describe('<PointCategoriesDropdown/>', () => {
    const spyChangeCategory = sinon.spy();

    const rerendered = props => {
        const { rerender } = render(
            <PointCategoriesDropdown
                dispatch={undefined}
                changeCategory={spyChangeCategory}
                pointCategories={[]}
            />
        );
        rerender(
            <PointCategoriesDropdown
                dispatch={undefined}
                changeCategory={spyChangeCategory}
                pointCategories={[]}
                {...props}
            />
        );
    };

    beforeEach(async () => {
        nock(new RegExp(config.API_HOST))
        .persist()
        .get(/points/)
        .reply(200, JSON.stringify([
            { id: 101, description: 'Other Debate', ranked: true, type: 'debate', hs: true, ms: true },
        ]));
    });

    afterEach(async () => {
        nock.cleanAll();
    });

    it('should render a select element with at least one option', async () => {
        const { rerender } = render(
            <PointCategoriesDropdown
                dispatch={undefined}
                changeCategory={spyChangeCategory}
                pointCategories={[]}
            />
        );
        assert.isOk(screen.queryByText('Error retrieving events'), 'Error message initially');
        rerender(
            <PointCategoriesDropdown
                dispatch={undefined}
                changeCategory={spyChangeCategory}
                pointCategories={[]}
            />
        );
        assert.isOk(await screen.findByText('All Events'), 'Default option given');
    });

    it('should optionally render other points option', async () => {
        rerendered({ other: true });
        assert.isOk(await screen.findByText('Other Points'), 'Other option rendered');
    });

    it('should fetch in standalone mode', async () => {
        rerendered();
        assert.isOk(await screen.findByText('Other Debate'), 'Option rendered from mock api and therefore saved to state');
        assert.isOk(nock.isDone(), 'Successfully fetched');
    });

    it('should trigger changeCategory on change', async () => {
        rerendered();
        await screen.findByText('Other Debate');
        fireEvent.change(screen.queryByRole('combobox'), { target: { value: 1 } });
        assert.isTrue(spyChangeCategory.calledOnce, 'called changeCategory');
    });
});
