// @flow
import StorageMechanism from './StorageMechanism';

const storageType = 'MemoryStorage';

export default (): StorageMechanism => {

    let valueStore = {};

    let getValue = () => valueStore;

    let checkAvailable = () => {}; // always available

    let storageMechanism = new StorageMechanism({
        checkAvailable,
        getValue,
        storageType,
        updateFromProps: false
    });

    storageMechanism.handleChange = ({updatedValue, origin}: *) => {
        valueStore = updatedValue;
        storageMechanism.onSync(valueStore, origin);
    };

    return storageMechanism;
};
