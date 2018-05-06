import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import LatestCommits from '../../src/views/Dashboard/visualizations/LatestCommits';

describe('<LatestCommits />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow(<LatestCommits/>);
        wrapper.setState({
            latestCommits: [
                {
                    "author": "Dummy",
                    "date": '2018-01-01',
                    "message": 'Dummy'
                }
            ]
        });
        var html = wrapper.html();

        expect(html).to.contain('<div class="ReactTable -striped -highlight"><div class="rt-table"><div class="rt-thead -header" style="min-width:300px">');
        //expect(html).to.contain('<svg>');
    });
});