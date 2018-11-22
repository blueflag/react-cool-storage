// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';

import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import identity from 'unmutable/lib/identity';
import isKeyed from 'unmutable/lib/isKeyed';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pipe from 'unmutable/lib/pipe';
import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    hoc: string,
    config: {
        name: string,
        silent?: boolean,
        deconstruct?: Function,
        reconstruct?: Function
    },
    checkAvailable: (props: any) => ?string,
    getValue: (props: any) => any,
    handleChange: (props: any, existingValue: any, newValue: any) => void
};

export default (config: Config): Function => {
    let {
        hoc,
        config: {
            deconstruct = identity(),
            reconstruct = identity(),
            name,
            silent = false
        },
        checkAvailable,
        getValue,
        handleChange
    } = config;

    if(typeof name !== "string") {
        throw new Error(`${hoc} expects param "config.name" to be a string, but got ${typeof name}`);
    }

    return (Component: ComponentType<any>) => class ReactCoolStorageHoc extends React.Component<any> {

        handleChange = (newValue: *) => {
            let value = deconstruct(newValue);

            if(!isKeyed(value)) {
                throw new Error(`ReactRouterQueryStringHoc onChange must be passed an object`);
            }

            let removedKeys = pipeWith(
                newValue,
                filter(_ => typeof _ === "undefined"),
                keyArray()
            );

            let changedValues = omit(removedKeys)(value);

            let update = pipe(
                merge(changedValues),
                omit(removedKeys)
            );

            handleChange(this.props, {update, changedValues, removedKeys});
        }

        render(): Node {

            let message = ReactCoolStorageMessage.unavailable;
            let valid = true;
            let value = {};

            let availabilityError: ?string = checkAvailable(this.props);
            if(availabilityError) {
                if(!silent) {
                    throw new Error(availabilityError);
                }

            } else {
                try {
                    value = getValue(this.props);
                } catch(e) {
                    valid = false;
                }

                message = new ReactCoolStorageMessage({
                    available: true,
                    onChange: this.handleChange,
                    valid,
                    value: reconstruct(value)
                });
            }

            let childProps = {
                [name]: message
            };

            return <Component
                {...this.props}
                {...childProps}
            />;
        }
    };
};
