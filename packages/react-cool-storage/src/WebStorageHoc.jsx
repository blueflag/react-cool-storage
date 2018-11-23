// @flow
import storageAvailable from 'storage-available';

import ReactCoolStorageHoc from './ReactCoolStorageHoc';

import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    name: string,
    key: string,
    method?: string,
    silent?: boolean,
    reconstruct?: Function,
    deconstruct?: Function,
    parse?: (data: string) => any,
    stringify?: (data: any) => string
};

type Props = {
    history: {
        push: Function,
        replace: Function
    },
    location: {
        search: string
    }
};

const hoc = "WebStorageHoc";

export default (config: Config): Function => {
    let {
        key,
        method = "localStorage",
        parse = (data: string): any => JSON.parse(data),
        stringify = (data: any): string => JSON.stringify(data)
    } = config;

    if(typeof key !== "string") {
        throw new Error(`${hoc} expects param "config.key" to be a string, but got ${typeof key}`);
    }

    if(method !== "localStorage" && method !== "sessionStorage") {
        throw new Error(`${hoc} expects param "config.method" to be either "localStorage" or "sessionStorage"`);
    }

    let storage = window[method];
    let getValue = () => parse(storage.getItem(key)) || {};

    return ReactCoolStorageHoc({
        hoc,
        config,
        checkAvailable: (/*props: Props*/): ?string => {
            if(!storageAvailable(method)) {
                return `WebStorageHoc requires ${method} to be available.`;
            }
        },
        getValue,
        handleChange: (props: Props, {update}: *) => {
            pipeWith(
                getValue(),
                update,
                stringify,
                (str: string) => storage.setItem(key, str)
            );
        }
    });
};
