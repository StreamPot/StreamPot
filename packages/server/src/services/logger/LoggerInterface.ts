export default interface LoggerInterface {
    info(message: string): void;

    error(message: string): void;

    warn(message: string): void;

    debug(message: string): void;
}
