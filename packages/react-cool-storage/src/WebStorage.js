// @flow
import storageAvailable from 'storage-available';
import pipeWith from 'unmutable/pipeWith';
import StorageMechanism from './StorageMechanism';

type Config = {
    key: string,
    method?: "localStorage"|"sessionStorage",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function
};

const storageType = 'WebStorage';

export default (config: Config): StorageMechanism => {
    let {
        key,
        method = "localStorage",
        parse = (data: string): any => JSON.parse(data),
        stringify = (data: any): string => JSON.stringify(data),
        deconstruct,
        reconstruct
    } = config;

    if(typeof key !== "string") {
        throw new Error(`${storageType} expects param "config.key" to be a string, but got ${typeof key}`);
    }

    if(method !== "localStorage" && method !== "sessionStorage") {
        throw new Error(`${storageType} expects param "config.method" to be either "localStorage" or "sessionStorage"`);
    }

    let storage = typeof window !== "undefined" && window[method];
    let getValue = () => parse(storage.getItem(key)) || {};

    let checkAvailable = (): ?string => {
        if(!storageAvailable(method)) {
            return `WebStorageHoc requires ${method} to be available.`;
        }
    };

    let handleChange = ({updatedValue}: *) => {
        pipeWith(
            updatedValue,
            stringify,
            (str: string) => storage.setItem(key, str)
        );
    };

    return new StorageMechanism({
        checkAvailable,
        getValue,
        handleChange,
        storageType,
        deconstruct,
        reconstruct
    });
};
