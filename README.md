# react-cool-storage 😎

<a href="https://www.npmjs.com/package/react-cool-storage"><img src="https://img.shields.io/npm/v/react-cool-storage.svg?style=flat-square"></a>
[![CircleCI](https://circleci.com/gh/blueflag/react-cool-storage/tree/master.svg?style=shield)](https://circleci.com/gh/blueflag/react-cool-storage/tree/master)

React hocs with a common API for storing data outside of React. Query string, local storage etc. 😎

## Install

```sh
yarn add react-cool-storage 😎
```

## Hocs

All hocs pass down a `ReactCoolStorageMessage` to their child components:

```js
{
    value: any,
    onChange: (newValue: any) => void,
    available: boolean,
    valid: boolean
}
```

- `value` - The current value. Defaults to an object with keys and values.
- `onChange` - A callback to change the value. Defaults to requiring an object with keys and values. Values are merged into the exisiting `value`. Setting any key to undefined will remove that key / value pair.
- `available` - Indicates whether the chosen storage mechanism is available to use. When false, `value` defaults to an empty object and `onChange` has no effect.
- `valid` - Indicates whether the value in the chosen storage is able to be parsed correctly. When false, `value` defaults to an empty object.

### ReactRouterQueryStringHoc

`ReactRouterQueryStringHoc` gives you an easy to use binding for working with React Router v4's query string.

It is **controlled**, meaning that it will update immediately whenever the data source (the query string) changes.

```js
ReactRouterQueryStringHoc({
    name: string,
    // optional
    method?: string = "push",
    silent?: boolean = false,
    afterParse?: Function,
    beforeStringify?: Function,
    parse?: (data: string) => any,
    stringify?: (data: any) => string
})
```

- `name` - The name of the prop that will be passed to the hoc's child component.
- `method` - The `history` method to use. Can be "push" or "replace". Defaults to "push".
- `silent` - When false, errors are thrown if there are any missing resources. When true, no errors are thrown and instead `ReactCoolStorageMessage` will contain `available: false` to indicate that the chosen storage mechanism can't be used.
- `afterParse` - A function that is called after `ReactRouterQueryStringHoc` has parsed its data. It is given the parsed object. Defaults to a passthrough function.
- `beforeStringify` - A function that is called before `ReactRouterQueryStringHoc` stringifies data when a change occurs. Defaults to a passthrough function.
- `parse` - A function that is called on the value of each key / value pair to turn it from a string into a data shape. Defaults to `JSON.parse()`.
- `stringify` - A function that is called on the value of each key / value pair to turn it from a data shape into a string. Defaults to `JSON.stringify()`.

```js
import ReactRouterQueryStringHoc from 'react-cool-storage/lib/ReactRouterQueryStringHoc';

export default ReactRouterQueryStringHoc({
    name: "query"
})(MyComponent);
```

#### Resources

ReactRouterQueryStringHoc requires three resources:
- `window.URLSearchParams` must exist. Polyfills are available if you need to support older browsers.
- A React Router v4 `history` object as a prop
- A React Router v4 `location` object as a prop

#### Props

ReactRouterQueryStringHoc requires these props to be passed to it:
- A React Router v4 `history` object as a prop
- A React Router v4 `location` object as a prop

#### Child Props

ReactRouterQueryStringHoc passes down a `ReactCoolStorageMessage` as a prop with a name of `name`.

## The future

- ReactRouterParamHoc
- LocalStorageHoc
- IndexedDBHoc
- CookieHoc
- IronDBHoc
- What else? 😎
