import React from 'react';
import { fireEvent, render, screen } from 'test-util';
import { assert } from 'chai';
import sinon from 'sinon';

import StatesDropdown from './StatesDropdown';

describe('<StatesDropdown/>', () => {
    const spyChangeStateCode = sinon.spy();

    const defaultRender = props => {
        render(<StatesDropdown {...props} changeStateCode={spyChangeStateCode} />);
    };

    it('should render default option for select element and have 52 options', async () => {
        defaultRender();
        assert.isOk(screen.queryByText('All States'), 'Default option exists');
        assert.strictEqual(screen.queryByRole('combobox').children.length, 52, 'Exactly 52 option elements');
    });

    it('allows setting props', async () => {
        defaultRender({ stateCode: 'IA' });
        assert.strictEqual(screen.queryByRole('combobox').value, 'IA', 'Select element has value of IA');
    });

    it('should have an international option if set', () => {
        defaultRender({ international: true });
        assert.isOk(screen.queryByText('International'), 'International option exists');
    });

    it('should trigger changeStateCode on change', async () => {
        defaultRender();
        fireEvent.change(screen.queryByRole('combobox'), { target: { value: 1 } });
        assert.isTrue(spyChangeStateCode.calledOnce, 'called changeStateCode');
    });
});
