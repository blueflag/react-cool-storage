// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';

import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import identity from 'unmutable/lib/identity';
import isKeyed from 'unmutable/lib/isKeyed';
import omit from 'unmutable/lib/omit';
import pick from 'unmutable/lib/pick';
import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    hoc: string,
    config: {
        name: string,
        silent?: boolean,
        afterParse?: Function,
        beforeStringify?: Function
    },
    checkAvailable: (props: any) => void,
    getValue: (props: any) => any,
    handleChange: (props: any, existingValue: any, newValue: any) => void
};

export default (config: Config): Function => {
    let {
        hoc,
        config: {
            afterParse = identity(),
            beforeStringify = identity(),
            name,
            silent = false
        },
        checkAvailable,
        getValue,
        handleChange
    } = config;

    if(typeof name !== "string") {
        throw new Error(`${hoc} expects param "config.name" to be a string, but got undefined`);
    }

    return (Component: ComponentType<any>) => class ReactCoolStorageHoc extends React.Component<any> {

        handleChange = (newValue: *) => {
            let value = beforeStringify(newValue);

            if(!isKeyed(value)) {
                throw new Error(`ReactRouterQueryStringHoc onChange must be passed an object`);
            }

            let removedKeys = pipeWith(
                newValue,
                filter(_ => typeof _ === "undefined"),
                keyArray()
            );

            let changedValues = omit(removedKeys)(value);
            let removedValues = pick(removedKeys)(value);

            handleChange(this.props, changedValues, removedValues);
        }

        render(): Node {

            let message = ReactCoolStorageMessage.unavailable();
            let valid = true;
            let value = {};

            try {
                checkAvailable(this.props);

                try {
                    value = getValue(this.props);
                } catch(e) {
                    valid = false;
                }

                message = new ReactCoolStorageMessage({
                    available: true,
                    onChange: this.handleChange,
                    valid,
                    value: afterParse(value)
                });

            } catch(e) {
                if(!silent) {
                    throw e;
                }
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
