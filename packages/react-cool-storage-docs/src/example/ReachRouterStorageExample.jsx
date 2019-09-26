// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import ReachRouterStorage from 'react-cool-storage/ReachRouterStorage';
import {navigate} from 'gatsby';

const useStorage = ReactCoolStorageHook(
    ReachRouterStorage({
        navigate,
        method: "replace"
    })
);

export default (props) => {
    let query = useStorage(props);

    return <div>
        <label>query string "foo"</label>
        <input
            value={query.value.foo || ""}
            onChange={(event) => query.onChange((prev) => ({
                ...prev,
                foo: event.currentTarget.value
            }))}
        />
        <label>query string "bar"</label>
        <input
            value={query.value.bar || ""}
            onChange={(event) => query.onChange((prev) => ({
                ...prev,
                bar: event.currentTarget.value
            }))}
        />
    </div>;
};
