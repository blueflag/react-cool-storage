// @flow
import React from 'react';
import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import ReactRouterQueryString from '../ReactRouterQueryString';
import WebStorage from '../WebStorage';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors
//

test('ReactCoolStorageHoc must be passed a name, and throw an error if it isnt', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc()).toThrow(`ReactCoolStorageHoc expects first param to be a string, but got undefined`);
});

// Fallbacks

test('ReactCoolStorageHoc should fall back if a storage mechanism is not available', () => {
    // $FlowFixMe - intentional misuse of type

    let childProps = shallowRenderHoc(
        {
            // deliberately missing location prop
            // so ReactRouterQueryString cannot work
            // and must cause fallback
        },
        ReactCoolStorageHoc(
            "prop",
            ReactRouterQueryString(),
            WebStorage({
                key: "storageKey"
            })
        )
    ).props();

    // fallback storage mehanism should still be available
    expect(childProps.prop.available).toBe(true);
    expect(childProps.prop.storageType).toBe("WebStorage");
});
