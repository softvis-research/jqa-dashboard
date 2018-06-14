import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import FilesPerAuthor from '../../../../../../src/views/Dashboard/ResourceManagement/Activity/visualizations/FilesPerAuthor';

describe('<FilesPerAuthor />', () => {

    it('should render without throwing an error', () => {
        var wrapper = shallow(<FilesPerAuthor/>);
        wrapper.setState({
            filesPerAuthor: [
                {
                    "author": "Dummy",
                    "files": 1
                }
            ]
        });
        var html = wrapper.html();

        expect(html).to.contain('<div><div style="height:600px">');
        //expect(html).to.contain('<svg>');
    });
});