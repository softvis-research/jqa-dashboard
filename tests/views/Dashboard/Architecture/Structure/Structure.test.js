import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import Structure  from '../../../../../src/views/Dashboard/Architecture/Structure/Structure';
import {expect} from "chai";

describe('<Structure />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow( <Structure/> );
        wrapper.setState({
            hotSpotData:
                {
                    "name": "nivo",
                    "test": "testval",
                    "children": [
                        {
                            "name": "dummy",
                            "loc": 1
                        }
                    ]
                },
            treeViewData:
                {
                    name: 'root',
                    toggled: true,
                    children: [
                        {
                            name: 'parent',
                            children: [
                                { name: 'child1' },
                                { name: 'child2' }
                            ]
                        },
                        {
                            name: 'parent',
                            children: [
                                {
                                    name: 'nested parent',
                                    children: [
                                        { name: 'nested child 1' },
                                        { name: 'nested child 2' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            breadCrumbData: ['']
        });

        var html = wrapper.html();

        expect(html).to.contain('<div class="card-header">Structure');
        //expect(html).to.contain('<svg>');
    });

});