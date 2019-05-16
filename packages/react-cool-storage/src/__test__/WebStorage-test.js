// @flow
import ReactCoolStorageHook from '../ReactCoolStorageHook';
import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import WebStorage from '../WebStorage';
import InvalidValueMarker from '../InvalidValueMarker';

import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';

describe('WebStorage config tests', () => {

    test('WebStorage should throw error if not given a key', () => {
        // $FlowFixMe - intentional misuse of types
        expect(() => WebStorage()).toThrow(`WebStorage expects param "config.key" to be a string, but got undefined`);
        // $FlowFixMe - intentional misuse of types
        expect(() => WebStorage({})).toThrow(`WebStorage expects param "config.key" to be a string, but got undefined`);
    });

    test('WebStorage must throw error if passed an invalid method', () => {
        // $FlowFixMe - intentional misuse of types
        expect(() => WebStorage({
            key: "storageKey",
            method: "foo"
        })).toThrow(`WebStorage expects param "config.method" to be either "localStorage" or "sessionStorage"`);
    });

});

describe('WebStorage storage mechanism tests', () => {
    test('WebStorage must pass available: false if localStorage doesnt exist', () => {
        let temp = window.localStorage;
        delete window.localStorage;

        const MyWebStorage = WebStorage({key: "localStorageKey"});

        expect(MyWebStorage.available).toBe(false);
        expect(MyWebStorage.availabilityError).toBe(`WebStorage requires localStorage to be available`);
        expect(MyWebStorage.valid).toBe(false);
        expect(MyWebStorage.storageType).toBe("WebStorage");
        expect(MyWebStorage.value).toBe(InvalidValueMarker);

        window.localStorage = temp;
    });

    // test('WebStorage must make no change or error if localStorage doesnt exist', () => {
    //     let temp = window.localStorage;
    //     delete window.localStorage;

    //     expect(() => WebStorage({key: "localStorageKey"}).onChange({abc: 123})).not.toThrow();

    //     window.localStorage = temp;
    // });
});

describe('WebStorage storage mechanism tests', () => {

    test('WebStorage should read localStorage', () => {
        localStorage.setItem("localStorageKey", `{"abc":123}`);

        const MyWebStorage = WebStorage({key: "localStorageKey"});

        expect(MyWebStorage.available).toBe(true);
        expect(MyWebStorage.availabilityError).toBe(undefined);
        expect(MyWebStorage.valid).toBe(true);
        expect(MyWebStorage.value).toEqual({abc: 123});
    });

    test('WebStorage should write localStorage', () => {
        localStorage.setItem("localStorageKey", `{"abc":123}`);

        const MyWebStorage = WebStorage({key: "localStorageKey"});
        MyWebStorage.onChange({abc: 100});
        expect(localStorage.getItem("localStorageKey")).toEqual(`{"abc":100}`);
    });

    test('WebStorage should read sessionStorage', () => {
        sessionStorage.setItem("sessionStorageKey", `{"def":123}`);

        const MyWebStorage = WebStorage({
            key: "sessionStorageKey",
            method: "sessionStorage"
        });

        expect(MyWebStorage.available).toBe(true);
        expect(MyWebStorage.availabilityError).toBe(undefined);
        expect(MyWebStorage.valid).toBe(true);
        expect(MyWebStorage.value).toEqual({def: 123});
    });

    test('WebStorage should write sessionStorage', () => {
        sessionStorage.setItem("sessionStorageKey", `{"def":123}`);

        const MyWebStorage = WebStorage({
            key: "sessionStorageKey",
            method: "sessionStorage"
        });
        MyWebStorage.onChange({def: 100});
        expect(sessionStorage.getItem("sessionStorageKey")).toEqual(`{"def":100}`);
    });

    test('WebStorage should cope with unset data in localStorage', () => {
        localStorage.clear();

        const MyWebStorage = WebStorage({key: "localStorageKey"});

        expect(MyWebStorage.available).toBe(true);
        expect(MyWebStorage.availabilityError).toBe(undefined);
        expect(MyWebStorage.valid).toBe(true);
        expect(MyWebStorage.value).toEqual({});
    });

    test('WebStorage should notify of invalid data', () => {
        localStorage.setItem("localStorageKey", `{1231*(&@@&#Y(223423423}`);

        const MyWebStorage = WebStorage({key: "localStorageKey"});

        expect(MyWebStorage.available).toBe(true);
        expect(MyWebStorage.availabilityError).toBe(undefined);
        expect(MyWebStorage.valid).toBe(false);
        expect(MyWebStorage.value).toBe(InvalidValueMarker);
    });

});

describe('WebStorage data flow config tests', () => {

    test('WebStorage should pass data through reconstruct and deconstruct', () => {
        localStorage.setItem("localStorageKey", `{"date":"1970-01-01T00:00:00.000Z"}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            reconstruct: ({date}) => ({date: new Date(date)}),
            deconstruct: ({date}) => ({date: date.toISOString()})
        });

        expect(MyWebStorage.value.date.toISOString()).toBe("1970-01-01T00:00:00.000Z");

        MyWebStorage.onChange({date: new Date('2000-01-01')});

        expect(localStorage.getItem("localStorageKey")).toBe(`{"date":"2000-01-01T00:00:00.000Z"}`);
    });

    test('WebStorage should pass data through parse and stringify', () => {
        localStorage.setItem("localStorageKey", `foo{"abc":123}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            parse: (str) => JSON.parse(str.slice(3)),
            stringify: (obj) => `foo${JSON.stringify(obj)}`
        });

        expect(MyWebStorage.value).toEqual({abc:123});

        MyWebStorage.onChange({abc: 456});

        expect(localStorage.getItem("localStorageKey")).toBe(`foo{"abc":456}`);
    });

    test('WebStorage should set initialValue', () => {
        localStorage.setItem("localStorageKey", `{"abc": 100}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            initialValue: {
                def: 200
            }
        });

        expect(MyWebStorage.value).toEqual({def: 200});
        expect(localStorage.getItem("localStorageKey")).toBe(`{"def":200}`);
    });

    test('WebStorage should set initialValue as function', () => {
        localStorage.setItem("localStorageKey", `{"abc": 100}`);

        let initialValue = jest.fn(() => ({def: 200}));

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            initialValue
        });

        expect(MyWebStorage.value).toEqual({def: 200});
        expect(localStorage.getItem("localStorageKey")).toBe(`{"def":200}`);
        expect(initialValue.mock.calls[0][0]).toEqual({abc: 100});
    });

    test('WebStorage should not set initialValue if function returns falsey', () => {
        localStorage.setItem("localStorageKey", `{"abc": 100}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            initialValue: () => false
        });

        expect(MyWebStorage.value).toEqual({abc: 100});
        expect(localStorage.getItem("localStorageKey")).toBe(`{"abc": 100}`);
    });

    test('WebStorage should throw error if initialValue is not keyed', () => {
        expect(() => WebStorage({key: "localStorageKey", initialValue: 600})).toThrowError(`WebStorage initialValue must be passed an object`);
    });
});

describe('WebStorage memoization tests', () => {

    test('WebStorage should memoize value', () => {
        localStorage.setItem("localStorageKey", `{"abc":100}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey"
        });

        const value1 = MyWebStorage.value;
        MyWebStorage.onChange({abc: 100});
        const value2 = MyWebStorage.value;

        expect(value1).toEqual(value2);
        expect(value1).toBe(value2);
    });

    test('WebStorage should not memoize value if memoize = false', () => {
        localStorage.setItem("localStorageKey", `{"abc":100}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey",
            memoize: false
        });

        const value1 = MyWebStorage.value;
        MyWebStorage.onChange({abc: 100});
        const value2 = MyWebStorage.value;

        expect(value1).toEqual(value2);
        expect(value1).not.toBe(value2);
    });

    test('WebStorage should memoize deep value', () => {
        localStorage.setItem("localStorageKey", `{"abc":[100,200],"def":300}`);

        const MyWebStorage = WebStorage({
            key: "localStorageKey"
        });

        const value1 = MyWebStorage.value;
        MyWebStorage.onChange({abc: [400,200]});
        const value2 = MyWebStorage.value;

        expect(value1).not.toBe(value2);
        expect(value1.def).toBe(value2.def);
        expect(value1.abc).not.toBe(value2.abc);
        expect(value1.abc[0]).not.toBe(value2.abc[0]);
        expect(value1.abc[1]).toBe(value2.abc[1]);
    });

});

describe('Hook tests', () => {

    test('WebStorage hook should work', () => {
        localStorage.setItem("localStorageKey", `{"abc":100}`);

        const useStorage = ReactCoolStorageHook(WebStorage({key: "localStorageKey"}));
        const {result} = renderHook(() => useStorage({}));
        const memoryStorage = result.current;

        expect(memoryStorage.available).toBe(true);
        expect(memoryStorage.availabilityError).toBe(undefined);
        expect(memoryStorage.storageType).toBe("WebStorage");
        expect(memoryStorage.valid).toBe(true);
        expect(memoryStorage.value).toEqual({abc: 100});
    });

    test('WebStorage hook should change', () => {
        localStorage.setItem("localStorageKey", `{"abc":100}`);

        const useStorage = ReactCoolStorageHook(WebStorage({key: "localStorageKey"}));
        const {result} = renderHook(() => useStorage({}));

        act(() => {
            result.current.onChange({abc: 200});
        });

        expect(result.current.value).toEqual({abc: 200});

        expect(localStorage.getItem("localStorageKey")).toBe(`{"abc":200}`);
    });

    test('WebStorage hook should rerender based on change directly from WebStorage instance', () => {
        localStorage.setItem("localStorageKey", `{"abc":100}`);
        const MyWebStorage = WebStorage({key: "localStorageKey"});
        const useStorage = ReactCoolStorageHook(MyWebStorage);
        const {result} = renderHook(() => useStorage({}));

        act(() => {
            MyWebStorage.onChange({abc: 200});
        });

        expect(result.current.value).toEqual({abc: 200});
    });

});
