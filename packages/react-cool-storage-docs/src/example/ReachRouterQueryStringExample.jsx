// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import ReachRouterQueryString from 'react-cool-storage/ReachRouterQueryString';
import {navigate} from 'gatsby';

const useStorage = ReactCoolStorageHook(
    ReachRouterQueryString({
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
            onChange={(event) => query.onChange({
                foo: event.currentTarget.value
            })}
        />
        <label>query string "bar"</label>
        <input
            value={query.value.bar || ""}
            onChange={(event) => query.onChange({
                bar: event.currentTarget.value
            })}
        />
    </div>;
};
