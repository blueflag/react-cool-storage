// @flow

export type OnChange = (newValue: any) => void;

export type ReactCoolStorageMessageConfig = {
    available: boolean,
    onChange: OnChange,
    valid: boolean,
    value: any
};

export type MessageState = {
    available: boolean,
    valid: boolean,
    value: any
};

export default class ReactCoolStorageMessage {

    available: boolean;
    onChange: OnChange;
    valid: boolean;
    value: any;

    constructor(config: ReactCoolStorageMessageConfig) {
        this.available = config.available;
        this.onChange = config.onChange;
        this.valid = config.valid;
        this.value = config.value;
    }

    static unavailable = {
        value: {},
        available: false,
        valid: false
    };
}
