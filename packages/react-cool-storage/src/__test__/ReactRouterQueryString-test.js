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

test('ReactRouterQueryString should pass value through config.parse', () => {
    let parse = (str: string) => JSON.parse(str.replace("abc", "ABC"));

    let childProps = shallowRenderHoc(
        {
            history: {
                push: () => {},
                replace: () => {}
            },
            location: {
                search: "?abc=123&def=456"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
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
// Memoization
//

let pushOnChange = (wrapper, push, prop, newValue) => {
    wrapper.props()[prop].onChange(newValue);
    wrapper.setProps({
        history: {
            push
        },
        location: {
            search: push.mock.calls[push.mock.calls.length - 1][0]
        }
    });
    wrapper.update();
};

test('ReactRouterQueryString should memoize properly', () => {
    let push = jest.fn();

    let wrapper = shallowRenderHoc(
        {
            history: {
                push
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    );

    let firstValue = wrapper.props().query.value;

    pushOnChange(wrapper, push, "query", {abc: 123});

    let secondValue = wrapper.props().query.value;

    expect(firstValue).toEqual(secondValue);
    expect(firstValue).toBe(secondValue);

    pushOnChange(wrapper, push, "query", {abc: 123});

    let thirdValue = wrapper.props().query.value;

    expect(secondValue).toEqual(thirdValue);
    expect(secondValue).toBe(thirdValue);
});

test('ReactRouterQueryString should not memoize if config.memoize = false', () => {
    let push = jest.fn();

    let wrapper = shallowRenderHoc(
        {
            history: {
                push
            },
            location: {
                search: "?abc=123"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString({
            memoize: false
        }))
    );

    let firstValue = wrapper.props().query.value;

    pushOnChange(wrapper, push, "query", {abc: 123});

    let secondValue = wrapper.props().query.value;

    expect(firstValue).toEqual(secondValue);
    expect(firstValue).not.toBe(secondValue);
});

test('ReactRouterQueryString should memoize partially', () => {
    let push = jest.fn();

    let wrapper = shallowRenderHoc(
        {
            history: {
                push
            },
            location: {
                search: "?abc=%5B123%2C456%5D&def=%5B100%2C200%5D"
            }
        },
        ReactCoolStorageHoc("query", ReactRouterQueryString())
    );

    let firstValue = wrapper.props().query.value;

    pushOnChange(wrapper, push, "query", {abc: [123, 456], def: [100, 200]});

    let secondValue = wrapper.props().query.value;

    expect(firstValue.abc).toEqual(secondValue.abc);
    expect(firstValue.abc).toBe(secondValue.abc);
    expect(firstValue.def).toEqual(secondValue.def);
    expect(firstValue.def).toBe(secondValue.def);

    pushOnChange(wrapper, push, "query", {abc: [123, 789], def: [100, 200]});

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
