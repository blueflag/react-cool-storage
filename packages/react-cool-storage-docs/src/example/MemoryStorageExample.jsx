// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import MemoryStorage from 'react-cool-storage/MemoryStorage';

const MyMemoryStorage = MemoryStorage();
const useReactCoolStorage = ReactCoolStorageHook(MyMemoryStorage);

export default (props) => {
    let memoryStorage = useReactCoolStorage(props);

    return <div>
        <label>Data stored under a key of "foo"</label>
        <input
            value={memoryStorage.value.foo || ""}
            onChange={(event) => memoryStorage.onChange({
                foo: event.currentTarget.value
            })}
        />
        <label>Data stored under a key of "bar"</label>
        <input
            value={memoryStorage.value.bar || ""}
            onChange={(event) => memoryStorage.onChange({
                bar: event.currentTarget.value
            })}
        />
    </div>;
};

// also add this MemoryStorage instance to the window
// to demonstrate usage outside of React

// if(typeof window !== "undefined") {
//     window.MyMemoryStorage = MyMemoryStorage;
// }
