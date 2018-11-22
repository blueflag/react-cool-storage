// @flow
import ReactCoolStorageHoc from './ReactCoolStorageHoc';

import forEach from 'unmutable/lib/forEach';
import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    afterParse?: Function,
    beforeStringify?: Function,
    method?: string,
    name: string,
    parse?: (data: string) => any,
    silent?: boolean,
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

export default (config: Config): Function => {
    let {
        method = "push",
        parse = (data: string): any => JSON.parse(data),
        stringify = (data: any): string => JSON.stringify(data)
    } = config;

    if(method !== "push" && method !== "replace") {
        throw new Error(`ReactRouterQueryStringHoc() expects param "config.method" to be either "push" or "replace"`);
    }

    let getSearchParams = (props: any) => new window.URLSearchParams(props.location.search);

    return ReactCoolStorageHoc({
        hoc: "ReactRouterQueryStringHoc",
        config,
        checkAvailable: (props: Props) => {
            if(typeof window.URLSearchParams === "undefined") {
                throw new Error(`ReactRouterQueryStringHoc requires URLSearchParams to be defined`);
            }

            if(!props.history || !props.location) {
                throw new Error(`ReactRouterQueryStringHoc requires React Router history and location props`);
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
        handleChange: (props: Props, changedValues: *, removedValues: *) => {
            let searchParams = getSearchParams(props);

            pipeWith(
                changedValues,
                forEach((value, key) => {
                    searchParams.set(key, stringify(value));
                })
            );

            pipeWith(
                removedValues,
                forEach((value, key) => {
                    searchParams.delete(key);
                })
            );

            props.history[method]("?" + searchParams.toString());
        }
    });
};
