// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import ReactRouterStorage from 'react-cool-storage/ReactRouterStorage';

const useStorage = ReactCoolStorageHook(
    ReactRouterStorage({
        method: "replace"
    })
);

export default (props) => {
    let query = useStorage(props);

    return <div>
        <label>query string "foo"</label>
        <input
            value={query.value.foo || ""}
            onChange={(event) => query.set((prev) => ({
                ...prev,
                foo: event.currentTarget.value
            }))}
        />
        <label>query string "bar"</label>
        <input
            value={query.value.bar || ""}
            onChange={(event) => query.set((prev) => ({
                ...prev,
                bar: event.currentTarget.value
            }))}
        />
    </div>;
};
