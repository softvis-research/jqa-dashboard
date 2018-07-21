import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

//component to test
import Settings from "../../../../views/Dashboard/Header/Settings";
import { expect } from "chai";

describe("<Settings />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<Settings />);
        wrapper.setState = {
            popoverOpen: false,
            popovers: [
                {
                    placement: "bottom",
                    text: "Bottom"
                }
            ]
        };

        var html = wrapper.html();

        //console.log(html);
        expect(html).to.contain('<div class="card-header">Settings');
    });

    it("Test popover click event", () => {
        var wrapper = shallow(<Settings />);
        var html = wrapper.html();
        wrapper.find("#Popover2").simulate("click");
        expect(html).to.contain("Settings");
    });

    it("Test reset button", () => {
        var wrapper = shallow(<Settings />);
        var html = wrapper.html();
        wrapper.find("#reset").simulate("click");
        expect(html).to.contain("Settings");
    });

    it("Test save button", () => {
        var wrapper = shallow(<Settings />);
        var html = wrapper.html();
        wrapper.find("#save").simulate("click");
        expect(html).to.contain("Settings");
    });
});
