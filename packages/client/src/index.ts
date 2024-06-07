import StreamPot, { StreamPotOptions } from './StreamPot';

export type { JobStatus } from './JobEntity';

/**
 * This is done to return a new instance of StreamPot after the first method call.
 * (for convenience in chaining, to avoid having to re-create a new instance each time)
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
