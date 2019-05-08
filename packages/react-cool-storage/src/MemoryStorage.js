// @flow
import StorageMechanism from './StorageMechanism';
import Synchronizer from './Synchronizer';

type Config = {
    initialValue?: any
};

class MemoryStorage extends StorageMechanism {

    constructor(config: Config) {
        let {initialValue} = config;

        let type = 'MemoryStorage';

        super({
            requiresProps: false,
            synchronizer: new Synchronizer(),
            type,
            updateFromProps: false
        });

        this._valueStore = {};

        this._setInitialValue(initialValue);
    }

    //
    // private
    //

    _valueStore: any;

    //
    // private overrides
    //

    _availableFromProps(props: any /* eslint-disable-line */): ?string {
        // always available
        return undefined;
    }

    _valueFromProps(props: any /* eslint-disable-line */): any {
        return this._valueStore;
    }

    _handleChange({updatedValue, origin}: any): void {
        this._valueStore = updatedValue;
        this._synchronizer && this._synchronizer.onSync(this._valueStore, origin);
    }
}

export default (config: ?Config): StorageMechanism => new MemoryStorage(config || {});
