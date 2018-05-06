import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import CodeChurn from '../../../src/views/Dashboard/ResourceManagement/CodeChurn/CodeChurn';
import {expect} from "chai";

describe('<CodeChurn />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow( <CodeChurn/> );
        /*
        wrapper.setState({
        });
        */
        var html = wrapper.html();

        expect(html).to.contain('<div class="card-header">Currently empty</div>');
    });

});