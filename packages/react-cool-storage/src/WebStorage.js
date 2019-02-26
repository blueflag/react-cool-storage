// @flow
import storageAvailable from 'storage-available';
import pipeWith from 'unmutable/pipeWith';
import StorageMechanism from './StorageMechanism';
import Synchronizer from './Synchronizer';

type Config = {
    key: string,
    method?: "localStorage"|"sessionStorage",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function
};

const storageType = 'WebStorage';

const synchronizerMap: {[key: string]: Synchronizer} = {}; // create a global map of synchronizers

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

    if(!synchronizerMap[key]) {
        synchronizerMap[key] = new Synchronizer();
    }

    let storage = typeof window !== "undefined" && window[method];
    let getValue = () => parse(storage.getItem(key)) || {};

    let checkAvailable = (): ?string => {
        if(!storageAvailable(method)) {
            return `${storageType} requires ${method} to be available`;
        }
    };

    let storageMechanism = new StorageMechanism({
        checkAvailable,
        getValue,
        storageType,
        deconstruct,
        reconstruct,
        updateFromProps: false,
        synchronizer: synchronizerMap[key]
    });

    storageMechanism.handleChange = ({updatedValue, origin}: *) => {
        pipeWith(
            updatedValue,
            stringify,
            (str: string) => storage.setItem(key, str)
        );
        synchronizerMap[key].onSync(updatedValue, origin);
    };

    return storageMechanism;
};
