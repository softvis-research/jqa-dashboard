import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import TestCoverage  from '../../../../../src/views/Dashboard/QualityManagement/TestCoverage/TestCoverage';
import {expect} from "chai";

describe('<TestCoverage />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow( <TestCoverage/> );
        /*
        wrapper.setState({
        });
        */
        var html = wrapper.html();

        expect(html).to.contain('<div class="card-header">Currently empty</div>');
    });

});