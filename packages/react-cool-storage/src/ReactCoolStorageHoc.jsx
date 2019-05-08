// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';

import React from 'react';
import ReactCoolStorageHook from './ReactCoolStorageHook';

type Props = {};

type ChildProps = {
    // [name]: ReactCoolStorageMessage
};

export default (name: string, ...storageMechanisms: StorageMechanism[]): Function => {

    if(typeof name !== "string") {
        throw new Error(`ReactCoolStorageHoc expects first param to be a string, but got ${typeof name}`);
    }

    const useReactCoolStorage = ReactCoolStorageHook(...storageMechanisms);

    return (Component: ComponentType<ChildProps>) => (props: Props): Node => {

        let coolStorageMessage = useReactCoolStorage(props);

        let childProps = {
            ...props,
            [name]: coolStorageMessage
        };

        return <Component {...childProps} />;
    };
};
