// @flow
import ReactCoolStorageHoc from '../ReactCoolStorageHoc';

//
// Config errors
//

test('ReactRouterQueryString must be passed a name, and throw an error if it isnt', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc()).toThrow(`ReactCoolStorageHoc expects first param to be a string, but got undefined`);
});
