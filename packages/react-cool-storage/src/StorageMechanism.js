// @flow
import filter from 'unmutable/lib/filter';
import identity from 'unmutable/identity';
import keyArray from 'unmutable/lib/keyArray';
import isKeyed from 'unmutable/lib/isKeyed';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pipeWith from 'unmutable/lib/pipeWith';

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

    _syncListeners: SyncListener[] = [];

    _addSyncListener(callback: (value: any) => void, origin: any) {
        this._synchronizer && this._synchronizer.addSyncListener(callback, origin);
    }

    _removeSyncListener(originToRemove: any) {
        this._synchronizer && this._synchronizer.removeSyncListener(originToRemove);
    }

    _onChangeWithOptions(newValue: any, {origin, props}: any = {}): any {

        let value = this._deconstruct(newValue);

        if(!isKeyed(value)) {
            throw new Error(`${this.type} onChange must be passed an object`);
        }

        let removedKeys = pipeWith(
            newValue,
            filter(_ => typeof _ === "undefined"),
            keyArray()
        );

        let changedValues = omit(removedKeys)(value);

        let updatedValue = pipeWith(
            props ? this._valueFromProps(props) : this.value,
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

    //
    // private overridables
    //

    _availableFromProps(props: any /* eslint-disable-line */): ?string {
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
            ? `${this._type} requires props and cannot be accessed outside of React`
            : this._availableFromProps();
    }

    get type(): any {
        return this._type;
    }

    get value(): any {
        return this._requiresProps
            ? {}
            : this._valueFromProps();
    }

    onChange(newValue: any): void {
        if(this._requiresProps) {
            throw new Error(`${this._type} requires props and cannot be changed outside of React`);
        }
        this._onChangeWithOptions(newValue);
    }
}
