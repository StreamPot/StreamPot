import StreamPot from './StreamPot';
import { StreamPotOptions } from "./types";

/**
 * The purpose of this class is to replace itself with a new instance of StreamPot.
 * This is done to allow method chaining without having to instantiate a new StreamPot instance every time (user convenience)
 */
export default class StreamPotFactory extends StreamPot {
    constructor(options: StreamPotOptions) {
        super(options);
        return new Proxy(this, new StreamPotProxyHandler(options));
    }
}

class StreamPotProxyHandler implements ProxyHandler<StreamPotFactory> {
    constructor(protected options: StreamPotOptions) {
    }

    get(target: StreamPotFactory, prop: string | symbol) {
        // @ts-ignore
        if (typeof target[prop] !== 'function') {
            return;
        }

        const instance = new StreamPot(this.options);

        // @ts-ignore
        // Call the method on this specific class instance
        return (instance)[prop].bind(instance);
    }
}
