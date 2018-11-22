// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';

import ReactCoolStorageMessage from './ReactCoolStorageMessage';

import forEach from 'unmutable/lib/forEach';
import identity from 'unmutable/lib/identity';
import isKeyed from 'unmutable/lib/isKeyed';
import pipeWith from 'unmutable/lib/pipeWith';

type Config = {
    afterParse?: Function,
    beforeStringify?: Function,
    method?: string,
    name: string,
    parse?: (data: string) => any,
    silent?: boolean,
    stringify?: (data: any) => string
};

type Props = {
    history: {
        push: Function,
        replace: Function
    },
    location: {
        search: string
    }
};

type ChildProps = {
    // [config.name]?: ReactCoolStorageMessage
};

const UNAVAILABLE_MESSAGE = new ReactCoolStorageMessage({
    value: {},
    onChange: () => {},
    available: false,
    valid: false
});

export default (config: Config): Function => {
    let {
        afterParse = identity(),
        beforeStringify = identity(),
        method = "push",
        name,
        parse = (data: string): any => JSON.parse(data),
        silent = false,
        stringify = (data: any): string => JSON.stringify(data)
    } = config;

    if(typeof name !== "string") {
        throw new Error(`ReactRouterQueryStringHoc() expects param "config.name" to be a string, but got undefined`);
    }

    return (Component: ComponentType<ChildProps>) => class ReactRouterQueryStringHoc extends React.Component<Props> {

        checkAvailable = () => {
            if(typeof window.URLSearchParams === "undefined") {
                throw new Error(`ReactRouterQueryStringHoc requires URLSearchParams to be defined`);
            }

            let {
                history,
                location
            } = this.props;

            if(!history || !location) {
                throw new Error(`ReactRouterQueryStringHoc requires React Router history and location props`);
            }
        };

        getSearchParams = (): URLSearchParams => {
            let {location} = this.props;
            return new window.URLSearchParams(location.search);
        };

        handleChange = (newValue: *) => {
            let {history} = this.props;
            let searchParams = this.getSearchParams();

            if(!isKeyed(newValue)) {
                throw new Error(`ReactRouterQueryStringHoc onChange must be passed an object`);
            }

            pipeWith(
                newValue,
                beforeStringify,
                forEach((value, key) => {
                    if(typeof value === "undefined") {
                        searchParams.delete(key);
                    } else {
                        searchParams.set(key, stringify(value));
                    }
                })
            );

            history[method]("?" + searchParams.toString());
        }

        render(): Node {

            let message = UNAVAILABLE_MESSAGE;
            let valid = true;

            try {
                this.checkAvailable();

                let query = {};
                let searchParams = this.getSearchParams();
                for (let [key, value] of searchParams) {
                    try {
                        query[key] = parse(value);
                    } catch(e) {
                        valid = false;
                    }
                }

                message = new ReactCoolStorageMessage({
                    available: true,
                    onChange: this.handleChange,
                    valid,
                    value: valid ? afterParse(query) : {}
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
