// @flow
import ReactCoolStorageHook from '../ReactCoolStorageHook';
import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import MemoryStorage from '../MemoryStorage';

import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import {renderHoc} from './react-hoc-testing-library';

describe('MemoryStorage storage mechanism tests', () => {

    test('MemoryStorage should always be available', () => {
        const MyMemoryStorage = MemoryStorage();
        expect(MyMemoryStorage.available).toBe(true);
        expect(MyMemoryStorage.availabilityError).toBe(undefined);
        expect(MyMemoryStorage.valid).toBe(true);
        expect(MyMemoryStorage.storageType).toBe("MemoryStorage");
        expect(MyMemoryStorage.value).toEqual({});
    });

    test('MemoryStorage value should be set and get', () => {
        const MyMemoryStorage = MemoryStorage();
        MyMemoryStorage.onChange({abc: 100});
        expect(MyMemoryStorage.value).toEqual({abc: 100});
    });

});

describe('Behaviour tests that should apply to all storage mechanisms', () => {

    test('MemoryStorage value should merge', () => {
        const MyMemoryStorage = MemoryStorage();
        MyMemoryStorage.onChange({abc: 100, def: 200});
        MyMemoryStorage.onChange({def: 300, ghi: 400});
        expect(MyMemoryStorage.value).toEqual({abc: 100, def: 300, ghi: 400});
    });

    test('MemoryStorage value should delete keys set to undefined', () => {
        const MyMemoryStorage = MemoryStorage();
        MyMemoryStorage.onChange({abc: 100, def: 200});
        MyMemoryStorage.onChange({abc: undefined});
        expect(MyMemoryStorage.value).toEqual({def: 200});
    });

    test('MemoryStorage onChange should throw error if given non object', () => {
        const MyMemoryStorage = MemoryStorage();
        expect(() => MyMemoryStorage.onChange(123)).toThrowError(`MemoryStorage onChange must be passed an object`);
    });

});

describe('MemoryStorage data flow config tests', () => {

    test('MemoryStorage should accept initialValue', () => {
        const MyMemoryStorage = MemoryStorage({
            initialValue: {
                def: 600
            }
        });

        expect(MyMemoryStorage.value).toEqual({def: 600});
    });

    test('MemoryStorage should set initialValue as function', () => {
        let initialValue = jest.fn(() => ({def: 200}));

        const MyMemoryStorage = MemoryStorage({initialValue});

        expect(MyMemoryStorage.value).toEqual({def: 200});
        expect(initialValue.mock.calls[0][0]).toEqual({});
    });

    test('MemoryStorage should not set initialValue if function returns falsey', () => {

        const MyMemoryStorage = MemoryStorage({initialValue: () => false});

        expect(MyMemoryStorage.value).toEqual({});
    });

    test('MemoryStorage should throw error if initialValue is not keyed', () => {
        expect(() => MemoryStorage({initialValue: 600})).toThrowError(`MemoryStorage initialValue must be passed an object`);
    });

});

describe('Hook tests', () => {

    test('MemoryStorage hook should work', () => {
        const useReactCoolStorage = ReactCoolStorageHook(MemoryStorage());
        const {result} = renderHook(() => useReactCoolStorage({}));
        const memoryStorage = result.current;

        expect(memoryStorage.available).toBe(true);
        expect(memoryStorage.availabilityError).toBe(undefined);
        expect(memoryStorage.storageType).toBe("MemoryStorage");
        expect(memoryStorage.valid).toBe(true);
        expect(memoryStorage.value).toEqual({});
    });

    test('MemoryStorage hook should change', () => {
        const useReactCoolStorage = ReactCoolStorageHook(MemoryStorage());
        const {result} = renderHook(() => useReactCoolStorage({}));

        act(() => {
            result.current.onChange({abc: 123});
        });

        expect(result.current.value).toEqual({abc: 123});
    });

    test('MemoryStorage hook should rerender based on change directly from MemoryStorage instance', () => {
        const MyMemoryStorage = MemoryStorage();
        const useReactCoolStorage = ReactCoolStorageHook(MyMemoryStorage);
        const {result} = renderHook(() => useReactCoolStorage({}));

        act(() => {
            MyMemoryStorage.onChange({abc: 123});
        });

        expect(result.current.value).toEqual({abc: 123});
    });

});

describe('Hoc tests', () => {

    test('MemoryStorage hoc should work', () => {
        const hoc = ReactCoolStorageHoc('foo', MemoryStorage());
        const {result} = renderHoc(hoc, {});
        const memoryStorage = result.current.foo;

        expect(memoryStorage.available).toBe(true);
        expect(memoryStorage.availabilityError).toBe(undefined);
        expect(memoryStorage.storageType).toBe("MemoryStorage");
        expect(memoryStorage.valid).toBe(true);
        expect(memoryStorage.value).toEqual({});
    });

    test('MemoryStorage hoc should change', () => {
        const hoc = ReactCoolStorageHoc('foo', MemoryStorage());
        const {result, act} = renderHoc(hoc, {});

        act(() => {
            result.current.foo.onChange({abc: 123});
        });

        expect(result.current.foo.value).toEqual({abc: 123});
    });

    test('MemoryStorage hoc should rerender based on change directly from MemoryStorage instance', () => {
        const MyMemoryStorage = MemoryStorage();
        const hoc = ReactCoolStorageHoc('foo', MyMemoryStorage);
        const {result, act} = renderHoc(hoc, {});

        act(() => {
            MyMemoryStorage.onChange({abc: 123});
        });

        expect(result.current.foo.value).toEqual({abc: 123});
    });

});

describe('Hoc tests that should apply to all storage mechanisms', () => {

    test('MemoryStorage hoc should transparently pass props', () => {
        const hoc = ReactCoolStorageHoc('foo', MemoryStorage());
        const {result} = renderHoc(hoc, {abc: 100, def: 200});
        const {abc, def} = result.current;

        expect(abc).toBe(100);
        expect(def).toBe(200);
    });

    test('ReactCoolStorageHoc should throw error if not passed a prop name', () => {
        expect(() => ReactCoolStorageHoc(123, MemoryStorage())).toThrowError(`ReactCoolStorageHoc expects first param to be a string, but got number`);
    });

});
