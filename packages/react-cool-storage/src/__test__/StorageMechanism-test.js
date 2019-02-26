// @flow

import StorageMechanism from '../StorageMechanism';

test('StorageMechanism should allow sync listeners to be added, and call their callbacks', () => {
    let storageMechanism = new StorageMechanism({
        checkAvailable: () => {},
        getValue: () => {},
        storageType: "test",
        updateFromProps: false
    });

    let instance1 = {};
    let instance2 = {};
    let instance3 = {};
    let instance1callback = jest.fn();
    let instance2callback = jest.fn();
    let instance3callback = jest.fn();

    storageMechanism.addSyncListener(instance1callback, instance1);
    storageMechanism.addSyncListener(instance2callback, instance2);
    storageMechanism.addSyncListener(instance3callback, instance3);

    storageMechanism.onSync(123, instance3);

    expect(instance1callback).toHaveBeenCalled();
    expect(instance2callback).toHaveBeenCalled();
    expect(instance3callback).not.toHaveBeenCalled();

    expect(instance1callback.mock.calls[0][0]).toBe(123);
    expect(instance2callback.mock.calls[0][0]).toBe(123);
});

test('StorageMechanism removeSyncListener should remove listeners', () => {
    let storageMechanism = new StorageMechanism({
        checkAvailable: () => {},
        getValue: () => {},
        storageType: "test",
        updateFromProps: false
    });

    let instance1 = {};
    let instance2 = {};
    let instance3 = {};
    let instance1callback = jest.fn();
    let instance2callback = jest.fn();
    let instance3callback = jest.fn();

    storageMechanism.addSyncListener(instance1callback, instance1);
    storageMechanism.addSyncListener(instance2callback, instance2);
    storageMechanism.removeSyncListener(instance2);

    storageMechanism.onSync(123, instance3);

    expect(instance1callback).toHaveBeenCalled();
    expect(instance2callback).not.toHaveBeenCalled();
});

