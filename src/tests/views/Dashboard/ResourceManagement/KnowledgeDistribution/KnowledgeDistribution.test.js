import React from "react";
import ReactDOM from "react-dom";
import ResourceManagementKnowledgeDistribution from "../../../../../views/Dashboard/ResourceManagement/KnowledgeDistribution/KnowledgeDistribution";
import { shallow } from "enzyme/build/index";

/* TODO: fix this test
it("renders without crashing", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<ResourceManagementKnowledgeDistribution />, div);
    ReactDOM.unmountComponentAtNode(div);
});
*/

it("click on reset", () => {
    var wrapper = shallow(<ResourceManagementKnowledgeDistribution />);
    wrapper
        .find("#reset")
        .first()
        .simulate("click");
});
