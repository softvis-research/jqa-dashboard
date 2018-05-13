import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import ArchitectureDependencies  from '../../../../../src/views/Dashboard/Architecture/Dependencies/Dependencies';
import {expect} from "chai";

describe('<ArchitectureDependencies />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow( <ArchitectureDependencies/> );
        wrapper.setState({
            finalMatrixData:
                [
                    [
                        87,
                        358,
                        441
                    ],
                    [
                        45,
                        193,
                        1
                    ],
                    [
                        1868,
                        1993,
                        1236
                    ]
                ],
            finalMatrixKeys: [
                "John",
                "Raoul",
                "Ibrahim"
            ]
        });

        var html = wrapper.html();

        expect(html).to.contain('<div class="card-header">Dependencies</div>');
        //expect(html).to.contain('<svg>');
    });

});