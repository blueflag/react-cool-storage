// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import WebStorage from 'react-cool-storage/WebStorage';

const useReactCoolStorage = ReactCoolStorageHook(
    WebStorage({
        key: 'exampleStorage'
    })
);

export default (props) => {
    let webStorage = useReactCoolStorage(props);

    return <div>
        <label>localStorage data stored under a key of "exampleStorage.foo"</label>
        <input
            value={webStorage.value.foo || ""}
            onChange={(event) => webStorage.onChange({
                foo: event.currentTarget.value
            })}
        />
        <label>localStorage data stored under a key of "exampleStorage.bar"</label>
        <input
            value={webStorage.value.bar || ""}
            onChange={(event) => webStorage.onChange({
                bar: event.currentTarget.value
            })}
        />
    </div>;
};

// also add a WebStorage instance to the window
// to demonstrate usage outside of React

// if(typeof window !== "undefined") {
//     window.MyWebStorage = WebStorage({
//         key: 'exampleStorage'
//     });
// }
