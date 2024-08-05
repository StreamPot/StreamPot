import LoggerInterface from "./LoggerInterface";

export default class ConsoleLogger implements LoggerInterface {
    info(message: string): void {
        console.log(`[INFO] ${message}`);
    }

    error(message: string): void {
        console.error(`[ERROR] ${message}`);
    }

    debug(message: string): void {
        console.log(`[DEBUG] ${message}`);
    }

    warn(message: string): void {
        console.log(`[WARN] ${message}`);
    }
}
