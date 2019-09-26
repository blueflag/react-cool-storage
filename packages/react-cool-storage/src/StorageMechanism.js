// @flow
import filter from 'unmutable/filter';
import isKeyed from 'unmutable/isKeyed';
import pipeWith from 'unmutable/pipeWith';

import InvalidValueMarker from './InvalidValueMarker';
import Synchronizer from './Synchronizer';

type Config = {
    deconstruct?: Function,
    reconstruct?: Function,
    requiresProps: boolean,
    requiresKeyed: boolean,
    synchronizer?: Synchronizer,
    type: string,
    updateFromProps: boolean
};

type SyncListener = {
    callback: (value: any) => void,
    origin: any
};

export default class StorageMechanism {

    constructor(config: Config) {
        let passthrough = ii => ii;
        this._deconstruct = config.deconstruct || passthrough;
        this._reconstruct = config.reconstruct || passthrough;
        this._requiresProps = config.requiresProps;
        this._requiresKeyed = config.requiresKeyed;
        this._synchronizer = config.synchronizer;
        this._type = config.type;
        this._updateFromProps = config.updateFromProps;
        this._requiresPropsErrorMessage = `${config.type} requires props and cannot be used outside of React`;
    }

    //
    // private
    //

    _deconstruct: Function;
    _props: any;
    _reconstruct: Function;
    _requiresProps: boolean;
    _requiresKeyed: boolean;
    _synchronizer: ?Synchronizer;
    _type: string;
    _updateFromProps: boolean;
    _requiresPropsErrorMessage: string;

    _syncListeners: SyncListener[] = [];

    _addSyncListener(callback: (value: any) => void, origin: any) {
        this._synchronizer && this._synchronizer.addSyncListener(callback, origin);
    }

    _removeSyncListener(originToRemove: any) {
        this._synchronizer && this._synchronizer.removeSyncListener(originToRemove);
    }

    _onChangeWithOptions(newValue: any, {origin, props}: any = {}): any {

        // if _availableFromProps returns an error string, quit
        if(this._availableFromProps(props)) {
            return;
        }

        let updatedValue = typeof newValue === 'function'
            ? pipeWith(
                this._valueFromProps(props),
                this._reconstruct,
                newValue,
                this._deconstruct
            )
            : pipeWith(
                newValue,
                this._deconstruct
            );

        if(this._requiresKeyed && !isKeyed(updatedValue)) {
            throw new Error(`${this.storageType} onChange must be passed an object`);
        }

        if(this._requiresKeyed) {
            updatedValue = filter(value => value !== undefined)(updatedValue);
        }

        this._handleChange({
            updatedValue,
            props,
            origin
        });

        return updatedValue;
    }

    _setInitialValue(initialValue: any) {

        // if _availableFromProps returns an error string, quit
        if(this._availableFromProps()) {
            return;
        }

        let updatedValue = typeof initialValue === 'function'
            ? initialValue(this.value)
            : initialValue;

        // we dont have any storage mechanisms that need to be keyed and also allow initialValues
        // but if we do then we'll need this:

        // if(this._requiresKeyed && !isKeyed(updatedValue)) {
        //     throw new Error(`${this.storageType} initialValue must be passed an object`);
        // }

        this._handleChange({
            updatedValue,
            origin: this
        });
    }

    //
    // private overridables
    //

    _availableFromProps(props: any /* eslint-disable-line */): ?string {
    }

    _rawFromProps(props: any /* eslint-disable-line */): any {
    }

    _valueFromProps(props: any /* eslint-disable-line */): any {
    }

    _handleChange(handleChangeProps: any /* eslint-disable-line */): void {
    }

    //
    // public for when the storage mechanism is used outside of react
    //

    get available(): ?boolean {
        return !this.availabilityError;
    }

    get availabilityError(): ?string {
        return this._requiresProps
            ? this._requiresPropsErrorMessage
            : this._availableFromProps();
    }

    get valid(): boolean {
        return this.value !== InvalidValueMarker;
    }

    get storageType(): any {
        return this._type;
    }

    get value(): any {
        if(this._requiresProps) {
            throw new Error(this._requiresPropsErrorMessage);
        }
        return this.valueFromProps();
    }

    onChange(newValue: any): void {
        if(this._requiresProps) {
            throw new Error(this._requiresPropsErrorMessage);
        }
        this._onChangeWithOptions(newValue);
    }

    valueFromProps(props: any): any {
        return this._reconstruct(this._valueFromProps(props));
    }
}
