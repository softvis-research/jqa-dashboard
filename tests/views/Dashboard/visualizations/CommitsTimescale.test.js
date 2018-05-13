import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import CommitsTimescale from '../../../../src/views/Dashboard/visualizations/CommitsTimescale';

describe('<CommitsTimescale />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow(<CommitsTimescale/>);
        var now = new Date();
        wrapper.setState({
            commitsFrom: '2017-01-01',
            commitsTo: '2019-01-01',
            commitsTimescale: [
                {
                    "day": now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate(),
                    "value": 42
                },
                {
                    "day": now.getFullYear() + "-" + now.getMonth() + "-" + (now.getDate() - 1),
                    "value": 23
                },

            ]
        });
        var html = wrapper.html();

        expect(html).to.contain('<div class="calendar-wrapper">');
        expect(html).to.contain('<div class="calendar-legend">');
        //expect(html).to.contain('<svg>');
    });
});