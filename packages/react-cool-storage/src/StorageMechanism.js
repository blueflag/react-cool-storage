// @flow

import identity from 'unmutable/identity';

type Config = {
    storageType: string,
    checkAvailable: (props: any) => ?string,
    getValue: (props: any) => any,
    handleChange?: (handleChangeProps: any) => void,
    deconstruct?: Function,
    reconstruct?: Function,
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

    constructor(config: Config) {
        this.storageType = config.storageType;
        this.checkAvailable = config.checkAvailable;
        this.getValue = config.getValue;
        this.handleChange = config.handleChange || identity();
        this.deconstruct = config.deconstruct || identity();
        this.reconstruct = config.reconstruct || identity();
        this.updateFromProps = config.updateFromProps;
    }

    addSyncListener(callback: (value: any) => void, origin: any) {
        this.syncListeners.push({
            callback,
            origin
        });
    }

    removeSyncListener(originToRemove: any) {
        this.syncListeners = this.syncListeners.filter(({origin}) => origin !== originToRemove);
    }

    onSync(value: any, changeOrigin: any) {
        this.syncListeners.forEach(({callback, origin}) => {
            if(!changeOrigin || !origin || changeOrigin !== origin) {
                callback(value);
            }
        });
    }
}
