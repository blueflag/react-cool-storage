// @flow
import filter from 'unmutable/lib/filter';
import identity from 'unmutable/identity';
import keyArray from 'unmutable/lib/keyArray';
import isKeyed from 'unmutable/lib/isKeyed';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pipeWith from 'unmutable/lib/pipeWith';

import InvalidValueMarker from './InvalidValueMarker';
import Synchronizer from './Synchronizer';

type Config = {
    deconstruct?: Function,
    reconstruct?: Function,
    requiresProps: boolean,
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
        this._deconstruct = config.deconstruct || identity();
        this._reconstruct = config.reconstruct || identity();
        this._requiresProps = config.requiresProps;
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

        newValue = this._deconstruct(newValue);

        if(!isKeyed(newValue)) {
            throw new Error(`${this._type} onChange must be passed an object`);
        }

        let value = this.valueFromProps(props);
        let valueIsInvalid = value === InvalidValueMarker;

        let removedKeys = valueIsInvalid
            ? []
            : pipeWith(
                newValue,
                filter(_ => typeof _ === "undefined"),
                keyArray()
            );

        let changedValues = valueIsInvalid
            ? newValue
            : omit(removedKeys)(newValue);

        let updatedValue = valueIsInvalid
            ? newValue
            : pipeWith(
                props ? value : this.value,
                merge(changedValues),
                omit(removedKeys)
            );

        this._handleChange({
            updatedValue,
            changedValues,
            removedKeys,
            props,
            origin
        });

        return updatedValue;
    }

    _setInitialValue(initialValue: any) {
        if(typeof initialValue === "function") {
            initialValue = initialValue(this.value);
        }

        if(initialValue) {
            if(!isKeyed(initialValue)) {
                throw new Error(`${this.storageType} initialValue must be passed an object`);
            }

            this._handleChange({
                updatedValue: initialValue,
                origin: this
            });
        }
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
    // public
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
