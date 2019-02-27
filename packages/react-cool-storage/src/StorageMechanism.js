// @flow

import identity from 'unmutable/identity';
import Synchronizer from './Synchronizer';

type Config = {
    storageType: string,
    checkAvailable: (props: any) => ?string,
    getValue: (props: any) => any,
    handleChange?: (handleChangeProps: any) => void,
    deconstruct?: Function,
    reconstruct?: Function,
    synchronizer: ?Synchronizer,
    updateFromProps: boolean
};

type SyncListener = {
    callback: (value: any) => void,
    origin: any
};

export default class StorageMechanism {
    storageType: string;
    checkAvailable: (props: any) => ?string;
    getValue: (props: any) => any;
    handleChange: (handleChangeProps: any) => void;
    deconstruct: Function;
    reconstruct: Function;
    updateFromProps: boolean;
    syncListeners: SyncListener[] = [];
    synchronizer: ?Synchronizer;

    constructor(config: Config) {
        this.storageType = config.storageType;
        this.checkAvailable = config.checkAvailable;
        this.getValue = config.getValue;
        this.handleChange = config.handleChange || identity();
        this.deconstruct = config.deconstruct || identity();
        this.reconstruct = config.reconstruct || identity();
        this.synchronizer = config.synchronizer;
        this.updateFromProps = config.updateFromProps;
    }

    addSyncListener(callback: (value: any) => void, origin: any) {
        this.synchronizer && this.synchronizer.addSyncListener(callback, origin);
    }

    removeSyncListener(originToRemove: any) {
        this.synchronizer && this.synchronizer.removeSyncListener(originToRemove);
    }
}
