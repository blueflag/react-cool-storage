// @flow
import React from 'react';
import ReactCoolStorageHook from 'react-cool-storage';
import ReactRouterQueryString from 'react-cool-storage/ReactRouterQueryString';

const useReactCoolStorage = ReactCoolStorageHook(
    ReactRouterQueryString({
        method: "replace"
    })
);

export default (props) => {
    let query = useReactCoolStorage(props);

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
