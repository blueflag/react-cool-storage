// @flow
import React from 'react';

import ReactCoolStorageHoc from '../ReactCoolStorageHoc';
import MemoryStorage from '../MemoryStorage';
import ReactCoolStorageMessage from '../ReactCoolStorageMessage';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

//
// Config errors - none
//

//
// Resource errors - none
//

//
// Transparency
//

const setAndRefresh = (value: *) => {

    let wrapper = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", MemoryStorage())
    );

    wrapper
        .props()
        .storage
        .onChange(value);

    wrapper.update();

    return wrapper
        .props()
        .storage
        .value;
};

test('MemoryStorage should pass through props', () => {
    let childProps = shallowRenderHoc(
        {
            xyz: 789
        },
        ReactCoolStorageHoc("storage", MemoryStorage())
    ).props();

    expect(childProps.xyz).toBe(789);
});

//
// Child props
//

test('MemoryStorage should set value', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
});

test('MemoryStorage should merge value', () => {
    let wrapper = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", MemoryStorage())
    );

    wrapper
        .props()
        .storage
        .onChange({abc: 123});

    wrapper.update();

    wrapper
        .props()
        .storage
        .onChange({def: 456});

    let value = wrapper
        .props()
        .storage
        .value;

    expect(value).toEqual({abc: 123, def: 456});
});

//
// Data types
//

test('MemoryStorage should cope with various data types', () => {
    expect(setAndRefresh({abc: "def"})).toEqual({abc: "def"});
    expect(setAndRefresh({abc: 123})).toEqual({abc: 123});
    expect(setAndRefresh({abc: true})).toEqual({abc: true});
    expect(setAndRefresh({abc: undefined})).toEqual({});
    expect(setAndRefresh({abc: [1,2,3]})).toEqual({abc: [1,2,3]});
    expect(setAndRefresh({abc: [1,2,null]})).toEqual({abc: [1,2,null]});
});

//
// synchronisation
//

test('MemoryStorage should update one hoc when another using the same memory storage instance updates', () => {
    let memoryStorage = MemoryStorage();

    let wrapper1 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", memoryStorage)
    );

    let wrapper2 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", memoryStorage)
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

test('MemoryStorage should not synchronize when using different memoryStorage instances', () => {
    let wrapper1 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", MemoryStorage())
    );

    let wrapper2 = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", MemoryStorage())
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

test('MemoryStorage available should be accessible from MemoryStorage instance', () => {
    let memoryStorage = MemoryStorage();
    expect(memoryStorage.available).toBe(true);
});


test('MemoryStorage availabilityError should be undefined on MemoryStorage instance', () => {
    let memoryStorage = MemoryStorage();
    expect(memoryStorage.availabilityError).toBe(undefined);
});

test('MemoryStorage value should be accessible from MemoryStorage instance', () => {
    let memoryStorage = MemoryStorage({
        initialValue: {abc: 123}
    });
    expect(memoryStorage.value).toEqual({abc: 123});
});

test('MemoryStorage value should be changeable from MemoryStorage instance', () => {
    let wrapper = shallowRenderHoc(
        {},
        ReactCoolStorageHoc("storage", MemoryStorage())
    );

    let memoryStorage = MemoryStorage();

    memoryStorage.onChange({abc: 456});

    let value = wrapper
        .props()
        .storage
        .value;

    expect(memoryStorage.value).toEqual({abc: 456});
});


