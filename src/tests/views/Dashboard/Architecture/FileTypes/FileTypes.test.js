import React from "react";
import ReactDOM from "react-dom";
import ArchitectureFileTypes from "../../../../../views/Dashboard/Architecture/FileTypes/FileTypes";
import { shallow } from "enzyme/build/index";

/* TODO: fix this test
it("renders without crashing", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<ArchitectureFileTypes />, div);
    ReactDOM.unmountComponentAtNode(div);
});
*/

it("click on popover", () => {
    var wrapper = shallow(<ArchitectureFileTypes />);
    wrapper.find("#Popover1").simulate("click");
});
