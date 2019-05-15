// @flow
import ReactCoolStorageHook from '../ReactCoolStorageHook';
import ReachRouterQueryString from '../ReachRouterQueryString';
import InvalidValueMarker from '../InvalidValueMarker';

import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
//import {renderHoc} from './react-hoc-testing-library';

let navigate = () => {};

describe('ReachRouterQueryString config tests', () => {

    test('ReachRouterQueryString should throw error if not given a key', () => {
        // $FlowFixMe - intentional misuse of types
        expect(() => ReachRouterQueryString()).toThrow(`ReachRouterQueryString expects param "config.navigate" to be a Reach Router navigate function`);
        // $FlowFixMe - intentional misuse of types
        expect(() => ReachRouterQueryString({})).toThrow(`ReachRouterQueryString expects param "config.navigate" to be a Reach Router navigate function`);
    });

    test('ReachRouterQueryString must throw error if passed an invalid method', () => {
        // $FlowFixMe - intentional misuse of types
        expect(() => ReachRouterQueryString({
            navigate: () => {},
            method: "foo"
        })).toThrow(`ReachRouterQueryString expects param "config.method" to be either "push" or "replace"`);
    });

});

describe('ReachRouterQueryString storage mechanism tests', () => {

    test('ReachRouterQueryString cannot be accessed outside of React', () => {
        const MyReachRouterQueryString = ReachRouterQueryString({navigate});

        expect(() => MyReachRouterQueryString.value).toThrow(`ReachRouterQueryString requires props and cannot be used outside of React`);
        expect(() => MyReachRouterQueryString.onChange({})).toThrow(`ReachRouterQueryString requires props and cannot be used outside of React`);

    });

    test('ReachRouterQueryString must pass available: false if not passed a location prop', () => {

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({}));

        expect(result.current.available).toBe(false);
        expect(result.current.availabilityError).toBe(`ReachRouterQueryString requires a Reach Router location prop`);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toEqual({});
    });

    test('ReachRouterQueryString must pass available: false if URLSearchParams is not available', () => {

        let temp = window.URLSearchParams;
        window.URLSearchParams = undefined;

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({}));

        window.URLSearchParams = temp;

        expect(result.current.available).toBe(false);
        expect(result.current.availabilityError).toBe(`ReachRouterQueryString requires URLSearchParams to be defined`);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toEqual({});
    });

});

describe('ReachRouterQueryString storage mechanism tests', () => {

    test('ReachRouterQueryString should read query string', () => {

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: "?abc=123&def=456"
            }
        }));

        expect(result.current.available).toBe(true);
        expect(result.current.availabilityError).toBe(undefined);
        expect(result.current.valid).toBe(true);
        expect(result.current.value).toEqual({abc: 123, def: 456});
    });

    test('ReachRouterQueryString should write query string', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100"
            }
        }));

        act(() => {
            result.current.onChange({abc: 200});
        });

        expect(navigate).toHaveBeenCalled();
        expect(navigate.mock.calls[0][0]).toBe("/abc?abc=200");
        expect(navigate.mock.calls[0][1]).toEqual({replace: false});
    });

    test('ReachRouterQueryString should write query string with replace: true', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate,
            method: "replace"
        }));

        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100"
            }
        }));

        act(() => {
            result.current.onChange({abc: 200});
        });

        expect(navigate).toHaveBeenCalled();
        expect(navigate.mock.calls[0][0]).toBe("/abc?abc=200");
        expect(navigate.mock.calls[0][1]).toEqual({replace: true});
    });

    test('ReachRouterQueryString value should delete keys set to undefined', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: "?abc=100&def=200"
            }
        }));

        act(() => {
            result.current.onChange({abc: undefined});
        });

        expect(navigate.mock.calls[0][0]).toBe("/abc?def=200");
    });

    test('ReachRouterQueryString should notify of invalid data', () => {

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({navigate}));
        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: "?oBYN@87923828unm,.././df"
            }
        }));

        expect(result.current.available).toBe(true);
        expect(result.current.availabilityError).toBe(undefined);
        expect(result.current.valid).toBe(false);
        expect(result.current.value).toBe(InvalidValueMarker);
    });

});

describe('ReachRouterQueryString data flow config tests', () => {

    test('ReachRouterQueryString should pass data through reconstruct and deconstruct', () => {

        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate,
            reconstruct: ({date}) => ({date: new Date(date)}),
            deconstruct: ({date}) => ({date: date.toISOString()})
        }));

        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: `?date="1970-01-01T00:00:00.000Z"`
            }
        }));

        expect(result.current.value.date.toISOString()).toBe("1970-01-01T00:00:00.000Z");

        act(() => {
            result.current.onChange({date: new Date('2000-01-01')});
        });

        expect(navigate.mock.calls[0][0]).toBe(`/abc?date=%222000-01-01T00%3A00%3A00.000Z%22`);
    });

    test('ReachRouterQueryString should pass data through parse and stringify', () => {

        let navigate = jest.fn();
        let parse = jest.fn((str) => JSON.parse(str.slice(4)));
        let stringify = jest.fn((obj) => `?foo${JSON.stringify(obj)}`);

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate,
            parse,
            stringify
        }));

        const {result} = renderHook(() => useReactCoolStorage({
            location: {
                pathname: "/abc",
                search: `?foo{"abc":123}`
            }
        }));

        expect(parse.mock.calls[0][0]).toEqual(`?foo{"abc":123}`);
        expect(result.current.value).toEqual({abc: 123});

        act(() => {
            result.current.onChange({abc: 456});
        });

        expect(navigate.mock.calls[0][0]).toBe(`/abc?foo{"abc":456}`);
    });

});

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('ReachRouterQueryString memoization tests', () => {

    test('ReachRouterQueryString should memoize value', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate
        }));

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=100`
            }
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location}) => useReactCoolStorage({
            location
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange({abc: 100});
            let url = navigate.mock.calls[0][0];

            rerender({
                location: {
                    pathname: url.slice(0,4),
                    search: url.slice(4)
                }
            });
        });

        const value2 = result.current.value;

        expect(value1).toEqual(value2);
        expect(value1).toBe(value2);
    });

    test('ReachRouterQueryString should not memoize value when memoize = false', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate,
            memoize: false
        }));

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=100`
            }
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location}) => useReactCoolStorage({
            location
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange({abc: 100});
            let url = navigate.mock.calls[0][0];

            rerender({
                location: {
                    pathname: url.slice(0,4),
                    search: url.slice(4)
                }
            });
        });

        const value2 = result.current.value;

        expect(value1).toEqual(value2);
    });

    test('ReachRouterQueryString should memoize deep value', () => {
        let navigate = jest.fn();

        const useReactCoolStorage = ReactCoolStorageHook(ReachRouterQueryString({
            navigate
        }));

        let initialProps = {
            location: {
                pathname: "/abc",
                search: `?abc=%5B100%2C200%5D&def=300`
            }
        };

        const {result, rerender} = renderHookWithProps(initialProps, ({location}) => useReactCoolStorage({
            location
        }));

        const value1 = result.current.value;

        act(() => {
            result.current.onChange({abc: [400, 200]});
            let url = navigate.mock.calls[0][0];

            rerender({
                location: {
                    pathname: url.slice(0,4),
                    search: url.slice(4)
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
