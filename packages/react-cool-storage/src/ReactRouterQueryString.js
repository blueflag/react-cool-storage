// @flow
import forEach from 'unmutable/forEach';
import pipeWith from 'unmutable/pipeWith';
import InvalidValueMarker from './InvalidValueMarker';
import StorageMechanism from './StorageMechanism';
import deepMemo from 'deep-memo';

type Config = {
    method?: "localStorage"|"sessionStorage",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function
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

class ReactRouterQueryString extends StorageMechanism {

    constructor(config: Config = {}) {
        let {
            method = "push",
            parse = (data: string): any => JSON.parse(data),
            stringify = (data: any): string => JSON.stringify(data),
            deconstruct,
            reconstruct
        } = config;

        const type = 'ReactRouterQueryString';

        if(method !== "push" && method !== "replace") {
            throw new Error(`${type} expects param "config.method" to be either "push" or "replace"`);
        }

        super({
            deconstruct,
            reconstruct,
            requiresProps: true,
            type,
            updateFromProps: true
        });

        this._method = method;
        this._parse = deepMemo((str) => {
            try {
                return parse(str);
            } catch(e) {
                return InvalidValueMarker;
            }
        });
        this._stringify = stringify;
    }

    //
    // private
    //

    _navigate: Function;
    _method: "push"|"replace";
    _parse: (data: string) => any;
    _stringify: (data: any) => string;
    _getSearchParams = (props: Props) => new window.URLSearchParams(props.location.search);

    //
    // private overrides
    //

    _availableFromProps(props: Props /* eslint-disable-line */): ?string {
        if(typeof window === "undefined" || typeof window.URLSearchParams === "undefined") {
            return `${this._type} requires URLSearchParams to be defined`;
        }

        if(!props.history || !props.location) {
            return `${this._type} requires React Router history and location props`;
        }
    }

    _valueFromProps(props: Props /* eslint-disable-line */): any {
        let searchParams = this._getSearchParams(props);

        let params = [];
        for (let searchParam of searchParams) {
            params.push(searchParam);
        }

        let json = params
            .map(([key, value]) => `"${key}": ${value}`)
            .join(",");

        return this._parse(`{${json}}`);
    }

    _handleChange({changedValues, removedKeys, props}: any): void {
        let searchParams = this._getSearchParams(props);

        pipeWith(
            changedValues,
            forEach((value, key) => {
                searchParams.set(key, this._stringify(value));
            })
        );

        pipeWith(
            removedKeys,
            forEach((key) => {
                searchParams.delete(key);
            })
        );

        props.history[this._method]("?" + searchParams.toString());
    }
}

export default (config: ?Config): StorageMechanism => new ReactRouterQueryString(config || {});

