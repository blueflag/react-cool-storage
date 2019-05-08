// @flow

type SyncListener = {
    callback: (value: any) => void,
    origin: any
};

export default class Synchronizer {
    syncListeners: SyncListener[] = [];

    addSyncListener(callback: (value: any) => void, origin: any) {
        const exists = this.syncListeners.some((syncListener) => syncListener.origin === origin);

        if(exists) {
            return;
        }

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
