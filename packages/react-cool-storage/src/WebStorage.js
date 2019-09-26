// @flow
import storageAvailable from 'storage-available';
import has from 'unmutable/has';
import pipeWith from 'unmutable/pipeWith';
import invalid from './invalid';
import StorageMechanism from './StorageMechanism';
import Synchronizer from './Synchronizer';
import deepMemo from 'deep-memo';

type Config = {
    key: string,
    method?: "localStorage"|"sessionStorage",
    parse?: (data: string) => any,
    stringify?: (data: any) => string,
    deconstruct?: Function,
    reconstruct?: Function,
    memoize?: boolean,
    initialValue?: any
};

const synchronizerMap: {[key: string]: Synchronizer} = {}; // create a global map of synchronizers

class WebStorage extends StorageMechanism {

    constructor(config: Config) {
        let {
            key,
            method = "localStorage",
            parse = (data: string): any => JSON.parse(data),
            stringify = (data: any): string => JSON.stringify(data),
            deconstruct,
            reconstruct,
            memoize = false,
            initialValue
        } = config || {};

        const type = 'WebStorage';

        if(typeof key !== "string") {
            throw new Error(`${type} expects param "config.key" to be a string, but got ${typeof key}`);
        }

        if(method !== "localStorage" && method !== "sessionStorage") {
            throw new Error(`${type} expects param "config.method" to be either "localStorage" or "sessionStorage"`);
        }

        if(!synchronizerMap[key]) {
            synchronizerMap[key] = new Synchronizer();
        }

        super({
            deconstruct,
            reconstruct,
            requiresProps: false,
            requiresKeyed: false,
            synchronizer: synchronizerMap[key],
            type,
            updateFromProps: false
        });

        this._key = key;
        this._method = method;
        this._parse = (str) => {
            try {
                return parse(str);
            } catch(e) {
                return invalid;
            }
        };
        this._stringify = stringify;

        if(memoize) {
            this._parse = deepMemo(this._parse);
        }

        if(has('initialValue')(config)) {
            this._setInitialValue(initialValue);
        }
    }

    //
    // private
    //

    _key: string;
    _method: "localStorage"|"sessionStorage";
    _parse: (data: string) => any;
    _stringify: (data: any) => string;

    _stringFromProps = (props: any /* eslint-disable-line */): string => {
        let storage = window !== undefined && window[this._method];
        if(!storage) {
            return "";
        }
        return storage.getItem(this._key);
    };

    //
    // private overrides
    //

    _availableFromProps(props: any /* eslint-disable-line */): ?string {
        if(!storageAvailable(this._method)) {
            return `${this._type} requires ${this._method} to be available`;
        }
    }

    _valueFromProps(props: any): any {
        return pipeWith(
            props,
            this._stringFromProps,
            this._parse
        );
    }

    _handleChange({updatedValue, origin}: any): void {
        let storage = window[this._method];

        pipeWith(
            updatedValue,
            this._stringify,
            (str: string) => storage.setItem(this._key, str)
        );
        synchronizerMap[this._key].onSync(updatedValue, origin);
    }
}

export default (config: Config): StorageMechanism => new WebStorage(config);
