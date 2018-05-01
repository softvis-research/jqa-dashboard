import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import DynamicBreadcrumb from './DynamicBreadcrumb';

describe('DynamicBreadcrumbTest', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow(<DynamicBreadcrumb items={['a', 'b', 'c']} separator={"-"}/>);
        var html = wrapper.html();

        expect(html).to.contain('<a id="a" class="breadcrumb-item breadcrumb-item">a</a>');
        expect(html).to.contain('<a id="a-b" class="breadcrumb-item breadcrumb-item">b</a>');
        expect(html).to.contain('<span id="a-b-c" class="active breadcrumb-item breadcrumb-item">c</span>');
    });

});