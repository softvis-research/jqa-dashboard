import React from "react";
import ReactDOM from "react-dom";
import ResourceManagementKnowledgeDistribution from "../../../../../views/Dashboard/ResourceManagement/KnowledgeDistribution/KnowledgeDistribution";

it("renders without crashing", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(<ResourceManagementKnowledgeDistribution />, div);
    ReactDOM.unmountComponentAtNode(div);
});
