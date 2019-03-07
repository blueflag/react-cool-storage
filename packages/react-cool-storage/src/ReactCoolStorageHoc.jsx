// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';
import type {MessageState} from './ReactCoolStorageMessage';

import React from 'react';
import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import last from 'unmutable/lib/last';

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

            this.storageMechanism._addSyncListener(
                (value) => {
                    this.setState({
                        message: this.getMessageState(this.props, {value})
                    });
                },
                this
            );
        }

        componentWillUnmount() {
            this.storageMechanism._removeSyncListener(this);
        }

        setStorageMechanism = (props: Props): * => {
            let storageMechanism: ?StorageMechanism = storageMechanisms
                .find((storageMechanism) => {
                    this.availabilityError = storageMechanism._availableFromProps(props);
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

            let {_reconstruct, type} = this.storageMechanism;

            let value = {};
            let valid = true;

            try {
                value = options ? options.value : this.storageMechanism._valueFromProps(props);
            } catch(e) {
                valid = false;
            }

            return {
                available: true,
                availabilityError: undefined,
                valid,
                value: _reconstruct(value),
                storageType: type
            };
        }

        handleChange = (newValue: *) => {
            if(this.availabilityError) {
                return;
            }

            let updatedValue = this.storageMechanism._onChangeWithOptions(
                newValue,
                {
                    origin: this,
                    props: this.props
                }
            );

            if(!this.storageMechanism._updateFromProps) {
                this.setState({
                    message: this.getMessageState(this.props, {value: updatedValue})
                });
            }
        }

        render(): Node {
            let {_updateFromProps} = this.storageMechanism;

            let message = _updateFromProps
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
