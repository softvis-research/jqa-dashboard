import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

//component to test
import CustomQuery from "../../../../views/Dashboard/Header/CustomQuery";
import { expect } from "chai";

describe("<Structure />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<CustomQuery />);
        wrapper.setState = {
            readData: [
                {
                    aplaceholder: 'Please type a query and click "Send"'
                }
            ],
            headerData: [
                {
                    Header: "Result",
                    accessor: "aplaceholder"
                }
            ],
            query:
                "MATCH (a:Author)-[:COMMITTED]->(c:Commit) RETURN a.name, c.message ORDER BY c.date desc LIMIT 20"
        };

        var html = wrapper.html();

        //console.log(html);
        expect(html).to.contain('<div class="card-header">Custom Cypher query');
    });

    it("Test popover click event", () => {
        var wrapper = shallow(<CustomQuery />);
        var html = wrapper.html();
        wrapper.find("#Popover").simulate("click");
        expect(html).to.contain("Custom Cypher query");
    });

    it("Test clear button", () => {
        var wrapper = shallow(<CustomQuery />);
        var html = wrapper.html();
        wrapper.find("#reset").simulate("click");
        expect(html).to.contain("Custom Cypher query");
    });

    it("Test send button", () => {
        var wrapper = shallow(<CustomQuery />);
        var html = wrapper.html();
        wrapper.find("#send").simulate("click");
        expect(html).to.contain("Custom Cypher query");
    });
});
