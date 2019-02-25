// @flow
import React from 'react';

import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import ReactRouterQueryString from '../ReactRouterQueryString';
import ReactCoolStorageMessage from '../ReactCoolStorageMessage';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors
//

test('ReactRouterQueryString must throw error if passed an invalid method', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc("query", ReactRouterQueryString({
        method: "foo"
    }))).toThrow(`ReactRouterQueryString expects param "config.method" to be either "push" or "replace"`);
});

//
// Resource errors
//

test('ReactRouterQueryString must pass available: false if not passed a history prop', () => {
    let childProps = shallowRenderHoc(
        {
            location: {
                search: "?abc=123&def=456"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    expect(childProps.query.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.query.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.query.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.query.availabilityError).toBe(`ReactRouterQueryString requires React Router history and location props`);
});

test('ReactRouterQueryString must pass available: false if not passed a location prop', () => {
    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    expect(childProps.query.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.query.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.query.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.query.availabilityError).toBe(`ReactRouterQueryString requires React Router history and location props`);
});

test('ReactRouterQueryString must pass available: false if URLSearchParams is not available', () => {
    let temp = window.URLSearchParams;
    window.URLSearchParams = undefined;

    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    window.URLSearchParams = temp;

    expect(childProps.query.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.query.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.query.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.query.availabilityError).toBe(`ReactRouterQueryString requires URLSearchParams to be defined`);
});

//
// Transparency
//

test('ReactRouterQueryString should pass through props', () => {
    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?abc=123&def=456"
            },
            xyz: 789
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    expect(childProps.xyz).toBe(789);
});

//
// Child props
//

test('ReactRouterQueryString should accept react router props and pass down its own correct child props (using JSON stringify)', () => {
    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?abc=123&def=%22456%22&ghi=false"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    expect(childProps.query.value).toEqual({
        abc: 123,
        def: "456",
        ghi: false
    });
    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(true);
});

test('ReactRouterQueryString should notify of invalid data', () => {
    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?abc=123&def=1827L@H#HR*&@))($*$$$"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    expect(childProps.query.value).toEqual({});
    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(false);
});

test('ReactRouterQueryString should pass its value through config.reconstruct', () => {
    let date = new Date(0);

    let reconstruct = jest.fn(({date, ...rest}) => ({
        date: new Date(date),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?date=%221970-01-01T00:00:00.000Z%22"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            reconstruct
        }))
    ).props();

    expect(reconstruct.mock.calls[0][0]).toEqual({
        date: "1970-01-01T00:00:00.000Z"
    });

    expect(childProps.query.value.date.getTime()).toBe(date.getTime());
});

test('ReactRouterQueryString should pass each value through config.parse', () => {
    let parse = (str: string) => JSON.parse(str.slice(1));

    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?abc=A123&def=A456"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            name: "query",
            parse
        }))
    ).props();

    expect(childProps.query.available).toBe(true);
    expect(childProps.query.valid).toBe(true);

    expect(childProps.query.value).toEqual({
        abc: 123,
        def: 456
    });
});

//
// Changes
//

test('ReactRouterQueryString should push by default', () => {
    let push = jest.fn();
    let replace = jest.fn();

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    childProps.query.onChange({abc: 456});

    expect(push).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(push.mock.calls[0][0]).toBe("?abc=456");
});

test('ReactRouterQueryString should replace', () => {
    let push = jest.fn();
    let replace = jest.fn();

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            name: "query",
            method: "replace"
        }))
    ).props();

    childProps.query.onChange({abc: 456});

    expect(replace).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(replace.mock.calls[0][0]).toBe("?abc=456");
});

test('ReactRouterQueryString should merge its keys', () => {
    let push = jest.fn();
    let replace = jest.fn();

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123&def=789"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    childProps.query.onChange({abc: 456});

    expect(push).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(push.mock.calls[0][0]).toBe("?abc=456&def=789");
});

test('ReactRouterQueryString should merge its keys, deleting those which have been changed to undefined', () => {
    let push = jest.fn();
    let replace = jest.fn();

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123&def=789"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    childProps.query.onChange({abc: undefined});

    expect(push).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(push.mock.calls[0][0]).toBe("?def=789");
});


test('ReactRouterQueryString should error when called with non-keyed data types', () => {
    let push = jest.fn();
    let replace = jest.fn();

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    ).props();

    let ERROR_MESSAGE = "ReactRouterQueryString onChange must be passed an object";

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

test('ReactRouterQueryString should pass its changed value through config.deconstruct', () => {
    let date = new Date(0);

    let push = jest.fn();
    let replace = jest.fn();
    let deconstruct = jest.fn(({date, ...rest}) => ({
        date: date.toJSON(),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: ""
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            name: "query",
            deconstruct
        }))
    ).props();

    childProps.query.onChange({date});

    expect(deconstruct.mock.calls[0][0]).toEqual({date});
    expect(push).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(push.mock.calls[0][0]).toBe("?date=%221970-01-01T00%3A00%3A00.000Z%22");
});

test('ReactRouterQueryString should pass each changed value through config.stringify', () => {
    let push = jest.fn();
    let replace = jest.fn();
    let stringify = (data) => "A" + JSON.stringify(data);

    let childProps = shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            name: "query",
            stringify
        }))
    ).props();

    childProps.query.onChange({abc: 456, def: 789});

    expect(push).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(push.mock.calls[0][0]).toBe("?abc=A456&def=A789");
});

//
// Data types
//

const setAndRefresh = (value: *) => {

    let push = jest.fn();
    let replace = jest.fn();

    shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search: ""
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    )
        .props()
        .query
        .onChange(value);

    let search = push.mock.calls[0][0];

    return shallowRenderHoc(
        {
            history: {
                push,
                replace
            },
            location: {
                search
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    )
        .props()
        .query
        .value;
};

test('ReactRouterQueryString should cope with various data types', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
    expect(setAndRefresh({abc: 123})).toEqual({abc: 123});
    expect(setAndRefresh({abc: true})).toEqual({abc: true});
    expect(setAndRefresh({abc: undefined})).toEqual({});
    expect(setAndRefresh({abc: [1,2,3]})).toEqual({abc: [1,2,3]});
    expect(setAndRefresh({abc: [1,2,null]})).toEqual({abc: [1,2,null]});
    expect(setAndRefresh({abc: [1,2,undefined]})).toEqual({abc: [1,2,null]}); // undefined is cast to null due to json stringification
});
