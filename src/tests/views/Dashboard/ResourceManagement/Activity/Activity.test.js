import React from "react";
import ReactDOM from "react-dom";
import ResourceManagementActivity from "../../../../../views/Dashboard/ResourceManagement/Activity/Activity";
import { shallow } from "enzyme/build/index";

it("renders without crashing", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<ResourceManagementActivity />, div);
    ReactDOM.unmountComponentAtNode(div);
});
