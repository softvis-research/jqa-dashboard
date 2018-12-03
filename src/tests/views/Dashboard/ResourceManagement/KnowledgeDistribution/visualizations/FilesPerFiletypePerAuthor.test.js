import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import { expect } from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import FilesPerFiletypePerAuthor from "../../../../../../views/Dashboard/ResourceManagement/KnowledgeDistribution/visualizations/FilesPerFiletypePerAuthor";

describe("<FilesPerFiletypePerAuthor />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<FilesPerFiletypePerAuthor />);
        wrapper.setState({
            data: [
                {
                    author: "Dummy",
                    filetype: "dum",
                    files: 1
                }
            ],
            dataKeys: ["Dummy"]
        });
        var html = wrapper.html();

        expect(html).to.contain(
            '<div class="visualization-wrapper"><div style="height:4000px;width:85%;float:left"><div style="width:100%;height:100%">'
        );
        //expect(html).to.contain('<svg>');
    });
});
