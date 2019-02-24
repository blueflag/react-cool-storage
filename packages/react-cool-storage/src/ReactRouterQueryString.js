// @flow
import pipeWith from 'unmutable/pipeWith';
import forEach from 'unmutable/forEach';
import StorageMechanism from './StorageMechanism';

type Config = {
    method?: "push"|"replace",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function
};

const storageType = 'ReactRouterQueryString';

export default (config: Config = {}): StorageMechanism => {
    let {
        method = "push",
        parse = (data: string): any => JSON.parse(data),
        stringify = (data: any): string => JSON.stringify(data),
        deconstruct,
        reconstruct
    } = config;

    if(method !== "push" && method !== "replace") {
        throw new Error(`${storageType} expects param "config.method" to be either "push" or "replace"`);
    }

    let getSearchParams = (props: any) => new window.URLSearchParams(props.location.search);

    let getValue = (props: Props): any => {
        let query = {};
        let searchParams = getSearchParams(props);
        for (let [key, value] of searchParams) {
            query[key] = parse(value);
        }
        return query;
    };

    let checkAvailable = (props: Props): ?string => {
        if(typeof window === "undefined" || typeof window.URLSearchParams === "undefined") {
            return `${storageType} requires URLSearchParams to be defined`;
        }

        if(!props.history || !props.location) {
            return `${storageType} requires React Router history and location props`;
        }
    };

    let handleChange = ({changedValues, removedKeys, props}: *) => {
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
