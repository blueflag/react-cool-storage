// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import WebStorage from 'react-cool-storage/WebStorage';

const useStorage = ReactCoolStorageHook(
    WebStorage({
        key: 'exampleStorage'
    })
);

export default (props) => {
    let webStorage = useStorage(props);

    return <div>
        <label>Data stored in localStorage</label>
        <input
            value={webStorage.value || ""}
            onChange={(event) => webStorage.set(event.currentTarget.value)}
        />
    </div>;
};

// also add a WebStorage instance to the window
// to demonstrate usage outside of React

if(typeof window !== "undefined") {
    window.MyWebStorage = WebStorage({
        key: 'exampleStorage'
    });
}
