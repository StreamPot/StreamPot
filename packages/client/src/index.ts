import StreamPot from './StreamPot';
import { StreamPotOptions } from "./types";

/**
 * For user's convenience, this class returns a new StreamPot instance after the first method call.
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
        // Call the method on the specific class instance
        return (instance)[prop].bind(instance);
    }
}
