// @flow
import React from 'react';
import ReactCoolStorageHoc from 'react-cool-storage';
import ReactRouterQueryString from 'react-cool-storage/ReactRouterQueryString';

const ReactRouterQueryStringExample = (props) => {
    let {query} = props;
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

export default ReactCoolStorageHoc(
    'query',
    ReactRouterQueryString({
        method: "replace"
    })
)(ReactRouterQueryStringExample);
