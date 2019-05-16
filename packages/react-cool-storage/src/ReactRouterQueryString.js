// @flow
import forEach from 'unmutable/forEach';
import pipeWith from 'unmutable/pipeWith';
import InvalidValueMarker from './InvalidValueMarker';
import StorageMechanism from './StorageMechanism';
import deepMemo from 'deep-memo';

type Config = {
    method?: "push"|"replace",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function,
    memoize?: boolean
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
            parse,
            stringify,
            deconstruct,
            reconstruct,
            memoize = true
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
        this._defaultParse = (str) => {
            try {
                return JSON.parse(str);
            } catch(e) {
                return InvalidValueMarker;
            }
        };
        this._defaultStringify = (data: any): string => JSON.stringify(data);
        this._customParse = parse;
        this._customStringify = stringify;

        if(memoize) {
            this._defaultParse = deepMemo(this._defaultParse);
        }
    }

    //
    // private
    //

    _navigate: Function;
    _method: "push"|"replace";
    _defaultParse: (data: string) => any;
    _defaultStringify: (data: any) => string;
    _customParse: ?(data: string) => any;
    _customStringify: ?(data: any) => string;

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

    _rawFromProps(props: Props): any {
        return props.location.search;
    }

    _valueFromProps(props: Props): any {
        let raw = this._rawFromProps(props);

        if(this._customParse) {
            return this._customParse(raw);
        }

        let searchParams = new window.URLSearchParams(raw);

        let params = [];
        for (let searchParam of searchParams) {
            params.push(searchParam);
        }

        let json = params
            .map(([key, value]) => `"${key}": ${value}`)
            .join(",");

        return this._defaultParse(`{${json}}`);
    }

    _handleChange({updatedValue, props}: any): void {

        let searchParams = new window.URLSearchParams();

        if(this._customStringify) {
            props.history[this._method](this._customStringify(updatedValue));
            return;
        }

        pipeWith(
            updatedValue,
            forEach((value, key) => {
                searchParams.set(key, this._defaultStringify(value));
            })
        );

        props.history[this._method]("?" + searchParams.toString());
    }
}

export default (config: ?Config): StorageMechanism => new ReactRouterQueryString(config || {});

