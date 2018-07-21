import React from "react";

//testing stuff
import { shallow, mount, render } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

//component to test
import routes from "../routes";
import { expect } from "chai";

it("should render without throwing an error", () => {
    console.log(routes);
    expect(routes);
});
