// @flow
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
            let x = '__storage_test__';

            try {
                storage.setItem(x, x);
                storage.removeItem(x);

            } catch(e) {
                /* istanbul ignore next */
                // $FlowFixMe - flow doesnt know about DOMException
                let available = e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // acknowledge QuotaExceededError only if there's something already stored
                    storage.length !== 0;

                if(!available) {
                    return `WebStorageHoc requires ${method} to be available.`;
                }
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
