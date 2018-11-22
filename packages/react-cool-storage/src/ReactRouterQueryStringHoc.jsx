// @flow
import ReactCoolStorageHoc from './ReactCoolStorageHoc';

import forEach from 'unmutable/lib/forEach';
import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    name: string,
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

const hoc = "ReactRouterQueryStringHoc";

export default (config: Config): Function => {
    let {
        method = "push",
        parse = (data: string): any => JSON.parse(data),
        stringify = (data: any): string => JSON.stringify(data)
    } = config;

    if(method !== "push" && method !== "replace") {
        throw new Error(`${hoc} expects param "config.method" to be either "push" or "replace"`);
    }

    let getSearchParams = (props: any) => new window.URLSearchParams(props.location.search);

    return ReactCoolStorageHoc({
        hoc,
        config,
        checkAvailable: (props: Props): ?string => {
            if(typeof window.URLSearchParams === "undefined") {
                return `${hoc} requires URLSearchParams to be defined`;
            }

            if(!props.history || !props.location) {
                return `${hoc} requires React Router history and location props`;
            }
        },
        getValue: (props: Props): any => {
            let query = {};
            let searchParams = getSearchParams(props);
            for (let [key, value] of searchParams) {
                query[key] = parse(value);
            }
            return query;
        },
        handleChange: (props: Props, {changedValues, removedKeys}: *) => {
            let searchParams = getSearchParams(props);

            pipeWith(
                changedValues,
                forEach((value, key) => {
                    searchParams.set(key, stringify(value));
                })
            );

            pipeWith(
                removedKeys,
                forEach((key) => {
                    searchParams.delete(key);
                })
            );

            props.history[method]("?" + searchParams.toString());
        }
    });
};
