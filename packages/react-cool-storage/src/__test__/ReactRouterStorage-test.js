// @flow
import ReactCoolStorageHook from '../ReactCoolStorageHook';
import ReactRouterStorage from '../ReactRouterStorage';
import InvalidValueMarker from '../InvalidValueMarker';

import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
//import {renderHoc} from './react-hoc-testing-library';

let history = {
    push: () => {},
    replace: () => {}
};

describe('ReactRouterStorage config tests', () => {

    test('ReactRouterStorage must throw error if passed an invalid method', () => {
        // $FlowFixMe - intentional misuse of types
        expect(() => ReactRouterStorage({
            method: "foo"
        })).toThrow(`ReactRouterStorage expects param "config.method" to be either "push" or "replace"`);
    });

});

describe('ReactRouterStorage storage mechanism tests', () => {

    test('ReactRouterStorage cannot be accessed outside of React', () => {
        const MyReactRouterStorage = ReactRouterStorage();

        expect(() => MyReactRouterStorage.value).toThrow(`ReactRouterStorage requires props and cannot be used outside of React`);
        expect(() => MyReactRouterStorage.onChange({})).toThrow(`ReactRouterStorage requires props and cannot be used outside of React`);

    });

    test('ReactRouterStorage must pass available: false if not passed a location prop', () => {

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({}));

        expect(result.current.available).toBe(false);
        expect(result.current.availabilityError).toBe(`ReactRouterStorage requires React Router history and location props`);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toEqual({});
    });

    test('ReactRouterStorage must pass available: false if not passed a history prop', () => {

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({}));

        expect(result.current.available).toBe(false);
        expect(result.current.availabilityError).toBe(`ReactRouterStorage requires React Router history and location props`);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toEqual({});
    });

    test('ReactRouterStorage must pass available: false if URLSearchParams is not available', () => {

        let temp = window.URLSearchParams;
        window.URLSearchParams = undefined;

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({}));

        window.URLSearchParams = temp;

        expect(result.current.available).toBe(false);
        expect(result.current.availabilityError).toBe(`ReactRouterStorage requires URLSearchParams to be defined`);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toEqual({});
    });

});

describe('ReactRouterStorage storage mechanism tests', () => {

    test('ReactRouterStorage should read query string', () => {

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?abc=123&def=456"
            },
            history
        }));

        expect(result.current.available).toBe(true);
        expect(result.current.availabilityError).toBe(undefined);
        expect(result.current.valid).toBe(true);
        expect(result.current.value).toEqual({abc: 123, def: 456});
    });

    test('ReactRouterStorage should write query string', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100"
            },
            history
        }));

        act(() => {
            result.current.onChange({abc: 200});
        });

        expect(history.push).toHaveBeenCalled();
        expect(history.replace).not.toHaveBeenCalled();
        expect(history.push.mock.calls[0][0]).toBe("?abc=200");
    });

    test('ReactRouterStorage onChange should throw error if given non object', () => {
        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?abc=123&def=456"
            },
            history
        }));

        expect(() => result.current.onChange(123)).toThrowError(`ReactRouterStorage onChange must be passed an object`);
    });

    test('ReactRouterStorage should write query string with replace: true', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage({
            method: "replace"
        }));

        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100"
            },
            history
        }));

        act(() => {
            result.current.onChange({abc: 200});
        });

        expect(history.push).not.toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalled();
        expect(history.replace.mock.calls[0][0]).toBe("?abc=200");
    });

    test('ReactRouterStorage value should delete keys set to undefined', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: ""
            },
            history
        }));

        act(() => {
            result.current.onChange({abc: undefined, def: 200});
        });

        expect(history.push.mock.calls[0][0]).toBe("?def=200");
    });

    test('ReactRouterStorage should notify of invalid data', () => {

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?oBYN@87923828unm,.././df"
            },
            history
        }));

        expect(result.current.available).toBe(true);
        expect(result.current.availabilityError).toBe(undefined);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toBe(InvalidValueMarker);
    });

    test('ReactRouterStorage should write pathname', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage({pathname: true}));
        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100"
            },
            history
        }));

        expect(result.current.value).toEqual({pathname: "/abc", abc: 100});

        act(() => {
            result.current.onChange({abc: 200, pathname: "/flee"});
        });

        expect(history.push).toHaveBeenCalled();
        expect(history.replace).not.toHaveBeenCalled();
        expect(history.push.mock.calls[0][0]).toBe("/flee?abc=200");
    });

});

describe('ReactRouterStorage data flow config tests', () => {

    test('ReactRouterStorage should pass data through reconstruct and deconstruct', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage({
            reconstruct: ({date}) => ({date: new Date(date)}),
            deconstruct: ({date}) => ({date: date.toISOString()})
        }));

        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: `?date="1970-01-01T00:00:00.000Z"`
            },
            history
        }));

        expect(result.current.value.date.toISOString()).toBe("1970-01-01T00:00:00.000Z");

        act(() => {
            result.current.onChange({date: new Date('2000-01-01')});
        });

        expect(history.push.mock.calls[0][0]).toBe(`?date=%222000-01-01T00%3A00%3A00.000Z%22`);
    });

    test('ReactRouterStorage should pass data through parse and stringify', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        let parse = jest.fn((str) => JSON.parse(str.slice(3)));
        let stringify = jest.fn((obj) => `foo${JSON.stringify(obj)}`);

        const useStorage = ReactCoolStorageHook(ReactRouterStorage({
            parse,
            stringify
        }));

        const {result} = renderHook(() => useStorage({
            location: {
                pathname: "/abc",
                search: `?foo{"abc":123}`
            },
            history
        }));

        expect(parse.mock.calls[0][0]).toEqual(`foo{"abc":123}`);
        expect(result.current.value).toEqual({abc: 123});

        act(() => {
            result.current.onChange({abc: 456});
        });

        expect(history.push.mock.calls[0][0]).toBe(`?foo{"abc":456}`);
    });

});

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('ReactRouterStorage memoization tests', () => {

    test('ReactRouterStorage should memoize value', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=100`
            },
            history
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location, history}) => useStorage({
            location,
            history
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange({abc: 100});
            let search = history.push.mock.calls[0][0];

            rerender({
                location: {
                    pathname: "/abc",
                    search
                }
            });
        });

        const value2 = result.current.value;

        expect(value1).toEqual(value2);
        expect(value1).toBe(value2);
    });

    test('ReactRouterStorage should not memoize value normally', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage());

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=100`
            },
            history
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location, history}) => useStorage({
            location,
            history
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange({abc: 100});
            let search = history.push.mock.calls[0][0];

            rerender({
                location: {
                    pathname: "/abc",
                    search
                }
            });
        });

        const value2 = result.current.value;

        expect(value1).toEqual(value2);
    });

    test('ReactRouterStorage should memoize deep value when memoize = true', () => {

        let history = {
            push: jest.fn(),
            replace: jest.fn()
        };

        const useStorage = ReactCoolStorageHook(ReactRouterStorage({
            memoize: true
        }));

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=%5B100%2C200%5D&def=300`
            },
            history
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location, history}) => useStorage({
            location,
            history
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange((prev) => ({
                ...prev,
                abc: [400, 200]
            }));

            let search = history.push.mock.calls[0][0];

            rerender({
                location: {
                    pathname: "/abc",
                    search
                }
            });
        });

        const value2 = result.current.value;

        expect(value1).not.toBe(value2);
        expect(value1.def).toBe(value2.def);
        expect(value1.abc).not.toBe(value2.abc);
        expect(value1.abc[0]).not.toBe(value2.abc[0]);
        expect(value1.abc[1]).toBe(value2.abc[1]);
    });

});
