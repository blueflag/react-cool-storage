// @flow
import React from 'react';

import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import ReachRouterQueryString from '../ReachRouterQueryString';
import ReactCoolStorageMessage from '../ReactCoolStorageMessage';

let navigate = () => {};

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors
//

test('ReachRouterQueryString must throw error if passed an invalid navigate', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc("query", ReachRouterQueryString({
    }))).toThrow(`ReachRouterQueryString expects param "config.navigate" to be a Reach Router navigate function`);
});

test('ReachRouterQueryString must throw error if passed an invalid method', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc("query", ReachRouterQueryString({
        navigate,
        method: "foo"
    }))).toThrow(`ReachRouterQueryString expects param "config.method" to be either "push" or "replace"`);
});


//
// Resource errors
//

test('ReachRouterQueryString must pass available: false if not passed a location prop', () => {
    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    expect(childProps.query.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.query.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.query.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.query.availabilityError).toBe(`ReachRouterQueryString requires a Reach Router location prop`);
});

test('ReachRouterQueryString must pass available: false if URLSearchParams is not available', () => {
    let temp = window.URLSearchParams;
    window.URLSearchParams = undefined;

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    window.URLSearchParams = temp;

    expect(childProps.query.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.query.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.query.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.query.availabilityError).toBe(`ReachRouterQueryString requires URLSearchParams to be defined`);
});

//
// Transparency
//

test('ReachRouterQueryString should pass through props', () => {
    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=456"
            },
            xyz: 789
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    expect(childProps.xyz).toBe(789);
});

//
// Child props
//

test('ReachRouterQueryString should accept reach router props and pass down its own correct child props (using JSON stringify)', () => {
    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=%22456%22&ghi=false"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    expect(childProps.query.value).toEqual({
        abc: 123,
        def: "456",
        ghi: false
    });
    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(true);
});

test('ReachRouterQueryString should notify of invalid data', () => {
    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=1827L@H#HR*&@))($*$$$"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    expect(childProps.query.value).toEqual({});
    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(false);
});

test('ReachRouterQueryString should pass its value through config.reconstruct', () => {
    let date = new Date(0);

    let reconstruct = jest.fn(({date, ...rest}) => ({
        date: new Date(date),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?date=%221970-01-01T00:00:00.000Z%22"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate,
            reconstruct
        }))
    ).props();

    expect(reconstruct.mock.calls[0][0]).toEqual({
        date: "1970-01-01T00:00:00.000Z"
    });

    expect(childProps.query.value.date.getTime()).toBe(date.getTime());
});

test('ReachRouterQueryString should pass value through config.parse', () => {
    let parse = (str: string) =>  JSON.parse(str.replace("abc", "ABC"));

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=456"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate,
            parse
        }))
    ).props();

    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(true);

    expect(childProps.query.value).toEqual({
        ABC: 123,
        def: 456
    });
});

//
// Changes
//

test('ReachRouterQueryString should push by default', () => {
    let navigate = jest.fn();

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    childProps.query.onChange({abc: 456});

    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?abc=456");
    expect(navigate.mock.calls[0][1]).toEqual({replace: false});
});

test('ReachRouterQueryString should replace', () => {
    let navigate = jest.fn();

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate,
            method: "replace"
        }))
    ).props();

    childProps.query.onChange({abc: 456});

    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?abc=456");
    expect(navigate.mock.calls[0][1]).toEqual({replace: true});
});

test('ReachRouterQueryString should merge its keys', () => {
    let navigate = jest.fn();

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=789"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    childProps.query.onChange({abc: 456});

    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?abc=456&def=789");
});

test('ReachRouterQueryString should merge its keys, deleting those which have been changed to undefined', () => {
    let navigate = jest.fn();

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123&def=789"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    childProps.query.onChange({abc: undefined});

    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?def=789");
});


test('ReachRouterQueryString should error when called with non-keyed data types', () => {
    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    ).props();

    let ERROR_MESSAGE = "ReachRouterQueryString onChange must be passed an object";

    expect(() => {
        childProps.query.onChange();
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.query.onChange(123);
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.query.onChange("abc");
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.query.onChange([]);
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.query.onChange(null);
    }).toThrow(ERROR_MESSAGE);
});

test('ReachRouterQueryString should pass its changed value through config.deconstruct', () => {
    let date = new Date(0);

    let navigate = jest.fn();
    let deconstruct = jest.fn(({date, ...rest}) => ({
        date: date.toJSON(),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: ""
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate,
            deconstruct
        }))
    ).props();

    childProps.query.onChange({date});

    expect(deconstruct.mock.calls[0][0]).toEqual({date});
    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?date=%221970-01-01T00%3A00%3A00.000Z%22");
});

test('ReachRouterQueryString should pass each changed value through config.stringify', () => {
    let navigate = jest.fn();
    let stringify = (data) => "A" + JSON.stringify(data);

    let childProps = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate,
            stringify
        }))
    ).props();

    childProps.query.onChange({abc: 456, def: 789});

    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.calls[0][0]).toBe("/abc?abc=A456&def=A789");
});

//
// Memoization
//

let navigateOnChange = (wrapper, navigate, prop, newValue) => {
    wrapper.props()[prop].onChange(newValue);
    let pathname = wrapper.props().location.pathname;
    wrapper.setProps({
        location: {
            pathname,
            search: navigate.mock.calls[navigate.mock.calls.length - 1][0].slice(pathname.length)
        }
    });
    wrapper.update();
};

test('ReachRouterQueryString should memoize properly', () => {
    let navigate = jest.fn();

    let wrapper = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    );

    let firstValue = wrapper.props().query.value;

    navigateOnChange(wrapper, navigate, "query", {abc: 123});

    let secondValue = wrapper.props().query.value;

    expect(firstValue).toEqual(secondValue);
    expect(firstValue).toBe(secondValue);

    navigateOnChange(wrapper, navigate, "query", {abc: 123});

    let thirdValue = wrapper.props().query.value;

    expect(secondValue).toEqual(thirdValue);
    expect(secondValue).toBe(thirdValue);
});

test('ReachRouterQueryString should memoize partially', () => {
    let navigate = jest.fn();

    let wrapper = shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: "?abc=%5B123%2C456%5D&def=%5B100%2C200%5D"
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    );

    let firstValue = wrapper.props().query.value;

    navigateOnChange(wrapper, navigate, "query", {abc: [123, 456], def: [100, 200]});

    let secondValue = wrapper.props().query.value;

    expect(firstValue.abc).toEqual(secondValue.abc);
    expect(firstValue.abc).toBe(secondValue.abc);
    expect(firstValue.def).toEqual(secondValue.def);
    expect(firstValue.def).toBe(secondValue.def);

    navigateOnChange(wrapper, navigate, "query", {abc: [123, 789], def: [100, 200]});

    let thirdValue = wrapper.props().query.value;

    expect(secondValue.abc).not.toEqual(thirdValue.abc);
    expect(secondValue.abc).not.toBe(thirdValue.abc);
    expect(secondValue.def).toEqual(thirdValue.def);
    expect(secondValue.def).toBe(thirdValue.def);
});


//
// Data types
//

const setAndRefresh = (value: *) => {

    let navigate = jest.fn();

    shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search: ""
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    )
        .props()
        .query
        .onChange(value);

    let search = navigate.mock.calls[0][0].slice(4);

    return shallowRenderHoc(
        {
            location: {
                pathname: "/abc",
                search
            }
        },
        ReactCoolStorageHoc("query", ReachRouterQueryString({
            navigate
        }))
    )
        .props()
        .query
        .value;
};

test('ReachRouterQueryString should cope with various data types', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
    expect(setAndRefresh({abc: 123})).toEqual({abc: 123});
    expect(setAndRefresh({abc: true})).toEqual({abc: true});
    expect(setAndRefresh({abc: undefined})).toEqual({});
    expect(setAndRefresh({abc: [1,2,3]})).toEqual({abc: [1,2,3]});
    expect(setAndRefresh({abc: [1,2,null]})).toEqual({abc: [1,2,null]});
    expect(setAndRefresh({abc: [1,2,undefined]})).toEqual({abc: [1,2,null]}); // undefined is cast to null due to json stringification
});
