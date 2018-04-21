import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import DynamicBreadcrumb from '../src/components/Breadcrumb/DynamicBreadcrumb'

describe('DynamicBreadcrumbTest', () => {

    it('should render without throwing an error', () => {
        expect( shallow( <DynamicBreadcrumb items={['a', 'b', 'c']}/> ).exists(<span></span>) ).toBe(true)
    });

});