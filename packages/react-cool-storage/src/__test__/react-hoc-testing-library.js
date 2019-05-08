/* eslint-disable */
import React from 'react';
import {shallow} from 'enzyme';

export const renderHoc = (hoc, initialProps) => {
    let Component = hoc(() => <div />);
    let wrapper = shallow(<Component {...initialProps}/>);

    let result = {
        current: wrapper.props()
    };

    let rerender = () => console.log("Not implemented yet");

    return {
        result,
        rerender,
        act: (callback) => {
            callback();
            wrapper.setProps({});
            // ^ TEMPORARY: using useState hook and wrapper.update() alone
            // is not enough to get this version of enzyme to recognise
            // that state has been changed
            wrapper.update();
            result.current = wrapper.props();
        }
    };
};
