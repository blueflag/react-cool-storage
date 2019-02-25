// @flow
import React from 'react';
import ReactCoolStorageHoc from 'react-cool-storage';
import WebStorage from 'react-cool-storage/WebStorage';

const WebStorageExample = (props) => {
    let {webStorage} = props;
    return <div>
        <label>localStorage data stored under a key of "exampleStorage.foo"</label>
        <input
            value={webStorage.value.foo}
            onChange={(event) => webStorage.onChange({
                foo: event.currentTarget.value
            })}
        />
        <label>localStorage data stored under a key of "exampleStorage.bar"</label>
        <input
            value={webStorage.value.bar}
            onChange={(event) => webStorage.onChange({
                bar: event.currentTarget.value
            })}
        />
    </div>;
};

export default ReactCoolStorageHoc(
    'webStorage',
    WebStorage({
        key: 'exampleStorage'
    })
)(WebStorageExample);
