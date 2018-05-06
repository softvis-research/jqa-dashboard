import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import CodeOwnership from '../../../src/views/Dashboard/ResourceManagement/CodeOwnership/CodeOwnership';
import {expect} from "chai";

describe('<CodeOwnership />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow( <CodeOwnership/> );
        /*
        wrapper.setState({
        });
        */
        var html = wrapper.html();

        expect(html).to.contain('<div class="card-header">Currently empty</div>');
    });

});