// @flow

import identity from 'unmutable/lib/identity';

type Config = {
    storageType: string,
    checkAvailable: (props: any) => ?string,
    getValue: (props: any) => any,
    handleChange: (props: any, existingValue: any, newValue: any) => void,
    deconstruct?: Function,
    reconstruct?: Function
};

export default class StorageMechanism {
    storageType: string;
    checkAvailable: (props: any) => ?string;
    getValue: (props: any) => any;
    handleChange: (props: any, existingValue: any, newValue: any) => void;
    deconstruct: Function;
    reconstruct: Function;

    constructor(config: Config) {
        this.storageType = config.storageType;
        this.checkAvailable = config.checkAvailable;
        this.getValue = config.getValue;
        this.handleChange = config.handleChange;
        this.deconstruct = config.deconstruct || identity();
        this.reconstruct = config.reconstruct || identity();
    }
}
