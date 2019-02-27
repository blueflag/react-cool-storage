// @flow
import StorageMechanism from './StorageMechanism';
import Synchronizer from './Synchronizer';

const storageType = 'MemoryStorage';

export default (): StorageMechanism => {

    let valueStore = {};

    let getValue = () => valueStore;

    let checkAvailable = () => {}; // always available

    let synchronizer = new Synchronizer(); // create one synchronizer per MemoryStorage instance

    let storageMechanism = new StorageMechanism({
        checkAvailable,
        getValue,
        storageType,
        synchronizer,
        updateFromProps: false
    });

    storageMechanism.handleChange = ({updatedValue, origin}: *) => {
        valueStore = updatedValue;
        synchronizer.onSync(valueStore, origin);
    };

    return storageMechanism;
};
