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

        storageMechanism: StorageMechanism;
        availabilityError: ?string;

        constructor(props: Props) {
            super(props);

            this.setStorageMechanism(props);

            if(process.env.NODE_ENV !== 'production' && this.availabilityError) {
                console.warn(this.availabilityError); // eslint-disable-line
            }

            this.state = {
                message: this.getMessageState(props)
            };

            this.storageMechanism.addSyncListener(
                (value) => {
                    this.setState({
                        message: this.getMessageState(this.props, {value})
                    });
                },
                this
            );
        }

        componentWillUnmount() {
            this.storageMechanism.removeSyncListener(this);
        }

        setStorageMechanism = (props: Props): * => {
            let storageMechanism: ?StorageMechanism = storageMechanisms
                .find((storageMechanism) => {
                    this.availabilityError = storageMechanism.checkAvailable(props);
                    return !this.availabilityError;
                });

            if(!storageMechanism) {
                storageMechanism = last()(storageMechanisms);
            }

            this.storageMechanism = storageMechanism;
        };

        getMessageState = (props: Props, options: ?{value: any}): MessageState => {
            let {availabilityError} = this;
            if(availabilityError) {
                return {
                    ...ReactCoolStorageMessage.unavailable,
                    availabilityError
                };
            }

            let {
                getValue,
                reconstruct,
                storageType
            } = this.storageMechanism;

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
            } = this;

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
                props: this.props,
                origin: this
            });

            if(!updateFromProps) {
                this.setState({
                    message: this.getMessageState(this.props, {value: updatedValue})
                });
            }
        }

        render(): Node {
            let {updateFromProps} = this.storageMechanism;

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
