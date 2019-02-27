// @flow

export type OnChange = (newValue: any) => void;

export type ReactCoolStorageMessageConfig = {
    available: boolean,
    availabilityError: ?string,
    onChange: OnChange,
    storageType: string,
    valid: boolean,
    value: any
};

export type MessageState = {
    available: boolean,
    availabilityError: ?string,
    storageType: string,
    valid: boolean,
    value: any
};

export default class ReactCoolStorageMessage {

    available: boolean;
    availabilityError: ?string;
    onChange: OnChange;
    storageType: string;
    valid: boolean;
    value: any;

    constructor(config: ReactCoolStorageMessageConfig) {
        this.available = config.available;
        this.availabilityError = config.availabilityError;
        this.onChange = config.onChange;
        this.storageType = config.storageType;
        this.valid = config.valid;
        this.value = config.value;
    }

    static unavailable = {
        value: {},
        available: false,
        availabilityError: undefined,
        storageType: undefined,
        valid: false
    };
}
