import { shallow } from 'enzyme';
import * as React from 'react';

import Component from '../index';

describe('components/Cell/Rows', () => {
  xit('renders a single div', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper.find('.ory-cell-rows')).toHaveLength(1);
  });
});
