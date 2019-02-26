// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';
import type {MessageState} from './ReactCoolStorageMessage';

import React from 'react';
import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import last from 'unmutable/lib/last';
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

    return (Component: ComponentType<ChildProps>) => class ReactCoolStorageHoc extends React.Component<Props, State> {

        constructor(props: Props) {
            super(props);
            this.state = {
                message: this.getMessageState(props)
            };
        }

        getAvailableStorageMechanism = (props: Props): * => {
            let availabilityError;

            let storageMechanism: ?StorageMechanism = storageMechanisms
                .find((storageMechanism) => {
                    availabilityError = storageMechanism.checkAvailable(props);
                    return !availabilityError;
                });

            if(!storageMechanism) {
                storageMechanism = last()(storageMechanisms);
            }

            return {
                storageMechanism,
                availabilityError
            };
        };

        getMessageState = (props: Props, options: ?{value: any}): MessageState => {
            let {
                storageMechanism,
                availabilityError
            } = this.getAvailableStorageMechanism(props);

            if(availabilityError) {
                if(process.env.NODE_ENV !== 'production') {
                    console.warn(availabilityError); // eslint-disable-line
                }
                return {
                    ...ReactCoolStorageMessage.unavailable,
                    availabilityError
                };
            }

            let {
                getValue,
                reconstruct,
                storageType
            } = storageMechanism;

            let value = {};
            let valid = true;

            try {
                value = options ? options.value : getValue(props);
            } catch(e) {
                valid = false;
            }

            return {
                available: true,
                availabilityError: undefined,
                valid,
                value: reconstruct(value),
                storageType
            };
        }

        handleChange = (newValue: *) => {
            let {
                storageMechanism,
                availabilityError
            } = this.getAvailableStorageMechanism(this.props);

            if(availabilityError) {
                return;
            }

            let {
                deconstruct,
                getValue,
                handleChange,
                storageType,
                updateFromProps
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

            if(!updateFromProps) {
                this.setState({
                    message: this.getMessageState(this.props, {value: updatedValue})
                });
            }
        }

        render(): Node {
            let {updateFromProps} = this
                .getAvailableStorageMechanism(this.props)
                .storageMechanism;

            let message = updateFromProps
                ? () => this.getMessageState(this.props)
                : () => this.state.message;

            let childProps = {
                ...this.props,
                [name]: new ReactCoolStorageMessage({
                    ...message(),
                    onChange: this.handleChange
                })
            };

            return <Component {...childProps} />;
        }
    };
};
