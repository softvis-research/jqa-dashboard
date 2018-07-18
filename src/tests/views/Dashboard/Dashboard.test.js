import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

//component to test
import Dashboard from "../../../views/Dashboard/Dashboard";
import { expect } from "chai";

describe("<Dashboard />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<Dashboard />);
        wrapper.setState({
            architectureMetrics: {
                classes: "loading",
                interfaces: "loading",
                enums: "loading",
                annotations: "loading",
                methods: "loading",
                loc: "loading",
                fields: "loading"
            },
            relationMetrics: {
                dependencies: "loading",
                extends: "loading",
                implements: "loading",
                invocations: "loading",
                reads: "loading",
                writes: "loading"
            },
            resourceManagementMetrics: {
                authors: "loading",
                commitsWithoutMerges: "loading",
                commitsWithMerges: "loading"
            },
            qualityManagementMetrics: {
                violations: "loading"
            }
        });

        var html = wrapper.html();

        expect(html).to.contain("<strong>Structure metrics</strong>");
        expect(html).to.contain("<strong>Dependency metrics</strong>");
        expect(html).to.contain("<strong>Activity metrics</strong>");
        expect(html).to.contain("<strong>Static Code Analysis (PMD)</strong>");
    });
});
