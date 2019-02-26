// @flow
import React from 'react';
import ReactCoolStorageHoc from 'react-cool-storage';
import MemoryStorage from 'react-cool-storage/MemoryStorage';

const MemoryStorageExample = (props) => {
    let {memoryStorage} = props;
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

export default ReactCoolStorageHoc(
    'memoryStorage',
    MemoryStorage()
)(MemoryStorageExample);
