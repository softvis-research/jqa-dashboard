import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import { expect } from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
//import renderer from 'react-test-renderer';

//component to test
import TestCoverageTreeMap from "../../../../../../views/Dashboard/QualityManagement/TestCoverage/visualizations/TestCoverageTreeMap";
import ReactDOM from "react-dom";

describe("<TestCoverageTreeMap />", () => {
    it("should render without throwing an error", () => {
        var wrapper = shallow(<TestCoverageTreeMap />);
        wrapper.setState({
            testCoverageData: {
                name: "nivo",
                color: "hsl(306, 70%, 50%)",
                children: [
                    {
                        name: "viz",
                        color: "hsl(68, 70%, 50%)",
                        children: [
                            {
                                name: "stack",
                                color: "hsl(206, 70%, 50%)",
                                children: [
                                    {
                                        name: "chart",
                                        color: "hsl(129, 70%, 50%)",
                                        loc: 103994
                                    }
                                ]
                            },
                            {
                                name: "pie",
                                color: "hsl(327, 70%, 50%)",
                                children: [
                                    {
                                        name: "chart",
                                        color: "hsl(193, 70%, 50%)",
                                        children: [
                                            {
                                                name: "pie",
                                                color: "hsl(324, 70%, 50%)",
                                                children: [
                                                    {
                                                        name: "outline",
                                                        color:
                                                            "hsl(2, 70%, 50%)",
                                                        loc: 42748
                                                    },
                                                    {
                                                        name: "slices",
                                                        color:
                                                            "hsl(280, 70%, 50%)",
                                                        loc: 143471
                                                    },
                                                    {
                                                        name: "bbox",
                                                        color:
                                                            "hsl(145, 70%, 50%)",
                                                        loc: 119770
                                                    }
                                                ]
                                            },
                                            {
                                                name: "donut",
                                                color: "hsl(173, 70%, 50%)",
                                                loc: 180516
                                            },
                                            {
                                                name: "gauge",
                                                color: "hsl(60, 70%, 50%)",
                                                loc: 167478
                                            }
                                        ]
                                    },
                                    {
                                        name: "legends",
                                        color: "hsl(166, 70%, 50%)",
                                        loc: 156327
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "colors",
                        color: "hsl(175, 70%, 50%)",
                        children: [
                            {
                                name: "rgb",
                                color: "hsl(27, 70%, 50%)",
                                loc: 183910
                            },
                            {
                                name: "hsl",
                                color: "hsl(71, 70%, 50%)",
                                loc: 77408
                            }
                        ]
                    }
                ]
            }
        });
        var html = wrapper.html();

        expect(html).to.contain(
            '<div class="test-coverage" style="height:800px">'
        );
    });
});
