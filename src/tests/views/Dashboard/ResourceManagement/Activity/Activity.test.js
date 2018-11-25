import React from "react";
import ReactDOM from "react-dom";
import ResourceManagementActivity from "../../../../../views/Dashboard/ResourceManagement/Activity/Activity";
import { shallow } from "enzyme/build/index";

/* TODO: fix this test
it("renders without crashing", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<ResourceManagementActivity />, div);
    ReactDOM.unmountComponentAtNode(div);
});
*/

it("click on reset", () => {
    var wrapper = shallow(<ResourceManagementActivity />);
    wrapper
        .find("#reset")
        .first()
        .simulate("click");
});
