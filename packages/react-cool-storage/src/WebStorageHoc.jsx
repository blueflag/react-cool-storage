// // @flow
// import type {ComponentType} from 'react';
// import type {Node} from 'react';

// import React from 'react';

// import ReactCoolStorageMessage from './ReactCoolStorageMessage';

// import forEach from 'unmutable/lib/forEach';
// import identity from 'unmutable/lib/identity';
// import isKeyed from 'unmutable/lib/isKeyed';
// import pipeWith from 'unmutable/lib/pipeWith';

// type Config = {
//     afterParse?: Function,
//     beforeStringify?: Function,
//     method?: string,
//     name: string,
//     key: string,
//     parse?: (data: string) => any,
//     silent?: boolean,
//     stringify?: (data: any) => string
// };

// type Props = {
//     history: {
//         push: Function,
//         replace: Function
//     },
//     location: {
//         search: string
//     }
// };

// type ChildProps = {
//     // [config.name]?: ReactCoolStorageMessage
// };

// export default (config: Config): Function => {
//     let {
//         afterParse = identity(),
//         beforeStringify = identity(),
//         method = "localStorage",
//         name,
//         key,
//         parse = (data: string): any => JSON.parse(data),
//         silent = false,
//         stringify = (data: any): string => JSON.stringify(data)
//     } = config;

//     if(typeof name !== "string") {
//         throw new Error(`WebStorageHoc() expects param "config.name" to be a string, but got undefined`);
//     }

//     if(typeof key !== "string") {
//         throw new Error(`WebStorageHoc() expects param "config.key" to be a string, but got undefined`);
//     }

//     if(method !== "localStorage" && method !== "sessionStorage") {
//         throw new Error(`ReactRouterQueryStringHoc() expects param "config.method" to be either "localStorage" or "sessionStorage"`);
//     }

//     let storage = window[method];

//     return (Component: ComponentType<ChildProps>) => class WebStorageHoc extends React.Component<Props> {

//         checkAvailable = () => {

//             let x = '__storage_test__';

//             try {
//                 storage.setItem(x, x);
//                 storage.removeItem(x);

//             } catch(e) {
//                 // $FlowFixMe - flow doesnt know about DOMException
//                 let available = e instanceof DOMException && (
//                     // everything except Firefox
//                     e.code === 22 ||
//                     // Firefox
//                     e.code === 1014 ||
//                     // test name field too, because code might not be present
//                     // everything except Firefox
//                     e.name === 'QuotaExceededError' ||
//                     // Firefox
//                     e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//                     // acknowledge QuotaExceededError only if there's something already stored
//                     storage.length !== 0;

//                 if(!available) {
//                     throw new Error(`WebStorageHoc requires ${method} to be available.`);
//                 }
//             }
//         };

//         handleChange = (newValue: *) => {
//             if(!isKeyed(newValue)) {
//                 throw new Error(`WebStorageHoc onChange must be passed an object`);
//             }

//             pipeWith(
//                 newValue,
//                 beforeStringify,
//                 // forEach((value, key) => {
//                 //     if(typeof value === "undefined") {
//                 //         searchParams.delete(key);
//                 //     } else {
//                 //         searchParams.set(key, stringify(value));
//                 //     }
//                 // })
//             );

//             //history[method]("?" + searchParams.toString());
//         }

//         render(): Node {

//             let message = ReactCoolStorageMessage.unavailable();
//             let valid = true;

//             try {
//                 this.checkAvailable();

//                 let query = {};
//                 // let searchParams = this.getSearchParams();
//                 // for (let [key, value] of searchParams) {
//                 //     try {
//                 //         query[key] = parse(value);
//                 //     } catch(e) {
//                 //         valid = false;
//                 //     }
//                 // }

//                 message = new ReactCoolStorageMessage({
//                     available: true,
//                     onChange: this.handleChange,
//                     valid,
//                     value: valid ? afterParse(query) : {}
//                 });

//             } catch(e) {
//                 if(!silent) {
//                     throw e;
//                 }
//             }

//             let childProps = {
//                 [name]: message
//             };

//             return <Component
//                 {...this.props}
//                 {...childProps}
//             />;
//         }
//     };
// };
