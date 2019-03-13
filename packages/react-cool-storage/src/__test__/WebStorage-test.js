// @flow
import React from 'react';

import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import WebStorage from '../WebStorage';
import ReactCoolStorageMessage from '../ReactCoolStorageMessage';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors
//

test('WebStorage must be passed a key, and throw an error if it isnt', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc("storage", WebStorage({}))).toThrow(`WebStorage expects param "config.key" to be a string, but got undefined`);
});

test('WebStorage must throw error if passed an invalid method', () => {
    // $FlowFixMe - intentional misuse of types
    expect(() => ReactCoolStorageHoc("storage", WebStorage({
        key: "storageKey",
        method: "foo"
    }))).toThrow(`WebStorage expects param "config.method" to be either "localStorage" or "sessionStorage"`);
});

//
// Resource errors
//

test('WebStorage must pass available: false if localStorage doesnt exist', () => {
    let temp = window.localStorage;
    delete window.localStorage;

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    expect(childProps.storage.value).toBe(ReactCoolStorageMessage.unavailable.value);
    expect(childProps.storage.valid).toBe(ReactCoolStorageMessage.unavailable.valid);
    expect(childProps.storage.available).toBe(ReactCoolStorageMessage.unavailable.available);
    expect(childProps.storage.availabilityError).toBe(`WebStorage requires localStorage to be available`);

    window.localStorage = temp;
});

//
// Transparency
//

test('WebStorage should pass through props', () => {
    let childProps = shallowRenderHoc(
        {
            xyz: 789
        },
        ReactCoolStorageHoc("storage", WebStorage({
            key: "storageKey"
        }))
    ).props();

    expect(childProps.xyz).toBe(789);
});

//
// Child props
//

test('WebStorage should read localStorage and pass down props', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    expect(childProps.storage.value).toEqual({
        abc: 123
    });
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});

test('WebStorage should read sessionStorage if told to and pass down props', () => {
    sessionStorage.setItem("sessionStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "sessionStorageKey",
            method: "sessionStorage"
        }))
    ).props();

    expect(childProps.storage.value).toEqual({
        abc: 123
    });
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});


test('WebStorage should cope with unset data in localStorage', () => {
    localStorage.clear();

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    expect(childProps.storage.value).toEqual({});
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(true);
});


test('WebStorage should notify of invalid data', () => {
    localStorage.setItem("localStorageKey", `{1231*(&@@&#Y(223423423}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    expect(childProps.storage.value).toEqual({});
    expect(childProps.storage.available).toBe(true);
    expect(childProps.storage.valid).toBe(false);
});

test('WebStorage should pass its value through config.reconstruct', () => {
    let date = new Date(0);

    localStorage.setItem("localStorageKey", `{"date":"1970-01-01T00:00:00.000Z"}`);

    let reconstruct = jest.fn(({date, ...rest}) => ({
        date: new Date(date),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey",
            reconstruct
        }))
    ).props();

    expect(reconstruct.mock.calls[0][0]).toEqual({
        date: "1970-01-01T00:00:00.000Z"
    });

    expect(childProps.storage.value.date.getTime()).toBe(date.getTime());
});

test('WebStorage should pass the whole value through config.parse', () => {

    localStorage.setItem("localStorageKey", `A{"abc":123,"def":456}`);

    let parse = (str: string) => JSON.parse(str.slice(1));

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey",
            parse
        }))
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

test('WebStorage should setItem properly', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    childProps.storage.onChange({abc: 456});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"abc":456}`);
});

test('WebStorage should merge its keys', () => {
    localStorage.setItem("localStorageKey", `{"abc":123,"def":789}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    childProps.storage.onChange({abc: 456});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"abc":456,"def":789}`);
});

test('WebStorage should merge its keys, deleting those which have been changed to undefined', () => {
    localStorage.setItem("localStorageKey", `{"abc":123,"def":789}`);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    childProps.storage.onChange({abc: undefined});

    expect(localStorage.getItem("localStorageKey")).toBe(`{"def":789}`);
});

test('WebStorage should error when called with non-keyed data types', () => {
    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    ).props();

    let ERROR_MESSAGE = "WebStorage onChange must be passed an object";

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

test('WebStorage should pass its changed value through config.deconstruct', () => {
    localStorage.setItem("localStorageKey", `{}`);

    let date = new Date(0);

    let deconstruct = jest.fn(({date, ...rest}) => ({
        date: date.toJSON(),
        ...rest
    }));

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey",
            deconstruct
        }))
    ).props();

    childProps.storage.onChange({date});

    expect(deconstruct.mock.calls[0][0]).toEqual({date});
    expect(localStorage.getItem("localStorageKey")).toBe(`{"date":"1970-01-01T00:00:00.000Z"}`);
});

test('WebStorage should pass the value through config.stringify', () => {
    localStorage.setItem("localStorageKey", `{}`);
    let stringify = (data) => "A" + JSON.stringify(data);

    let childProps = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey",
            stringify
        }))
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
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    )
        .props()
        .storage
        .onChange(value);

    return shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    )
        .props()
        .storage
        .value;
};

test('WebStorage should cope with various data types', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
    expect(setAndRefresh({abc: 123})).toEqual({abc: 123});
    expect(setAndRefresh({abc: true})).toEqual({abc: true});
    expect(setAndRefresh({abc: undefined})).toEqual({});
    expect(setAndRefresh({abc: [1,2,3]})).toEqual({abc: [1,2,3]});
    expect(setAndRefresh({abc: [1,2,null]})).toEqual({abc: [1,2,null]});
    expect(setAndRefresh({abc: [1,2,undefined]})).toEqual({abc: [1,2,null]}); // undefined is cast to null due to json stringification
});

//
// synchronisation
//

test('WebStorage should update one hoc when another updates', () => {
    localStorage.setItem("localStorageKey", `{}`);

    let wrapper1 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    );

    let wrapper2 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    );

    wrapper1
        .props()
        .storage
        .onChange({abc: 123});

    let value1 = wrapper1
        .props()
        .storage
        .value;

    let value2 = wrapper2
        .props()
        .storage
        .value;

    expect(value1).toEqual({abc: 123});
    expect(value2).toEqual({abc: 123});
});

test('WebStorage should not sync hocs when different keys are used', () => {
    localStorage.setItem("localStorageKey1", `{}`);
    localStorage.setItem("localStorageKey2", `{}`);

    let wrapper1 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey1"
        }))
    );

    let wrapper2 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey2"
        }))
    );

    wrapper1
        .props()
        .storage
        .onChange({abc: 123});

    let value1 = wrapper1
        .props()
        .storage
        .value;

    let value2 = wrapper2
        .props()
        .storage
        .value;

    expect(value1).toEqual({abc: 123});
    expect(value2).toEqual({});
});

//
// usage outside React
//

test('WebStorage available should be accessible from WebStorage instance', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let webStorage = WebStorage({
        key: "localStorageKey"
    });

    expect(webStorage.available).toBe(true);
});

test('WebStorage value should be accessible from WebStorage instance', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let webStorage = WebStorage({
        key: "localStorageKey"
    });

    expect(webStorage.value).toEqual({abc: 123});
});

test('WebStorage value should be changeable from WebStorage instance', () => {
    localStorage.setItem("localStorageKey", `{"abc":123}`);

    let wrapper = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", WebStorage({
            key: "localStorageKey"
        }))
    );

    let webStorage = WebStorage({
        key: "localStorageKey"
    });

    webStorage.onChange({abc: 456});

    let value = wrapper
        .props()
        .storage
        .value;

    expect(webStorage.value).toEqual({abc: 456});
});

