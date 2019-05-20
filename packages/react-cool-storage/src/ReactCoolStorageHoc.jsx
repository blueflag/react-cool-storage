// @flow
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';

import React from 'react';
import ReactCoolStorageHook from './ReactCoolStorageHook';

export default (name: string, ...storageMechanisms: StorageMechanism[]): Function => {

    if(typeof name !== "string") {
        throw new Error(`ReactCoolStorageHoc expects first param to be a string, but got ${typeof name}`);
    }

    const useStorage = ReactCoolStorageHook(...storageMechanisms);

    return (Component) => (props): Node => {

        let coolStorageMessage = useStorage(props);

        let childProps = {
            ...props,
            [name]: coolStorageMessage
        };

        return <Component {...childProps} />;
    };
};
