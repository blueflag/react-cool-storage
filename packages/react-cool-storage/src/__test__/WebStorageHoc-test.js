// @flow
import React from 'react';

import WebStorageHoc from '../WebStorageHoc';
import ReactCoolStorageMessage from '../ReactCoolStorageMessage';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors
//

test('WebStorageHoc must be passed a key, and throw an error if it isnt', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => WebStorageHoc({})).toThrow(`WebStorageHoc expects param "config.key" to be a string, but got undefined`);
});


test('WebStorageHoc must be passed a name, and throw an error if it isnt', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => WebStorageHoc({
        key: "storageKey"
    })).toThrow(`WebStorageHoc expects param "config.name" to be a string, but got undefined`);
});

test('WebStorageHoc must throw error if passed an invalid method', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => WebStorageHoc({
        key: "storageKey",
        method: "foo"
    })).toThrow(`WebStorageHoc expects param "config.method" to be either "localStorage" or "sessionStorage"`);
});

//
// Resource errors
//

test('WebStorageHoc must throw error if localStorage doesnt exist prop', () => {
    let temp = window.localStorage;
    delete window.localStorage;

    expect(() => {
        shallowRenderHoc(
            {},
            WebStorageHoc({
                name: "storage",
                key: "localStorageKey"
            })
        );
    }).toThrow(`WebStorageHoc requires localStorage to be available`);

    window.localStorage = temp;
});

test('WebStorageHoc must silently pass available: false if not passed a history prop and silent: true', () => {
    let temp = window.localStorage;
    delete window.localStorage;

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey",
            silent: true
        })
    ).props();

    expect(childProps.storage).toBe(ReactCoolStorageMessage.unavailable);

    window.localStorage = temp;

    // for coverage, call noop change function
    childProps.storage.onChange();
});

//
// Transparency
//

test('WebStorageHoc should pass through props', () => {
    let childProps = shallowRenderHoc(
        {
            xyz: 789
        },
        WebStorageHoc({
            name: "storage",
            key: "storageKey"
        })
    ).props();

    expect(childProps.xyz).toBe(789);
});

//
// Child props
//

test('WebStorageHoc should read localStorage and pass down props', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    expect(childProps.storage.value).toEqual({
        abc: 123
    });
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});

test('WebStorageHoc should read sessionStorage if told to and pass down props', () => {
    sessionStorage.setItem("sessionStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "sessionStorageKey",
            method: "sessionStorage"
        })
    ).props();

    expect(childProps.storage.value).toEqual({
        abc: 123
    });
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});


test('WebStorageHoc should cope with unset data in localStorage', () => {
    localStorage.clear();

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    expect(childProps.storage.value).toEqual({});
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});


test('WebStorageHoc should notify of invalid data', () => {
    localStorage.setItem("localStorageKey", `{1231*(&@@&#Y(223423423}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    expect(childProps.storage.value).toEqual({});
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(false);
});

test('WebStorageHoc should pass its value through config.reconstruct', () => {
    let date = new Date(0);

    localStorage.setItem("localStorageKey", `{"date":"1970-01-01T00:00:00.000Z"}`);

    let reconstruct = jest.fn(({date, ...rest}) => ({
        date: new Date(date),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey",
            reconstruct
        })
    ).props();

    expect(reconstruct.mock.calls[0][0]).toEqual({
        date: "1970-01-01T00:00:00.000Z"
    });

    expect(childProps.storage.value.date.getTime()).toBe(date.getTime());
});

test('WebStorageHoc should pass the whole value through config.parse', () => {

    localStorage.setItem("localStorageKey", `A{"abc":123,"def":456}`);

    let parse = (str: string) => JSON.parse(str.slice(1));

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey",
            parse
        })
    ).props();

    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);

    expect(childProps.storage.value).toEqual({
        abc: 123,
        def: 456
    });
});

//
// Changes
//

test('WebStorageHoc should setItem properly', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    childProps.storage.onChange({abc: 456});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"abc":456}`);
});

test('WebStorageHoc should merge its keys', () => {
    localStorage.setItem("localStorageKey", `{"abc":123,"def":789}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    childProps.storage.onChange({abc: 456});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"abc":456,"def":789}`);
});

test('WebStorageHoc should merge its keys, deleting those which have been changed to undefined', () => {
    localStorage.setItem("localStorageKey", `{"abc":123,"def":789}`);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    childProps.storage.onChange({abc: undefined});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"def":789}`);
});

test('WebStorageHoc should error when called with non-keyed data types', () => {
    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    ).props();

    let ERROR_MESSAGE = "WebStorageHoc onChange must be passed an object";

    expect(() => {
        childProps.storage.onChange();
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.storage.onChange(123);
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.storage.onChange("abc");
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.storage.onChange([]);
    }).toThrow(ERROR_MESSAGE);

    expect(() => {
        childProps.storage.onChange(null);
    }).toThrow(ERROR_MESSAGE);
});

test('WebStorageHoc should pass its changed value through config.deconstruct', () => {
    localStorage.setItem("localStorageKey", `{}`);

    let date = new Date(0);

    let deconstruct = jest.fn(({date, ...rest}) => ({
        date: date.toJSON(),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey",
            deconstruct
        })
    ).props();

    childProps.storage.onChange({date});

    expect(deconstruct.mock.calls[0][0]).toEqual({date});
    expect(localStorage.getItem("localStorageKey")).toBe(`{"date":"1970-01-01T00:00:00.000Z"}`);
});

test('WebStorageHoc should pass the value through config.stringify', () => {
    localStorage.setItem("localStorageKey", `{}`);
    let stringify = (data) => "A" + JSON.stringify(data);

    let childProps = shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey",
            stringify
        })
    ).props();

    childProps.storage.onChange({abc: 456, def: 789});

    expect(localStorage.getItem("localStorageKey")).toBe(`A{"abc":456,"def":789}`);
});

//
// Data types
//

const setAndRefresh = (value: *) => {

    localStorage.setItem("localStorageKey", `{}`);

    shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    )
        .props()
        .storage
        .onChange(value);

    return shallowRenderHoc(
        {},
        WebStorageHoc({
            name: "storage",
            key: "localStorageKey"
        })
    )
        .props()
        .storage
        .value;
};

test('WebStorageHoc should cope with various data types', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
    expect(setAndRefresh({abc: 123})).toEqual({abc: 123});
    expect(setAndRefresh({abc: true})).toEqual({abc: true});
    expect(setAndRefresh({abc: undefined})).toEqual({});
    expect(setAndRefresh({abc: [1,2,3]})).toEqual({abc: [1,2,3]});
    expect(setAndRefresh({abc: [1,2,null]})).toEqual({abc: [1,2,null]});
    expect(setAndRefresh({abc: [1,2,undefined]})).toEqual({abc: [1,2,null]}); // undefined is cast to null due to json stringification
});
