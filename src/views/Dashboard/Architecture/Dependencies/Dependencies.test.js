import React from 'react';

//testing stuff
import { shallow, mount, render } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//component to test
import Dependencies from './Dependencies';
import {expect} from "chai";
//import sinon from "sinon";

Enzyme.configure({
    disableLifecycleMethods: false
});

jest.setTimeout(30000);

describe('DependenciesTest', () => {

    it('should render without throwing an error', (done) => {

        var wrapper = Enzyme.shallow(<Dependencies />
            //React.createElement(Dependencies)
        );

        setTimeout(function() {
            console.log(wrapper.html());
            expect(wrapper.html()).to.contain('<div class="card-header">Dependencies</div>');
        }, 20000);

        //wrapper.update();
        //var html = wrapper.html();
/*
        setImmediate(() => {
            console.log(wrapper.state('finalMatrixData'));
            expect(wrapper.state('finalMatrixData').length).toBeGreaterThan(0);
            done();
        }, 0);
/ *
        return promise.then(() => {
            //expect(wrapper.state()).to.have.property('dataReady', true);
            wrapper.update();
        }).then(() => {
            expect(wrapper.html()).to.contain('<div class="card-header">Dependencies</div>');
            expect(wrapper.html()).to.contain('<svg>');
        });

        //
        //expect(html).to.contain('<svg>');
        */
    });
});