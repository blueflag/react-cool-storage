// @flow
import reduce from 'unmutable/reduce';
import remove from 'unmutable/remove';
import InvalidValueMarker from './InvalidValueMarker';
import StorageMechanism from './StorageMechanism';
import deepMemo from 'deep-memo';

type Config = {
    navigate: Function,
    method?: "push"|"replace",
    pathname?: boolean,
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function,
    memoize?: boolean
};

type Props = {
    location: {
        pathname: string,
        search: string
    }
};

class ReachRouterStorage extends StorageMechanism {

    constructor(config: Config) {
        let {
            navigate,
            method = "push",
            pathname = false,
            parse,
            stringify,
            deconstruct,
            reconstruct,
            memoize = false
        } = config;

        const type = 'ReachRouterStorage';

        if(typeof navigate !== "function") {
            throw new Error(`${type} expects param "config.navigate" to be a Reach Router navigate function`);
        }

        if(method !== "push" && method !== "replace") {
            throw new Error(`${type} expects param "config.method" to be either "push" or "replace"`);
        }

        super({
            deconstruct,
            reconstruct,
            requiresProps: true,
            requiresKeyed: true,
            type,
            updateFromProps: true
        });

        this._navigate = navigate;
        this._method = method;
        this._pathname = pathname;
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
    _pathname: boolean;
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

        if(!props.location) {
            return `${this._type} requires a Reach Router location prop`;
        }
    }

    _rawFromProps(props: Props): any {
        return props.location.search.slice(1); // remove question mark
    }

    _valueFromProps(props: Props): any {
        let raw = this._rawFromProps(props);
        let value;

        if(this._customParse) {
            value = this._customParse(raw);

        } else {
            let searchParams = new window.URLSearchParams(raw);

            let params = [];
            for (let searchParam of searchParams) {
                params.push(searchParam);
            }

            let json = params
                .map(([key, value]) => `"${key}": ${value}`)
                .join(",");

            value = this._defaultParse(`{${json}}`);
        }

        return this._pathname
            ? {
                ...value,
                pathname: props.location.pathname
            }
            : value;
    }

    _handleChange({updatedValue, props}: any): void {

        let {pathname} = props.location;

        if(this._pathname) {
            pathname = updatedValue.pathname;
            updatedValue = remove('pathname')(updatedValue);
        }

        let queryString = this._customStringify
            ? this._customStringify(updatedValue)
            : reduce(
                (searchParams, value, key) => {
                    searchParams.set(key, this._defaultStringify(value));
                    return searchParams;
                },
                new window.URLSearchParams()
            )(updatedValue);

        this._navigate(
            `${pathname}?` + queryString,
            {
                replace: this._method === "replace"
            }
        );
    }
}

export default (config: Config): StorageMechanism => new ReachRouterStorage(config || {});

