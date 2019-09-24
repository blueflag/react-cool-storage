// @flow
import type StorageMechanism from './StorageMechanism';
import type {MessageState} from './ReactCoolStorageMessage';

// $FlowFixMe - react does export this
import {useState} from 'react';
// $FlowFixMe - react does export this
import {useEffect} from 'react';
// $FlowFixMe - react does export this
import {useRef} from 'react';

import InvalidValueMarker from './InvalidValueMarker';

import ReactCoolStorageMessage from './ReactCoolStorageMessage';
import last from 'unmutable/last';

type Props = {};

type SelectedStorageMechanism = {
    storageMechanism: StorageMechanism,
    availabilityError: ?string
};

export default (...storageMechanisms: StorageMechanism[]) => {

    //
    // setStorageMechanism
    //

    const setStorageMechanism = (initialProps: Props): SelectedStorageMechanism => {

        let availabilityError: ?string = undefined;

        let storageMechanism: ?StorageMechanism = storageMechanisms
            .find((storageMechanism) => {
                availabilityError = storageMechanism._availableFromProps(initialProps);
                return !availabilityError;
            });

        if(!storageMechanism) {
            storageMechanism = last()(storageMechanisms);
        }

        if(process.env.NODE_ENV !== 'production' && availabilityError) {
            console.warn(availabilityError); // eslint-disable-line
        }

        return {
            storageMechanism,
            availabilityError
        };
    };

    //
    // getMessageState
    //

    const getMessageState = (
        props: Props,
        storageMechanism: StorageMechanism,
        options: ?{value: any}
    ): MessageState => {

        let {storageType} = storageMechanism;

        let value = options
            ? options.value
            : storageMechanism.valueFromProps(props);

        let valid = value !== InvalidValueMarker;

        return {
            available: true,
            availabilityError: undefined,
            valid,
            value,
            storageType
        };
    };

    //
    // function component
    //

    return (props: Props): ReactCoolStorageMessage => {

        // use a ref as a component instance identifier in synchroniser
        const ref = useRef(null);

        // set storage mechanism only once and keep in state
        // this will never change after initial render
        const [selectedStorageMechanism] = useState(() => setStorageMechanism(props));

        let {
            availabilityError,
            storageMechanism
        } = selectedStorageMechanism;

        if(availabilityError) {
            return new ReactCoolStorageMessage({
                ...ReactCoolStorageMessage.unavailable,
                availabilityError,
                onChange:  /* istanbul ignore next */ () => {}
            });
        }

        // get message and keep it in state
        // because its not always a product of props
        // and can also be updated from sources other than props such as listeners
        let [message, setMessage] = useState(() => getMessageState(props, storageMechanism));

        // update message from props when required
        // store the raw value in state and see when it changes
        const rawFromProps = storageMechanism._rawFromProps;
        let nextRaw = rawFromProps(props);
        let [hasRaw, setHasRaw] = useState(false);
        let [prevRaw, setPrevRaw] = useState(null);

        if(
            storageMechanism._updateFromProps
            && (!hasRaw || nextRaw !== prevRaw)
        ) {
            setPrevRaw(nextRaw);
            setHasRaw(true);

            if(hasRaw) {
                message = getMessageState(props, storageMechanism);
                setMessage(message);
            }
        }

        // register this hook with the storage mechanisms sync listener
        // so this hook's state can be made to update from outside react

        storageMechanism._addSyncListener(
            (value) => {
                setMessage(getMessageState(
                    props,
                    storageMechanism,
                    {value}
                ));
            },
            ref
        );

        // remove sync listener when unmount happens
        useEffect(() => () => {
            storageMechanism._removeSyncListener(ref);
        }, []);

        const onChange = (newValue: any) => {
            let updatedValue = storageMechanism._onChangeWithOptions(
                newValue,
                {
                    origin: ref,
                    props
                }
            );

            if(!storageMechanism._updateFromProps) {
                setMessage(getMessageState(
                    props,
                    storageMechanism,
                    {value: updatedValue}
                ));
            }
        };

        return new ReactCoolStorageMessage({
            ...message,
            onChange
        });
    };
};
