import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import { expect } from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import CirclePackingHelper from "../../../api/utils/CirclePacking";
import ReactDOM from "react-dom";

describe("Circle Packing", () => {
    it("should render without throwing an error", () => {
        var cpHelper = new CirclePackingHelper();
        var hierarchicalData = cpHelper.circlePackingByName("test", [
            {
                name: "junit.extensions.ActiveTestSuite",
                complexity: 22,
                loc: 46,
                commits: 30,
                level: 3,
                role: "leaf"
            },
            {
                name: "junit.extensions",
                complexity: 0,
                loc: 0,
                commits: 0,
                level: 2,
                role: "node"
            },
            {
                name: "junit",
                complexity: 0,
                loc: 0,
                commits: 0,
                level: 1,
                role: "node"
            }
        ]);

        expect(hierarchicalData);
    });
});
