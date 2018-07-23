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
        var flatData = [
            {
                id: 5,
                name: "org.springframework",
                coverage: -1,
                loc: 0,
                level: 2
            },
            {
                id: 6,
                name: "org",
                coverage: -1,
                loc: 0,
                level: 1
            }
        ];

        var hierarchicalData = cpHelper.circlePackingByName("test", flatData);

        cpHelper.normalizeHotspots(hierarchicalData);
        cpHelper.normalizeTestCoverage(hierarchicalData);

        expect(hierarchicalData);
    });

    it("should render without throwing an error", () => {
        var cpHelper = new CirclePackingHelper();
        var flatData = [
            {
                id: 5,
                name: "org.springframework",
                coverage: -1,
                loc: 0,
                level: 2
            },
            {
                id: 6,
                name: "org",
                coverage: -1,
                loc: 0,
                level: 1
            }
        ];

        var collectedNames = [];
        collectedNames["org"] = 6;
        collectedNames["org.springframework"] = 5;
        cpHelper.circlePackingById("test", flatData, collectedNames);

        expect(flatData);
    });
});
