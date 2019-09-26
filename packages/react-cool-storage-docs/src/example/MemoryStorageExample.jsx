// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import MemoryStorage from 'react-cool-storage/MemoryStorage';

const MyMemoryStorage = MemoryStorage();
const useStorage = ReactCoolStorageHook(MyMemoryStorage);

export default (props) => {
    let memoryStorage = useStorage(props);

    return <div>
        <label>Data stored in memory</label>
        <input
            value={memoryStorage.value || ""}
            onChange={(event) => memoryStorage.set(event.currentTarget.value)}
        />
    </div>;
};

// also add this MemoryStorage instance to the window
// to demonstrate usage outside of React

if(typeof window !== "undefined") {
    window.MyMemoryStorage = MyMemoryStorage;
}
