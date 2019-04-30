// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type StorageMechanism from './StorageMechanism';
import type {MessageState} from './ReactCoolStorageMessage';

import React from 'react';
import InvalidValueMarker from './InvalidValueMarker';
import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import last from 'unmutable/lib/last';

type Props = {};

type State = {
    message: MessageState,
    instanceRef: any
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
                message: this.getMessageState(props),
                instanceRef: this
                // ^ adding a ref to this in state is ok in this case
                // because the values used from this are constant after initial construction
            };

            this.storageMechanism._addSyncListener(
                (value) => this.setMessage(this.props, {value}),
                this
            );
        }

        static getDerivedStateFromProps(props, {instanceRef}) {
            return {
                message: instanceRef.getMessageState(props)
            };
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

        setMessage = (props: Props, options: ?{value: any}) => {
            this.setState({
                message: this.getMessageState(this.props, options),
                instanceRef: this
            });
        };

        getMessageState = (props: Props, options: ?{value: any}): MessageState => {
            if(this.availabilityError) {
                return {
                    ...ReactCoolStorageMessage.unavailable,
                    availabilityError: this.availabilityError
                };
            }

            let {_reconstruct, type} = this.storageMechanism;

            let value = options
                ? options.value
                : this.storageMechanism._valueFromProps(props);

            let valid = value !== InvalidValueMarker;
            value = valid ? _reconstruct(value) : {};

            return {
                available: true,
                availabilityError: undefined,
                valid,
                value,
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
                this.setMessage(this.props, {value: updatedValue});
            }
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
