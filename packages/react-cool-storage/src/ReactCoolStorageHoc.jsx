// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';
import type {MessageState} from './ReactCoolStorageMessage';

import React from 'react';
import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import isKeyed from 'unmutable/lib/isKeyed';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pipeWith from 'unmutable/lib/pipeWith';

type Props = {};

type State = {
    message: MessageState
};

type ChildProps = {
    // [name]: ReactCoolStorageMessage
};

export default (name: string, ...storageMechanisms: StorageMechanism[]): Function => {

    if(typeof name !== "string") {
        throw new Error(`ReactCoolStorageHoc expects first param to be a string, but got ${typeof name}`);
    }

    let storageMechanism = storageMechanisms[0]; // TEMPORARY

    return (Component: ComponentType<ChildProps>) => class ReactCoolStorageHoc extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {
                message: this.getMessageState(props)
            };
        }

        getMessageState = (props: Props): MessageState => {
            let {
                checkAvailable,
                getValue,
                reconstruct
            } = storageMechanism;

            let value = {};
            let valid = true;

            let availabilityError: ?string = checkAvailable(props);
            if(availabilityError) {
                return {
                    ...ReactCoolStorageMessage.unavailable,
                    availabilityError
                };
            }

            try {
                value = getValue(props);
            } catch(e) {
                valid = false;
            }

            return {
                available: true,
                availabilityError: undefined,
                valid,
                value: reconstruct(value)
            };
        }

        handleChange = (newValue: *) => {
            let {
                deconstruct,
                getValue,
                handleChange,
                storageType
            } = storageMechanism;

            let value = deconstruct(newValue);

            if(!isKeyed(value)) {
                throw new Error(`${storageType} onChange must be passed an object`);
            }

            let removedKeys = pipeWith(
                newValue,
                filter(_ => typeof _ === "undefined"),
                keyArray()
            );

            let changedValues = omit(removedKeys)(value);

            let updatedValue = pipeWith(
                getValue(this.props),
                merge(changedValues),
                omit(removedKeys)
            );

            handleChange({
                updatedValue,
                changedValues,
                removedKeys,
                props: this.props
            });

            this.setState({
                message: this.getMessageState(this.props)
            });
        }

        render(): Node {
            let childProps = {
                ...this.props,
                [name]: new ReactCoolStorageMessage({
                    ...this.state.message,
                    onChange: this.handleChange
                })
            };

            return <Component {...childProps} />;
        }
    };
};
